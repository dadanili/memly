import React, { PropTypes, Component } from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'
import shallowCompare from 'react-addons-shallow-compare'
import controllable from 'react-controllables' //need to look into use for this... allows you to control prop types somehow...
import GoogleMap from 'google-map-react'
import update from 'react-addons-update'
import axios from 'axios'
import { connect } from 'react-redux'
import store from '../../../App'
import CaptionPresentation from './presentation.js'

class CaptionContainer extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var props = this.props.selection
    console.log('userReducer', props)
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

  render() {

    return(
      <div className = "ProfileBoxes">
       <button type="submit" className = "editProfileButton'" value="submit" onClick={this.submit.bind(this)} ref={(c) => this.button = c} >Submit</button>
        <div className ="MemlysContainer">
          {this.props.selection && this.props.selection.map((page, index)=> <CaptionPresentation url={page.imgUrl} order={index} addCaption={this.addCaption.bind(this)}/>)}
        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    selection: state.userReducer.selection
  }
}

export default connect(mapStateToProps)(CaptionContainer)