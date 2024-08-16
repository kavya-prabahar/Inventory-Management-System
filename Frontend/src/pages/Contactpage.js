import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ContactUs from '../components/ContactUs';
import QuerySuccessPopup from '../components/QuerySuccessPopup'; // Ensure this is correctly imported
import axios from 'axios'; // Ensure axios is imported

const Contactpage = () => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    // Send the data to the backend
    axios.post('http://localhost:5000/send-email', data)
      .then(response => {
        console.log(response.data);
        setShowSuccessPopup(true); // Show the success popup if email is sent
      })
      .catch(error => {
        console.error('There was an error sending the email!', error);
      });
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div>
      <Navbar />
      <ContactUs onSubmit={handleSubmit} />
      <QuerySuccessPopup show={showSuccessPopup} onClose={closePopup} /> 
    </div>
  );
};

export default Contactpage;
