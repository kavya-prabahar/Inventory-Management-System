import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sales from '../components/Sales';
import AddPopup from '../components/AddPopup';

const Salespage = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <Navbar />
      <Sales onShowPopup={handleShowPopup} />
      <AddPopup show={showPopup} onClose={handleClosePopup} />
    </div>
  );
};

export default Salespage;
