import React from 'react';
import '../styles/IncorrectPopup.css';
import ImageSrc from '../images/wrong.png';

const IncorrectPopup = ({ show, onClose }) => {
  if (!show) return null; 

  return (
    <div className="popup-container">
      <div className="popup-overlay">
        <h4>Password does not match</h4>
        <img className = "wrong" src={ImageSrc} alt="cross mark" />
        <button className='ok' type="button" onClick={onClose}>Ok</button>
      </div>
    </div>
  );
};

export default IncorrectPopup;
