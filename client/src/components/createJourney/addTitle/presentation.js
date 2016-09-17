import React, { PropTypes, Component } from 'react';
import GoogleMap from 'google-map-react';

const TitlePresentation = (props) => {
  const divStyle = {
    backgroundImage: 'url(' + props.url + ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const capStyle = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="oneMemly hideBorder">
      <div style = {divStyle} data-url = {props.url} >
        <div className="oneMemlyWrapper"></div>
      </div>
      <div>
        testing testing 123
        Caption: {props.caption}
      
      </div>
    </div>
  );
};

export default TitlePresentation;


