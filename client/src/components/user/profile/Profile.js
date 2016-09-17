import React from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'
import {Grid, Row, Col, Nav, NavItem} from 'react-bootstrap'
import JourneyPlayerContainer from '../journeyPlayer/journeyPlayerContainer.js'


const Profile = (props) => {

  var aboutMe;
  if (props.userFacebook.bio) {
    aboutMe =           <Row className ="show-grid profileRow">
            <span><b>About me:</b> {props.userFacebook.bio}</span>
          </Row>;
  } else {
    aboutMe = undefined;
  }

  const divStyle = {
    backgroundImage: 'url(' +props.userFacebook.profilePhotoUrl+ ')',
    backgroundPosition:'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  }



  // return (

  //   <div id="myProfile">
  //     <div id="profilePhotoContainer" style={divStyle}>
  //       <div id="profilePhotoWrapper">
  //       </div>
  //     </div>
  //     <div id="profileBioContainer">
  //       <span id= "profileName">{props.userFacebook.name}</span>
  //     </div>

  //   </div>


  // )


  return (

    <Grid>
      <Row className="show-grid" id="player-container">
        <Col sm={12}>
        <JourneyPlayerContainer/>
        </Col>
      </Row>
      <Row className = "show-grid" id ="userProfileContainer">
        <div>
          <Col sm={4}><img id = "profilePhoto" src={props.userFacebook.profilePhotoUrl}/></Col>
        </div>
        <Col sm={8}>
          <Row className ="show-grid profileName">
            <span id= "profileName">{props.userFacebook.name}</span>
          </Row>
          <Row className ="show-grid profileRow">
            <span><b>Email:</b> {props.userFacebook.email}</span>
          </Row>
          <Row className ="show-grid profileRow">
            <span><b>Age is just a number:</b> {props.userFacebook.birthday}</span>
          </Row>
          {aboutMe}
          <Row className ="show-grid profileRow">
            <span><b>Memlys Made:</b> {props.memlyCount}</span>
          </Row>
          <Row className ="show-grid profileRow">
            <button size="30" onClick={e=> {
              const path = '/selection';
              hashHistory.push(path); }
            }>Make New Journey</button>
          </Row>
          
        </Col>
    </Row>

    <Row id = "MemlyNavSelector">
      <span className="MemlyNavItem"><Link to ="user/profile" id="MemlyNavItemText">My Memlys ></Link></span>
      <span className="MemlyNavItem"><Link to = "/journeys" id="MemlyNavItemText2">My Journeys ></Link></span>
      <span className="MemlyNavItem"><Link to ="/likedmemlys" id="MemlyNavItemText2">Memlys I Like ></Link></span>
      <span className="MemlyNavItel"><Link to="/likedjourneys" id="MemlyNavItemText2">Journeys I Like ></Link></span>
      <span className="MemlyNavItem"><Link to ="/edit" id="MemlyNavItemText3">Edit Profile ></Link></span>
       
    </Row>
    </Grid>
  )
}





  


export default Profile