import React, { PropTypes, Component } from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'
import shallowCompare from 'react-addons-shallow-compare'
import controllable from 'react-controllables' //need to look into use for this... allows you to control prop types somehow...
import GoogleMap from 'google-map-react'
import update from 'react-addons-update'
import axios from 'axios'
import { connect } from 'react-redux'
import store from '../../../App'
import RecommendationPresentation from './presentation.js'

class RecommendationContainer extends Component {

  constructor(props) {
    super(props);
  }
  componentWillMount() {
  }

  geolocate(callback){
    if (navigator.geolocation) {
      // Assign interval to "window.geolocator" so we can clear the interval later if needed
        navigator.geolocation.getCurrentPosition((position) => {
          // Log coordinates for development
          // if (process.env.NODE_ENV === 'development') {
            console.log('omggg', position.coords.latitude, position.coords.longitude);
          // };
          callback({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        this.props.dispatch({
          type: 'UPDATE_USER_LOCATION',
            userLocation: {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }});
        }, function() {
          // Error handler for "navigator.geolocation.getCurrentPosition()"
          // Clear further geolocation's upon failure so we don't get repeat errors
          if (window.geolocator) {
            window.clearInterval(window.geolocator);
          };
          console.error('Geolocation failed');
        });
    } else {
      console.error('Your browser doesn\'t support geolocation');
    }
  }

  componentDidMount() {
    var context = this;

    this.geolocate(function(location) {
      // console.log('dani', this.props.location)
      axios.get('/user/recommendations', {params:{location: location, query: context.props.query}})
      .then(res=>{

        var urlList = res.data.photos.photo.map(photo=> {
          return `http://c${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
        })
        store.dispatch({
          type: 'PHOTO_RECOMMENDATIONS',
          recommendations: urlList
        })
      })

    })
  }

  submit(e) {
    console.log('in submit')
    this.props.dispatch({
        type: 'SELECTED_MEMLYS', 
        selection: this.props.selection
    })
    const path = '/addtitle'
    hashHistory.push(path)
    
  }

  addCaption(e, url, order) {
    var page = this.props.selection[order];
    page.caption = e.target.value;

  }
          // {this.props.selection && this.props.selection.map((page, index)=> <CaptionPresentation url={page.imgUrl} order={index} addCaption={this.addCaption.bind(this)}/>)}


  render() {

    return(
      <div className = "ProfileBoxes">
       <button type="submit" className = "editProfileButton'" value="submit" onClick={this.submit.bind(this)} ref={(c) => this.button = c} >Submit</button>
        <div className ="MemlysContainer">
          {this.props.recommendations && this.props.recommendations.map(rec=> <RecommendationPresentation url= {rec} />)}
        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    query: state.userReducer.query,
    recommendations: state.userReducer.recommendations,
    // location: state.userReducer.userLocation,
    selection: state.userReducer.selection
  }
}

export default connect(mapStateToProps)(RecommendationContainer)



