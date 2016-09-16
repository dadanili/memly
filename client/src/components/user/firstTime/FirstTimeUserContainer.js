import React, { PropTypes } from 'react'
import FirstTimeUser from './FirstTimeUser'
import axios from 'axios'
class FirstTimeUserContainer extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userFacebook: {}
    }
  }


  componentWillMount() {
    console.log('====================== I AM INSIDE FIRST TIME USER')
    var context = this;
    axios.get('/user/retrieve/profileinfo/')
      .then(function(res) {
        context.setState({
          userFacebook: res.data,
        });
        console.log('checking userFacebook state for EditProfileContainer ------>', context.state.userFacebook);
      });
  }

  changeProfileInfo(name, email, birthday, gender, bio) {
    var context = this;
    console.log('what is inside email', email);
    console.log('hitting changeProfileInfo');
    name = name || this.state.userFacebook.name;
    email = email || this.state.userFacebook.email;
    birthday = birthday || this.state.userFacebook.birthday;
    gender = gender || this.state.userFacebook.gender;
    bio = bio || this.state.userFacebook.bio;

    axios.post('/user/edit/profileinfo/', 
      {name: name, email: email, birthday: birthday, gender: gender, bio: bio})
      .then(function(res) {
        console.log('ClientSide updated profile info successfully');
      })
  }

  render() {
    return(
      <div id="EditProfileContainer">
        <h2>Welcome to Memly, {this.state.userFacebook.name}!</h2>
        <h3>Since you're new here, Tell us about yourself:</h3>
          <FirstTimeUser userFacebook={this.state.userFacebook} changeProfileInfo={this.changeProfileInfo.bind(this)}/>
      </div>
    )
  }

}

export default FirstTimeUserContainer