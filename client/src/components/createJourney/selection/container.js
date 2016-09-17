import React, { PropTypes, Component } from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'
import shallowCompare from 'react-addons-shallow-compare'
import controllable from 'react-controllables' //need to look into use for this... allows you to control prop types somehow...
import GoogleMap from 'google-map-react'
import update from 'react-addons-update'
import axios from 'axios'
import { connect } from 'react-redux'
import store from '../../../App'
import SelectionPresentation from './presentation.js'

class SelectionContainer extends Component {

  constructor(props) {
    super(props);
    this.currOrder = 0;
    this.pages = [];
  }

  componentDidMount() {
    this.button.disabled = true;

    axios.get('/user/retrieve/profileinfo/').then(response => {

      var list = [];
      var urlsLikedMemlys = response.data.likedMemlys.map(url => url.mediaUrl);

      list = list.concat(urlsLikedMemlys);
      list = list.concat(response.data.memlys);

      this.props.dispatch({
        type: 'USER_LIST_MEMLYS',
        memlys: list
      });
    });

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

  submit(e) {
    console.log('in submit')
    // if(this.pages.length) {
      this.props.dispatch({
        type: 'SELECTED_MEMLYS', 
        selection: this.pages
      })
      const path = '/addcaptions'
      hashHistory.push(path)
  }

  render() {

    return(
      <div className = "ProfileBoxes">
       <button type="submit" className="createJourneyButton" value="submit" onClick={this.submit.bind(this)} ref={(c) => this.button = c} >Submit</button>
       <div className="sub-title textCentered">Add Memlys to your Journey</div>
        <div className ="MemlysContainer">
          {this.props.memlys && this.props.memlys.map((url) => <SelectionPresentation url={url} select={this.select.bind(this)} />)}
        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    memlys: state.userReducer.allMemlys
  }
}

export default connect(mapStateToProps)(SelectionContainer)


