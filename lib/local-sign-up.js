import User from './models/user'
import {Strategy as LocalStrategy} from 'passport-local'

const strategy = new LocalStrategy({
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

