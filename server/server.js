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
var watson = require('watson-developer-cloud');
var watsonKeys = require('../db/watson/keys.js');
var watsonFunctions = require('./watson.js')
var GoogleMap = require('google-map-react');

//------ instantiate app. connect middleware. -----//
var app = express();
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
console.log('------------------------this is auth', auth)
auth(app);
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));
app.use(morgan('dev'));
app.use(bodyParser.json());
var request = require('request');
app.use(function(req, res, next) {
  // if now() is after `req.session.cookie.expires`
  //   regenerate the session
  if(new Date() > req.session.cookie.expires) {
    console.log('expired!!')

  }
  next();
});

// request({
//   method: 'POST', 
//   url: 'https://gateway-a.watsonplatform.net/calls/url/URLGetEmotion',
//   qs: {apikey: watsonKeys, }
// }
console.log('egg', watsonKeys.flickerKey.Key)

request({
    url: 'http://api.flickr.com/services/rest/?',
    method: 'flickr.places.find',
    qs: { //URL to hit
    // qs: {}
    api_key: watsonKeys.flickerKey.Key,
    query: 'San Francisco'},
    // method: 'GET'
  }, function (error, response, body) {
    // if (!error && response.statusCode == 200) {
        console.log('danni', response); // Show the HTML for the Modulus homepage.
    // }
});

// var getLocation = function(req, res, next) {
//   console.log('waaaaaaattt')
//   var userID = req.session.passport.user['_id'];
//   User.findOne({_id: userID})
//   .exec(function(err, user) {
//     console.log('uuuuuuuser', user.meta.lastLogInLocation)
//     req.location = {
//       lat: user.meta.lastLogInLocation.lat,
//       lng: user.meta.lastLogInLocation.lng,
//     }
//   })
//   next();
// }
var getPhotos = function(req, res) {
  console.log('GOT LAT LONG', req.query.location);
  var location = req.query.location;
  request({
    url: 'https://api.flickr.com/services/rest/?', 
    qs: {method: 'flickr.places.findByLatLon', api_key: watsonKeys.flickerKey.Key, lon: location.lon, lat: location.lat}
    // method=flickr.places.find&api_key=cbfb84b23a5a7af2a0bf27cc8a87d85b&query=san+francisco',
    // method: 'GET'
  }, function (error, response, body) {
    // if (!error && response.statusCode == 200) {
      var start = body.indexOf('woeid');
      var woeid = body.slice(start +7, start + 15);
      console.log('-------------in get photo------------------', req.query.query)
    request({
        url: 'https://api.flickr.com/services/rest/?', 
        qs: {method: 'flickr.photos.search', 
        api_key: watsonKeys.flickerKey.Key, 
        woeid: woeid, 
        text: req.query.query, 
        radius: 1,
        format: 'json',
        radius_units: 'mi',
        sort: 'relevance',
        per_page: 20,
        page: 1,
        nojsoncallback: 1
      }
      }, function (error, response, body) {
        res.send(body)
        // if (!error && response.statusCode == 200) {
            console.log('eggieeggie', body); // Show the HTML for the Modulus homepage.
        // }
    })
})
}
app.get('/user/retrieve/similarPhotos', function(req, res){

  console.log('in server similarPhotos =================', req.query.urls)
  var allInfo = [];
  req.query.urls.map(url=>watsonFunctions.runVisualRecognition(url, function(data) {
    console.log('got data from Watson!!!!', data, data.custom_classes),
    allInfo.push(data)
    if(allInfo.length === req.query.urls.length) {
      console.log('all info', allInfo)
      res.send(allInfo)
    }


  }))
  
});

app.get('/user/retrieve/personality', function(req, res){

  console.log('in server similarPhotos =================', req.query.captions)
  var allInfo = [];
  var text = '';
  for(var i = 0; i < 50; i++) {

  req.query.captions.forEach(cap=>{text = text + ' ' + cap});
}
  console.log('text==================', text)

  console.log('text=================2=', text)
  watsonFunctions.runPersonalityInsight(text, function(data) {
    console.log('got data from Watson!!!!', data),
  
      res.send(data)

  })
  
});

app.get('/user/recommendations', function(req, res){
  getPhotos(req, res)

});

app.get('/user/retrieve/', function(req, res){
  getPhotos(req, res)

});
  // meta: {
  //   lastLogInLocation: {
  //     lat: Number,
  //     lng: Number
  //   },
// navigator.geolocation.getCurrentPosition((position) => {
//   // Log coordinates for development
//   if (process.env.NODE_ENV === 'development') {
//     console.log('=====================',position.coords.latitude, position.coords.longitude);
//   };
// })
// URL: https://api.flickr.com/services/rest/?method=flickr.places.findByLatLon&api_key=cbfb84b23a5a7af2a0bf27cc8a87d85b&lat=37.747&lon=-122.439&format=rest&api_sig=3c3f7e25245c955acd55e870f57cf739




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
  debugger;
  console.log('AM I HITTING APP.GET?????');
  res.render('index');
});

app.get('/test/api/nearbyjourneys', function(req, res) {
  res.send({
    journeys: [
      {
        userId: '3lkjrlfjei3orjlkf',
        username: 'Leia',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Princess_Leia\'s_characteristic_hairstyle.jpg',
        journeyTitle: 'Story of my life',
        visits: 1,
        createdDate: '2016-09-15T03:05:39.182Z',
        pages: [
          {
            order: 0,
            memlyId: 'jfkljfj3239283492fj',
            imgUrl: 'http://dagobah.net/t200/poptartcat.jpg',
            location: {
              lat: 37.7929053,
              lng: -122.399253
            },
            caption: 'This is where I fell down.'
          },
          {
            order: 1,
            memlyId: 'saldkjfsselej',
            imgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg',
            location: {
              lat: 19.2323,
              lng: 44.4
            },
            caption: 'So scare'
          },
          {
            order: 2,
            memlyId: 'hoopadoop',
            imgUrl: 'https://pbs.twimg.com/profile_images/616542814319415296/McCTpH_E.jpg',
            location: {
              lat: -167.9,
              lng: - 14
            },
            caption: 'I\'m grumpy.'
          },
        ],
      }
    ]
  });
});

app.get('/test/user/journeys', function(req, res) {

 res.send({
    journeys: [
      {
        userId: '3lkjrlfjei3orjlkf',
        journeyTitle: 'Story of my life',
        visits: 1,
        createdDate: '2016-09-15T03:05:39.182Z',
        pages: [
          {
            order: 0,
            memlyId: 'jfkljfj3239283492fj',
            imgUrl: 'http://dagobah.net/t200/poptartcat.jpg',
            location: {
              lat: 37.7929053,
              lng: -122.399253
            },
            caption: 'This is where I fell down.'
          },
          {
            order: 1,
            memlyId: 'saldkjfsselej',
            imgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg',
            location: {
              lat: 19.2323,
              lng: 44.4
            },
            caption: 'So scare'
          },
          {
            order: 2,
            memlyId: 'hoopadoop',
            imgUrl: 'https://pbs.twimg.com/profile_images/616542814319415296/McCTpH_E.jpg',
            location: {
              lat: -167.9,
              lng: - 14
            },
            caption: 'I\'m grumpy.'
          },
        ],
      }
    ]
  });
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