import crypto from 'crypto'
import nodemailer from 'nodemailer'

export const generateToken = () => {
    return crypto.randomBytes(32).toString('hex')
};

export const calculateExpirationDate = () => {
    const now = new Date()
    return new Date(now.getTime() + 60 * 60 * 1000)
};

export const saveResetToken = async (userId, token) => {
    const expirationDate = calculateExpirationDate()
}

const userId = 'ID_DEL_USER'
const resetToken = generateToken()

saveResetToken(userId, resetToken)

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'correo@gmail.com',
        pass: 'contraseñaCoder',
    },
});

export const sendPassResetMail = async (recipientEmail, resetToken) => {
    const resetLink = `https://Desafio12.com/reset-password?token=${resetToken}`;
    const mailOptions = {
        from: 'correo@gmail.com',
        to: recipientEmail,
        subject: 'Restablecer contraseña',
        html:  `<p>Hola,</p>
                <p>Puedes restablecer tu contraseña <a href="${resetLink}">aquí</a>.</p>`
    };

    try {
        await transporter.sendMail(mailOptions)
        console.log('Correo electronico enviado exitosamente')
    } catch (error) {
        console.error('Error al enviar el correo electronico', error)
    }
};

const recipientEmail = 'correo_destinatario@gmail.com'
sendPassResetMail(recipientEmail, resetToken);

