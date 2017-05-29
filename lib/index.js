// initial template from: https://github.com/babel/example-node-server

import passportInit from './passport-init';
var mongoose = require('mongoose');
const express = require('express');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session');
const app = express();
app.use(cookieParser());
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
const passport = passportInit(app);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

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
