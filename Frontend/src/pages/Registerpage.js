import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Register from '../components/Register';
import SuccessPopup from '../components/SuccessPopup';
import IncorrectPopup from '../components/IncorrectPopup';
import UserExistsPopup from '../components/UserExistsPopup';

const Registerpage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showExistsPopup, setShowExistsPopup] = useState(false);

  const handleRegisterClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleShowErrorPopup = () => {
    setShowErrorPopup(true);
  };

  const handleShowExistsPopup = () => {
    setShowExistsPopup(true);
  };

  useEffect(() => {
    if (showPopup || showErrorPopup || showExistsPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showPopup, showErrorPopup, showExistsPopup]);

  return (
    <div>
      <Register 
        onRegisterClick={handleRegisterClick} 
        onShowErrorPopup={handleShowErrorPopup} 
        onShowExistsPopup={handleShowExistsPopup} 
      />
      <SuccessPopup show={showPopup} onClose={handleClosePopup} />
      <IncorrectPopup show={showErrorPopup} onClose={() => setShowErrorPopup(false)} />
      <UserExistsPopup show={showExistsPopup} onClose={() => setShowExistsPopup(false)} />
    </div>
  );
};

export default Registerpage;
