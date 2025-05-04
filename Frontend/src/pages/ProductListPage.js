import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';
import AddPopup from '../components/AddPopup';

const ProductListPage = () => {
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
      <ProductList onShowPopup={handleShowPopup} />
      <AddPopup show={showPopup} onClose={handleClosePopup} />
    </div>
  );
};

export default ProductListPage;
