// initial template from: https://github.com/babel/example-node-server

var mongoose = require('mongoose');
const express = require('express');

var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var bodyParser = require('body-parser')


var secret = require('./secret/secret.json');


const app = express();

app.use(require('cookie-parser')());


app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())


passport.use(
  new GoogleStrategy({
    clientID: secret.clientId,
    clientSecret: secret.secret,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      return done(null, profile);
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
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
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

  app.get('/profile', function (req, res) {
    res.send('This info gotten from google profile: '+req.user.displayName)
  });

  app.get('/', function (req, res) {
    res.send('Hello World!')
  });

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  })

});
