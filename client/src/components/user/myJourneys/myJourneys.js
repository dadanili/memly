import React from 'react';

const MyJourneys = (props) => {

  var divStyle = {
    backgroundImage: `url(${props.journey.pages[0].imgUrl})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="oneMemly" style={divStyle} data-journeyIndex={props.index} onClick={props.selectJourney}>
      <div className="oneMemlyWrapper">
      </div>
    </div>
  );
};

export default MyJourneys;