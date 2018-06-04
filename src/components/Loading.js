import React from 'react';

export default props => {
  return (
    <div className="loader">
      <img
        id="loader"
        src={require('./../common/assets/oval.svg')}
        alt="loading"
      />
    </div>
  );
};
