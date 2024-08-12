import React, { useState } from 'react';
import '../styles/Register.css';
import SuccessPopup from '../components/SuccessPopup';
import IncorrectPopup from '../components/IncorrectPopup';
import UserExistsPopup from '../components/UserExistsPopup'; // Import the new popup component

const Register = ({ onRegisterClick, onShowErrorPopup, onShowExistsPopup }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [organization, setOrganization] = useState(''); // State for organization
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showExistsPopup, setShowExistsPopup] = useState(false);

  const handleRegisterClick = async (e) => {
    e.preventDefault(); // Prevent the form from submitting

    // Check if passwords match
    if (password1 !== password2) {
      setShowErrorPopup(true); // Trigger the error popup
      return;
    }

    // Send registration data to the server
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password: password1, organization }), // Include organization
      });

      if (response.status === 400) {
        setShowExistsPopup(true); // Show the user exists popup
      } else if (response.status === 201) {
        setShowSuccessPopup(true); // Show the success popup
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseSuccessPopup = () => setShowSuccessPopup(false);
  const handleCloseErrorPopup = () => setShowErrorPopup(false);
  const handleCloseExistsPopup = () => setShowExistsPopup(false);

  return (
    <div className="form-register">
      <form className="login-details" onSubmit={handleRegisterClick}>
        <div className="input-details">
          <label htmlFor="organization">Enter your organization name:</label>
          <input
            type="text"
            placeholder="Organization Name"
            id="organization"
            required
            value={organization}
            onChange={(e) => setOrganization(e.target.value)} // Update state
          />
        </div>
        <div className="input-details">
          <label htmlFor="username">Enter your username:</label>
          <input
            type="text"
            placeholder="Username"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update state
          />
        </div>
        <div className="input-details">
          <label htmlFor="email">Enter your Email ID:</label>
          <input
            type="email"
            placeholder="Email ID"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state
          />
        </div>
        <div className="input-details">
          <label htmlFor="password">Enter your password:</label>
          <input
            type="password"
            placeholder="Password"
            id="password"
            required
            value={password1}
            onChange={(e) => setPassword1(e.target.value)} // Update state
          />
        </div>
        <div className="input-details">
          <label htmlFor="reenter-password">Re-enter your password:</label>
          <input
            type="password"
            placeholder="Re-enter Password"
            id="reenter-password"
            required
            value={password2}
            onChange={(e) => setPassword2(e.target.value)} // Update state
          />
        </div>
        <div className="button">
          <button type="submit">Register</button>
        </div>
      </form>
      <SuccessPopup show={showSuccessPopup} onClose={handleCloseSuccessPopup} />
      <IncorrectPopup show={showErrorPopup} onClose={handleCloseErrorPopup} />
      <UserExistsPopup show={showExistsPopup} onClose={handleCloseExistsPopup} /> {/* Added the popup component */}
    </div>
  );
};

export default Register;
