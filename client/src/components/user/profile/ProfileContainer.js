import React, { PropTypes } from 'react'
import Profile from './Profile'
import axios from 'axios'
import { connect } from 'react-redux'
import * as userActions from '../../../redux/userReducer'

class ProfileContainer extends React.Component {

  
  static propTypes = {
    isLoggedIn: PropTypes.bool, 
    user: PropTypes.object,
    userFacebook: PropTypes.object,
    memlyCount: PropTypes.number,
    // birthday: PropTypes.string,
  };

  constructor(props){
    super(props);
  //   this.state = {
  //     //some hardcoded user data for test purposes
  //     user: {name: 'John Doe', bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", city:'San Francisco', photo: 'https://scontent.fsnc1-3.fna.fbcdn.net/t31.0-8/11232282_10153700263958254_6749315989191466632_o.jpg', myMemlys: [{url: 'https://scontent.fsnc1-3.fna.fbcdn.net/t31.0-8/10265664_10152863685678254_2720788227246186432_o.jpg' , location: 'New York'}, {url: 'https://scontent.fsnc1-3.fna.fbcdn.net/v/t1.0-9/11692782_10153548376573254_4076114351065122781_n.jpg?oh=98d0d35e39a1b376c806bee7bb47f075&oe=584175A8', location: 'San Francisco'}], likedMemlys: [{url: 'https://scontent.fsnc1-3.fna.fbcdn.net/t31.0-8/13938311_1131762946908530_6242907422971776062_o.jpg', location: 'San Jose'}, {url: 'https://scontent.fsnc1-3.fna.fbcdn.net/v/t1.0-9/14225455_1107962689239467_1782382838638034127_n.jpg?oh=f36a23bd6873261d9569822fc59db40e&oe=58541FE4', location: 'Napa'}]},
  //     userFacebook: {},
  //     memlyCount: 99
  //   }
    // if(!props.isLoggedIn){
    //   context.router.push('/');
    // }
  }



  DateParser(date) {
    console.log('checking date format', date);
    var dateArray = date.split('/');
    var month = Number(dateArray[0]);
    if (month === 1) {
      month = 'January';
    } else if (month === 2) {
      month = 'February';
    } else if (month === 3) {
      month = 'March';
    } else if (month === 4) {
      month = 'April';
    } else if (month === 5) {
      month = 'May';
    } else if (month === 6) {
      month = 'June';
    } else if (month === 7) {
      month = 'July';
    } else if (month === 8) {
      month = 'August';
    } else if (month === 9) {
      month = 'September';
    } else if (month === 10) {
      month = 'October';
    } else if (month === 11) {
      month = 'November';
    } else if (month === 12) {
      month = 'December';
    }

    var day = Number(dateArray[1]);
    var year = dateArray[2];

    var dateFormatted = `${month} ${day}, ${year}`;
    return dateFormatted;
  }


  componentDidMount() {
    console.log(this.props, 'profileComponentWillMount');
    // var context = this;
    this.props.dispatch(userActions.userAuth());

    //turn isLogged in as true so nav bar shows logged in buttons
    axios.get('/user/retrieve/profileinfo/')
      .then((res) => {
        this.props.dispatch(userActions.updateUserFacebook(res.data));
        this.props.dispatch(userActions.updateMemlyCount(res.data.memlys.length))
        console.log('checking userFacebook props ------>', this.props.userFacebook.memlys.length);
        // res.data.birthday = this.DateParser(res.data.birthday);
        // this.props.dispatch(userActions.updateUserBirthday(res.data.birthday));
        return res;
      })
      // .then((res) => {
      //   res.data.birthday = this.DateParser(res.data.birthday);
      //   //why are we doing this twice? 
      //   this.props.dispatch(userActions.updateUserBirthday(res.data.birthday));
      //   this.props.dispatch(userActions.updateMemlyCount(res.data.memlys.length));
      //   this.props.dispatch(userActions.updateUserFacebook(res.data));
        
      //   // context.setState({
      //   //   userFacebook: res.data,
      //   //   memlyCount: res.data.memlys.length
      //   // });


      // });
    // this.props.changeNavToAlreadyLoggedIn();
  }


  // componentDidMount(){
  //   console.log(this.props, 'profileComponentDidMount'); 
  //   // props.isLoggedIn should be TRUE...
  // }

  componentWillReceiveProps(props, next) {
    console.log(props, next, 'ProfileContainer componentWillReceiveProps')
  }
//SEE NOTE BELOW
  // updateUserData(data) {
  //   console.log('calling updateUserdata', data);
  //   this.setState({
  //     userFacebook: data
  //   });
  // }



  render() {

  //BECAUSE OF HOW REDUX WORKS. CHILDREN WILL BE ABLE TO CHANGE AND OBTAIN STATE!
    // var context = this;
    // var childUpdateUserData = this.updateUserData.bind(this);
    // const childrenWithProps = React.Children.map(this.props.children,
    //   (child) => React.cloneElement(child, {
    //     updateUserData: childUpdateUserData,
    //   })
    // );

    return(
      <div>
        <Profile user = {this.props.user} userFacebook = {this.props.userFacebook} memlyCount={this.props.memlyCount} />
        {this.props.children}
      </div>
      )
  }

}

function mapStateToProps(state) {
  console.log('----------------------', state.userReducer, state.userReducer.userFacebook);
  return {
    isLoggedIn: state.userReducer.isLoggedIn,
    user: state.userReducer.user,
    userFacebook: state.userReducer.userFacebook,
    memlyCount: state.userReducer.memlyCount,
    birthday: state.userReducer.birthday,
  }
}

ProfileContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(ProfileContainer)
