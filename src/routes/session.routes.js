import { Router } from 'express'
import UserModel from '../dao/models/userModel.js'
import bcrypt from 'bcrypt'
import passport, { use } from 'passport'
import { configPassport } from '../config/passport.config.js'
import { generateToken, sendPassResetMail } from '../helpers/passwordReset.js'

const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app'); 

describe('Sessions API', () => {
    it('Debería devolver un mensaje de error si se proporcionan credenciales incorrectas', (done) => {
        request(app)
            .post('/api/sessions/login')
            .send({ email: 'usuario@example.com', password: 'contraseñaincorrecta' })
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('status').equal('error');
                done();
            });
    });
});

describe('Sessions API', () => {
    it('Debería permitir iniciar sesión con credenciales válidas', (done) => {
        request(app)
            .post('/api/sessions/login')
            .send({ email: 'usuario@example.com', password: 'contraseña' })
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('status').equal('success');
                expect(res.body).to.have.property('payload');
                done();
            });
    });

    it('Debería devolver un mensaje de error si se proporcionan credenciales incorrectas', (done) => {
        request(app)
            .post('/api/sessions/login')
            .send({ email: 'usuario@example.com', password: 'contraseñaincorrecta' })
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('status').equal('error');
                done();
            });
    });
});

const router = new Router()
class UserDTO {
    constructor(fullName, email, age) {
        this.fullName = fullName;
        this.email = email;
        this.age = age
    }
}

router.post("/register", async (req,res) => {
    const { first_name, last_name, email, age, password } = req.body;

    const exists = await userModel.findOne({email})

    if(exists) {
        return res.status(400)
        .send({
            status: "error",
            error: "El usuario ya existe."
        })
    }

    const hashContraseña = await bcrypt.hash(password, 10)

    const user = {
        first_name,
        last_name,
        email,
        age,
        password: hashContraseña
    }

    user.role = (email === "adminCoder@coder.com" && password === "adminCod3r123") ? "admin" : "usuario"

    let result = await userModel.create(user)
    res.send({
        status: "success",
        message: "Usuario registrado!"
    })
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({email, password})

    if(!user) {
        return res.status(400).send({
            status:"Error",
            error: "Datos incorrectos"
        })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if(!validPassword) {
        return res.status(400).send({status: "error", error: "Datos incorrectos"})
    }

    req.session.user = {
        full_name: `${user.first_name} ${user.last_name}`,
        email: `${user.email}`,
        age: `${user.age}`,
        role: user.role
    }
    res.redirect('/')

    res.send({
        status: "success",
        payload: req.session.user,
        message: "Inicio de sesión exitoso"
    })
})

router.post('/forgot-password', async (req,res) => {
    const { email } = req.body

    try {
        const user = await UserModel.findOne({email})

        if (!user) {
            return res.status(404).json({error: 'El usuario no existe'});
        }

        const resetToken = generateToken(user.id);
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        await sendPassResetMail(email, resetToken)

        return res.status(200).json({ message: 'Correo electrónico de restablecimiento enviado' });
    } catch (error) {
    console.error('Error al solicitar el restablecimiento de contraseña:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/current', isUser, (req, res) => {
    const { full_name, email, age } = req.user;
    const userDTO = new UserDTO(full_name, email, age);
    res.json({
        status: "success",
        user: userDTO
    });
});

router.get('/github', passport.authenticate('github'))

router.get('/github/callback', passport.authenticate('github', {
    successRedirect: "/",
    failureRedirect: '/login'
}))

router.get('/logout', (req, res) => {
    req.session.destroy(err =>  {
        if (err) {
            return res.status(500).send({
                status: "success",
                message:"No se pudo desloguear"
            })
        }
        res.redirect('/login')
    })
})

export default router