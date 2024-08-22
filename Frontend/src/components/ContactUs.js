import React from 'react';
import '../styles/ContactUs.css';

const ContactUs = () => {
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
  
    const formData = new FormData(event.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };
  
    try {
      const response = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
  
      const result = await response.text();
      alert(result);
    } catch (error) {
      console.error('Error sending query:', error);
      alert(`There was an error sending your query: ${error.message}`);
    }
  };
  

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <form id="contactForm" onSubmit={handleSubmit}>
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
