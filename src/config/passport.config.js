import passport from "passport";
import session from "express-session";
import passportLocal from 'passport-local'
import passportGitHub from 'passport-github2'
import UserModel from '../dao/models/userModel.js'

const LocalStrategy = passportLocal.Strategy
const GitHubStrategy = passportGitHub.Strategy

export const configPassport = (app) => {
    app.use(session({
        secret: 'SecretKey',
        resave: false,
        saveUninitialized: false
    }))

    app.use(passport.initialize())
    app.use(passport.session)

    passport.serializeUser((user, done) => {
        done(null, user.id)
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findById(id)
            done (null, user)
        } catch (error) {
            done(error, null)
        }
    })

    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email })
                if(!user || !user.comparePass(password)) {
                    return done (null, false, { message: 'Email incorrecto' })
                }
                return done (null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use(new GitHubStrategy(
        {
            clientID: 'GITHUB_CLIENT_ID',
            clientSecret: 'GITHUB_CLIENT_SECRET',
            callbackURL: 'http://localhost:8080/api/sessions/github/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0]?.value

                if(!email) return done(null, false, { message:'GitHub email no encontrado' })
                const user = await UserModel.findOne({ email })

                if(user) return done(null, user)

                const newUser = new UserModel({
                    first_name: profile.displayName,
                    email,
                    role: 'user'
                })

                await newUser.save()
                return done(null, newUser)
            } catch (error) {
                return done(error)
            }
        }
    ))
}
