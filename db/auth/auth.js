var express = require('express');
var passport = require('passport');
var util = require('util');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config.js');
var User = require('../users/userModel.js').userModel;
var env = new config.env();
console.log(env.FACEBOOK_APP_ID);
console.log(env.FACEBOOK_APP_SECRET);
console.log(env.callbackURL);
var MongoStore = require('connect-mongo')(session);
var mongoose = require('../database.js').mongoose;

console.log('mongooses', mongoose.mongoose)
module.exports = function(app) {
  console.log('------------------============================ in AUTO', app)

  app.use(session({ 
    secret: 'sneaky diamonds',
    saveUninitialized: true,
    store: new MongoStore(
    {mongooseConnection:mongoose.connection}
    ),
    resave: false,
    expires: new Date(Date.now() + (30 * 86400 * 1000)),
    cookie: {maxAge:3600000}
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new FacebookStrategy({
    clientID: env.FACEBOOK_APP_ID, // TODO: set process.env.FACEBOOK_APP_ID config vars in heroku
    clientSecret: env.FACEBOOK_APP_SECRET, // TODO: set  process.env.FACEBOOK_APP_SECRET config vars in heroku
    callbackURL: env.callbackURL, // TODO: put website url here
    profileFields: config.profileFields
  }, function(accessToken, refreshToken, profile, done) {
    //console.log('chekcing profile in auth.js', profile);
    User.findOrCreate(profile, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

};
