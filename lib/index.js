// initial template from: https://github.com/babel/example-node-server

import User from './models/user.js';

var mongoose = require('mongoose');
const express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var bodyParser = require('body-parser')
var secret = require('../secret/secret.json');
var cookieParser = require('cookie-parser')
var expressSession = require('express-session');

const app = express();

app.use(cookieParser());
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
passport.use(
  new GoogleStrategy({
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
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});

mongoose.connect('mongodb://localhost/node-backend');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/profile');
    }
  );

  app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email'] }));

  app.get('/profile', function (req, res) {
    res.send('This info gotten from google profile: '+req.user.name)
  });

  app.get('/', function (req, res) {
    res.send('Hello World!')
  });

  app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
  })

});
