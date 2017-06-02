// initial template from: https://github.com/babel/example-node-server

import googleLoginStrategy from './google-login';
import localSignUpStrategy from './local-sign-up';
import localLoginStrategy from './local-login';


import passport from 'passport';
import User from './models/user';
var mongoose = require('mongoose');
const express = require('express');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session');
const app = express();
app.use(cookieParser());
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use('google', googleLoginStrategy);
passport.use('local-sign-up', localSignUpStrategy);
passport.use('local-login', localLoginStrategy);


passport.serializeUser(function(user, cb) {
  cb(null, user.id);
})

passport.deserializeUser(function(id, cb) {
  User.findById(id, function (err, user) {
    cb(err, user);
  });
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/node-backend');

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header('Access-Control-Expose-Headers', 'token');
  next();
}

app.use(allowCrossDomain);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  app.post('/signup',
    passport.authenticate('local-sign-up'),
    (req, res) => {
      return res.status(200).json({
        success: true,
        message: 'Sign up successful, you can now log in'
      });
    }
  )

  app.post('/login', (req, res, next) => {
    return passport.authenticate('local-login', (err, token, userData) => {

      if (err) {
        return res.status(400).json({
          success: false,
          message: 'There was a problem with login.'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Successfully logged in',
        token,
        user: userData
      });
    })(req, res, next)
  })

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/profile');
    }
  );

  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

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
