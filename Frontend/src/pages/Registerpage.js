import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import Register from '../components/Register';
import SuccessPopup from '../components/SuccessPopup';
import IncorrectPopup from '../components/IncorrectPopup';
import UserExistsPopup from '../components/UserExistsPopup'; // Import the UserExistsPopup

const Registerpage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showExistsPopup, setShowExistsPopup] = useState(false); // State for UserExistsPopup

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
    setShowExistsPopup(true); // Show the UserExistsPopup
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
      <Nav />
      <Register 
        onRegisterClick={handleRegisterClick} 
        onShowErrorPopup={handleShowErrorPopup} 
        onShowExistsPopup={handleShowExistsPopup} // Pass the handler to Register
      />
      <SuccessPopup show={showPopup} onClose={handleClosePopup} />
      <IncorrectPopup show={showErrorPopup} onClose={() => setShowErrorPopup(false)} />
      <UserExistsPopup show={showExistsPopup} onClose={() => setShowExistsPopup(false)} /> {/* Add UserExistsPopup */}
    </div>
  );
};

export default Registerpage;
