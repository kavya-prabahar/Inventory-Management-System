import React, { useState } from 'react';
import Product from '../components/Product';
import Profile from '../components/Profile';
import AddPopup from '../components/AddPopup'; // Import AddPopup component

const Productpage = () => {
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility

  const handleShowPopup = () => {
    setShowPopup(true); // Show popup
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Close popup
  };

  return (
    <div>
      <Profile />
      <Product onShowPopup={handleShowPopup} /> {/* Pass down the function as a prop */}
      <AddPopup show={showPopup} onClose={handleClosePopup} /> {/* Render the popup */}
    </div>
  );
};

export default Productpage;
