import React from 'react';
import '../styles/IncorrectPopup.css';
import ImageSrc from '../images/wrong.png';

const UserIncorrectPopup = ({ show, onClose, message }) => {
  if (!show) return null; 

  return (
    <div className="popup-container">
      <div className="user-incorrect-popup-overlay">
        <h4>Incorrect Email or Password</h4>
        <img className="wrong" src={ImageSrc} alt="cross mark" />
        <button className="ok" type="button" onClick={onClose}>Ok</button>
      </div>
    </div>
  );
};

export default UserIncorrectPopup;
