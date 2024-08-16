import React from 'react';
import '../styles/ContactUs.css';

const ContactUs = ({ onSubmit }) => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <form id="contactForm" onSubmit={onSubmit}>
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
          <button className="submit-button" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ContactUs;
