import React from 'react';
import '../styles/QuerySuccessPopup.css';

const QuerySuccessPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="popup-container">
      <div className="query-popup-overlay">
        <h4>Your query has been successfully submitted!</h4>
        <button className="query-ok" type="button" onClick={onClose}>Ok</button>
      </div>
    </div>
  );
};

export default QuerySuccessPopup;
