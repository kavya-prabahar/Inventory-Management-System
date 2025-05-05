import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Product from '../components/Product';
import AddPopup from '../components/AddPopup';

const Productpage = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <Product onShowPopup={handleShowPopup} />
      <AddPopup show={showPopup} onClose={handleClosePopup} />
    </div>
  );
};

export default Productpage;
