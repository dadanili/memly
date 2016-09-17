import React from 'react';
import store from '../../App.js';
import { connect } from 'react-redux';
import NearbyJourneys from './nearbyJourneys.js'
import journeysReducer from '../../redux/journeysReducer.js'
import axios from 'axios'

class NearbyJourneysContainer extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    axios.get('/api/nearbyjourneys')
    .then(res => {
      store.dispatch({
        type: 'SET_NEARBY_JOURNEYS',
        journeys: res.data.journeys,
      })
    .catch(err => (
      console.log('Error GETting nearby journeys', err)
      ))
    })
  }

  selectJourney(event) {
    var selectedJourneyIndex = event.target.getAttribute('data-journeyIndex');
    var selected = event.target.getAttribute('data-selected');
    event.target.style.opacity = '0.5';
    store.dispatch({
      type: 'ADD_FAVOURITE_JOURNEY',
      index: selectedJourneyIndex,
    });
  } 

  render() {
    if (this.props.loggedIn) {
      return (
        <div className = "ProfileBoxes nearbyBox">
          <div className = "nearbyContainer">
            <p> Nearby Journeys </p>
            {this.props.journeys.length && this.props.journeys.map((journey, index) => (
              <NearbyJourneys index={index} journey={journey} selectJourney={this.selectJourney.bind(this)}/>
            ))}
          </div>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
};

const mapStateToProps = (state) => ({
  journeys: state.userReducer.nearbyJourneys,
  loggedIn: state.userReducer.isLoggedIn
});

export default connect(mapStateToProps)(NearbyJourneysContainer)