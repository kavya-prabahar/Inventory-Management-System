import React, { useState } from 'react';
import '../styles/ContactUs.css';
import QuerySuccessPopup from './QuerySuccessPopup'; 

const ContactUs = () => {
  const [showPopup, setShowPopup] = useState(false); 

  const handleButtonClick = (event) => {
    event.preventDefault(); 
    setShowPopup(true); // Show popup on button click
  };

  const closePopup = () => {
    setShowPopup(false); // Hide popup when closed
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <form id="contactForm">
        <div className="form-group">
          <label className="contact-label" htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className="form-group">
          <label className="contact-label" htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label className="contact-label" htmlFor="message">Your Query:</label>
          <textarea id="message" name="message" required></textarea>
        </div>
        <div className="submit-container">
          <button className="submit-button" type="button" onClick={handleButtonClick}>Submit</button>
        </div>
      </form>

      {/* Conditionally render the QuerySuccessPopup */}
      <QuerySuccessPopup
        show={showPopup} // Pass show prop
        onClose={closePopup} // Provide close function
      />
    </div>
  );
};

export default ContactUs;
