import React from 'react';
import '../styles/AddPopup.css';

const AddPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="popup-container">
      <div className="popup-overlay">
        <h4>Please fill all the values before adding a new product!</h4>
        <button className='ok' type="button" onClick={onClose}>Ok</button>
      </div>
    </div>
  );
};

export default AddPopup;