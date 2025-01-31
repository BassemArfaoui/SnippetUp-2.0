import React from 'react';
import './styles/white-loading-spinner.css'; // Import the CSS for styling

const LoadingSpinner = (props) => {
  return (
    <div className="white-loading-spinner-overlay vh-100 w-100">
      <div className="spinner">
        <div className={"double-bounce1 text-danger" +( props.bg ? props.bg : 'bg-primary')}></div>
        <div className={"double-bounce2 text-danger " + (props.bg ? props.bg :'bg-primary')}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
