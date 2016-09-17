


import React, { PropTypes, Component } from 'react'
import GoogleMap from 'google-map-react'

const RecommendationPresentation = (props) => {
	console.log('url', props.url)
	// href="https://www.flickr.com/services/oembed?url&#x3D;
  const divStyle = {
    backgroundImage: 'url(' + props.url + ')',
    backgroundSize: 'cover',
    backgroundPosition:'center',
    backgroundRepeat: 'no-repeat',
  }

  return (

    <div className = "oneMemly" style = {divStyle} data-url = {props.url} data-selected = "false" onClick= {e => props.select(e)}>
      <div className="oneMemlyWrapper">
      </div>
    </div>
  
  );
}

export default RecommendationPresentation