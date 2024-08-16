import React from 'react';
import '../styles/UserExistsPopup.css';

const UserExistsPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="popup-container">
      <div className="user-popup-overlay">
        <h4>User already exists</h4>
        <button className="user-ok" type="button" onClick={onClose}>Ok</button>
      </div>
    </div>
  );
};

export default UserExistsPopup;
