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
    this.pages = [];
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
    console.log('in submit', this.pages, this.props.selection)
    this.props.dispatch({
        type: 'SELECTED_MEMLYS', 
        selection: this.props.selection.concat(this.pages)
    })
    const path = '/addtitle'
    hashHistory.push(path)
    
  }

  addCaption(e, url, order) {
    var page = this.props.selection[order];
    page.caption = e.target.value;

  }

select(e) {
    // console.log('in select event', e.target.getAttribute('data-url');
      var url = e.target.getAttribute('data-url');
      var selected = e.target.getAttribute('data-selected');

      if (selected === 'false') {
        e.target.style.opacity = '0.5';

        var page = {
          order: this.currOrder,
          imgUrl: url
        }

        e.target.childNodes[0].nodeValue = 'dani';

        this.button.disabled = false;
        this.button.style.backgroundColor = 'lightGreen';
        this.currOrder++;
        this.pages.push(page);
        e.target.setAttribute('data-selected', 'true');

      } else {
        e.target.style.opacity = '1';
        var removeIndex = -1;
        this.pages.forEach(page => {
          if(page.imgUrl === url) {
            removeIndex = this.pages.indexOf(page);
          }
        })
        this.pages.splice(removeIndex, 1);

        e.target.setAttribute('data-selected', 'false');
        this.currOrder--;
        for (var i = 0; i < this.pages.length; i++) {
          this.pages[i].order = i;
        }
        console.log('length', this.pages.length)
        if (this.pages.length === 0) {
          this.button.disabled = true;
          this.button.style.backgroundColor = 'initial';
        }
      }
  }

  render() {

    return(
      <div className = "ProfileBoxes">
       <button type="submit" className = "editProfileButton'" value="submit" onClick={this.submit.bind(this)} ref={(c) => this.button = c} >Submit</button>
        <div className ="MemlysContainer">
          {this.props.recommendations && this.props.recommendations.map(rec=> <RecommendationPresentation url= {rec} select={this.select.bind(this)} />)}
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



