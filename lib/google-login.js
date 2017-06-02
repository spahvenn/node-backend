import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import secret from '../secret/secret.json';
import User from './models/user';

const strategy = new GoogleStrategy({
    clientID: secret.clientId,
    clientSecret: secret.secret,
    callbackURL: "http://localhost:3001/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    const email = profile.emails[0].value;

    console.log(profile);

    User.findOrCreate(
      {googleId: profile.id},
      {googleId: profile.id, name: profile.displayName, email: email},
      function(err, user) {
        done(err, user);
      }
    );
  }
)

export default strategy
