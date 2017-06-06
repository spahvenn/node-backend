import User from './models/user'
import {Strategy as LocalLoginStrategy} from 'passport-local'
import jwt from 'jsonwebtoken'
import secret from '../secret/secret.json'

const strategy = new LocalLoginStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {

  User.findOne({ 'email': email.trim() }, (err, user) => {
    if (err) return done(err)
    if (!user) return done(null, false)

    if (!user.validPassword(password.trim()))
      return done(null, false)

    // email and password match user in database

    const payload = {
      user: {
        id: user._id,
        email: user.email
      }
    }

    // create a token string
    const token = jwt.sign(payload, secret.jwtSecret);
    const data = {
      email: user.email
    }
    return done(null, token, data);
  })
})

export default strategy;

