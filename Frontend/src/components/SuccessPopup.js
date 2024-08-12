import React from 'react';
import '../styles/RPopup.css';
import ImageSrc from '../images/Tick.png';

const SuccessPopup = ({ show, onClose }) => {
  if (!show) return null; 

  return (
    <div className="popup-container">
      <div className="popup-overlay">
        <h4>Registered Successfully</h4>
        <img className = "tick" src={ImageSrc} alt="tick mark" />
        <button className = "ok" type="button" onClick={onClose}>Ok</button>
      </div>
    </div>
  );
};

export default SuccessPopup;
