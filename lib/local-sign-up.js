import User from './models/user'
import {Strategy as LocalSignUpStrategy} from 'passport-local'

const strategy = new LocalSignUpStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {

  var UserModel = new User();
  const newUser = new User({
    email: email.trim(),
    password: UserModel.generateHash(password.trim()),
  });

  newUser.save((err) => {
    if (err) {
      return done(err);
    }

    return done(null, newUser);
  });
});

export default strategy;

