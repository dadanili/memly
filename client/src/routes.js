//File contains the route setup to be exported to be used by App.js
import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import HomeContainer from './components/home/HomeContainer';
import MyMemlysContainer from './components/user/myMemlys/MyMemlysContainer';
import MyJourneysContainer from './components/user/myJourneys/myJourneysContainer';
import LikedMemlysContainer from './components/user/likedMemlys/LikedMemlysContainer';
import LikedJourneysContainer from './components/user/likedJourneys/likedJourneysContainer';
import ProfileContainer from './components/user/profile/ProfileContainer';
import EditProfileContainer from './components/user/editProfile/EditProfileContainer';
import ImageUploadContainer from './components/media/upload/ImageUploadContainer';
import GoogleMapContainer from './components/map/map/container';
import SelectionContainer from './components/createJourney/selection/container';
import CaptionContainer from './components/createJourney/addCaption/container'
import TitleContainer from './components/createJourney/addTitle/container'
import Title2Container from './components/createJourney/addTitle/titleContainer'
import RecommendationContainer from './components/createJourney/recommendations/container'
import axios from 'axios'


var routes = (
  <Router history={hashHistory}>
    <Route path='/' component={HomeContainer}>
      <IndexRoute component={GoogleMapContainer}/>
      <Route path='/logout' component={GoogleMapContainer}/>
      <Route path='/user/profile' component={ProfileContainer}>
        <IndexRoute component={MyMemlysContainer} />
        <Route path="/journeys" component={MyJourneysContainer} />
        <Route path='/likedmemlys' component={LikedMemlysContainer} />
        <Route path='/likedjourneys' component={LikedJourneysContainer}/>
        <Route path='/edit' component={EditProfileContainer}/>
      </Route>
      <Route path='/photo' component={ImageUploadContainer}/>
      <Route path='/selection' component={SelectionContainer} />
      <Route path='/addcaptions' component={CaptionContainer} />
      <Route path='/recommendations' component={RecommendationContainer} />

      <Route component={TitleContainer}>
        <Route path='/addtitle' component={Title2Container} />
      </Route>
    </Route>
  </Router>
)

// you can use an onEnter hook before entering routes to check if user is authorized. (i.e. can check the state logged in or not)
// this is a good way to do client side route protection. Without this, although they may not be able to see any of their data, anyone can still enter /user/profile route
function checkAuth(nextState, replace, callback){
  //the fact that we have been rerouted by server to here means that we are authorized to be here
  //but what if someone manually enters.. 'https:localhost:3000/user/profile'?
  //**** UNCOMMENT LINE BELOW TO SEE HOW onENTER HOOK WORKS ****//
}

export default routes