//node dependencies for server
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var routes = require('./serverRoutes.js');
var path = require('path');
var session = require('express-session');
var port = process.env.PORT || 3000;
var auth = require('../db/auth/auth.js');
var passport = require('passport');
var authConfig = require('../db/auth/config.js');
var logout = require('express-passport-logout');
var User = require('../db/users/userModel.js').userModel;
var mongoose = require('mongoose');
var db = require('../db/database.js');
var helper = require('./helperFunctions.js');
var createAndSaveNewJourney = require('../db/journey/journeyUtils.js').createAndSaveNewJourney;
var Journey = require('../db/journey/journeyModel').journeyModel;
//------ instantiate app. connect middleware. -----//
var app = express();
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
console.log('------------------------this is auth', auth)
auth(app);
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));
app.use(morgan('dev'));
app.use(bodyParser.json());


app.use(function(req, res, next) {
  // if now() is after `req.session.cookie.expires`
  //   regenerate the session
  if(new Date() > req.session.cookie.expires) {
    console.log('expired!!')

  }
  next();
});


// Configure our server with the passport middleware


// This runs our app through some middleware that allows saving to our database
// CURRENTLY JUST IMAGES ARE CONFIGURED TO BE SAVED
require('./../db/database').app(app);

//--- route config ----- //

app.get('/getTest', routes.getTest);
app.post('/postTest', routes.postTest);

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback

app.get('/auth/facebook', passport.authenticate('facebook', { scope: authConfig.scope }));

// app.get('/auth/facebook', passport.authenticate('facebook'));

//TESTING to see if login button is hitting here----
// app.get('/auth/facebook', function(req, res) {
//   console.log('the login button was clicked and hitting here');
//   res.send('it hit here on the server');
// });
//--------//
// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.

app.get('/', helper.isLoggedIn, function(req, res) {
  console.log('AM I HITTING APP.GET?????');
  res.render('index');
});


app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: 'http://localhost:3000/#' }),
  function(req, res) {
    //console.log('LOGIN SUCCESS NOW SHOW ME THE USER---------------------->', req.user);
    console.log('SHOW ME WHAT THIS SESSION IS------------>', req.session.passport.user);
    res.redirect('http://localhost:3000/#/user/profile/');
  });


//helper function to check if a user session has been created.
// var isLoggedIn = function(req, res, next) {
//   console.log('I am hitting isLoggedIn helper function');
//   if (!req.session.passport) {
//     console.log('no passport session sorry!!!');
//     res.redirect('http://localhost:3000/#');
//   } else if (!req.session.passport.user) {
//     console.log('no passport user defined. maybe next time????');
//     res.redirect('http://localhost:3000/#');
//   } else {
//     next();
//   }
// };
//check login for rerouting on client side 
app.get('/isloggedin', helper.isLoggedIn, function(req, res) {
  res.sendStatus(202);
});

//not for facbeook auth.. this is for profile button?
app.get('/user/profile/', helper.isLoggedIn, function(req, res) {
  console.log('am i hitting my get user profile');
  res.redirect('http://localhost:3000/#/user/profile/');
  // }
});


//function to pass information from database to client
app.get('/user/retrieve/profileinfo/', helper.isLoggedIn, function(req, res) {
  console.log('in server user retrieve endpoints')
  if (req.session.passport.user) {
    var userID = req.session.passport.user['_id'];
    //console.log('checking to make sure this is the right ID', userID);
    User.findOne({_id: userID}).exec(function(err, found) {
      if (err) {
        res.status(404).send('I got a bad feeling about this....');
      }
      if (found) {
        //console.log('what is found????????????', found);
        res.status(200).send(found);
      } else {
        res.redirect('http://localhost:3000/#');
      }
    });
  } else {
    res.redirect('http://localhost:3000/#');
  }


});

app.put('/user/like-memly', function(req, res) {
  if (req.session.passport.user) {
    var userID = req.session.passport.user['_id'];
    User.findOneAndUpdate({_id: userID}, {$push: {'likedMemlys': req.body}}, {new: true}, function(err, user) {
      if (err) {
        console.log(err);
      }
      res.send(user);
    });
  } else {
    res.error('User must log in before doing that!');
  }
});

app.put('/user/dislike-memly', function(req, res) {
  if (req.session.passport.user) {
    var userID = req.session.passport.user['_id'];
    User.findOneAndUpdate({_id: userID}, {$push: {'dislikedMemlys': req.body}}, {new: true}, function(err, user) {
      if (err) {
        console.log(err);
      }
      res.send(user);
    });
  } else {
    res.error('User must log in before doing that!');
  }
});

app.post('/user/edit/profileinfo/', helper.isLoggedIn, function(req, res) {
  //console.log('i hit my post request for edit profile', req.body);
  var userID = req.session.passport.user['_id'];
  //console.log('whats in my editProfile post request ------>', req.body);
  var name = req.body.name;
  var email = req.body.email;
  var birthday = req.body.birthday;
  var gender = req.body.gender;
  var bio = req.body.bio;

  User.findOne({_id: userID}).exec(function(err, found) {
    if (err) {
      res.status(404).send('couldnt find the model ur looking for');
    }
    if (found) {
      //console.log('checking found in editProfile', found);
      found.name = name;
      found.email = email;
      found.birthday = birthday;
      found.gender = gender;
      found.bio = bio;
      found.save((function(err, User) {
        if (err) {
          //console.log('am i hitting error in edit profile???????');
          res.status(500).send(err);
        }
        //console.log('i successfully edited my profile and just saved ----->');
        res.status(200).send(found);
      }));
    } else {
      res.redirect('http://localhost:3000/#');
    }
  });

});

//app.get('/user/journey/', function(req, res) {
app.get('/user/journey/', helper.isLoggedIn, function(req, res) {
  if (req.session.passport.user) {
    var userID = req.session.passport.user['_id'];
    //var userID = 'asdfasdfasdf12341234';
    Journey.find({userId: userID}).exec(function(err, found) {
      if (err) {
        res.status(404).send('I don\' know who you are!');
      } else {
        res.status(200).json({journeys: found});
      }
    }); 
  } else {
    //var userID = 'asdfasdfasdf12341234';
    res.redirect('http://localhost:3000/#');
  }

});

//app.post('/user/journey/', function(req, res) {
app.post('/user/journey/', helper.isLoggedIn, function(req, res) {

  if (req.session.passport.user) {
    createAndSaveNewJourney(req, function() {
      res.sendStatus(201);
    });
  } else {
    res.redirect('http://localhost:3000/#');
  }

});

//Log out of session
app.get('/logout', function(req, res) {
  console.log('I HIT LOGOUT, checking if theres a session made', req.session);
  req.logOut();
  res.status(200).send('destroy session');
});

app.listen(port, function() {
  console.log('server listening on ' + port);
});