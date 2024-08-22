import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import SuccessPopup from '../components/SuccessPopup';
import IncorrectPopup from '../components/IncorrectPopup';
import UserExistsPopup from '../components/UserExistsPopup';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [organization, setOrganization] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showExistsPopup, setShowExistsPopup] = useState(false);
  
  const navigate = useNavigate(); // useNavigate hook for redirection

  const handleRegisterClick = async (e) => {
    e.preventDefault();

    if (password1 !== password2) {
      setShowErrorPopup(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: password1, organization }),
      });

      if (response.status === 201) {
        setShowSuccessPopup(true);
        navigate('/Productpage', { state: { email, organization } }); // Redirect to the product page
      } else {
        setShowExistsPopup(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  const handleCloseErrorPopup = () => setShowErrorPopup(false);
  const handleCloseExistsPopup = () => setShowExistsPopup(false);

  return (
    <div className="form-register">
      <form className="login-details" onSubmit={handleRegisterClick}>
        {/* Organization input */}
        <div className="input-details">
          <label htmlFor="organization">Enter your organization name:</label>
          <input
            className="register-input"
            type="text"
            placeholder="Organization Name"
            id="organization"
            required
            pattern="^[a-zA-Z0-9\s]+$"
            title="Organization name can only contain letters, numbers, and spaces."
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </div>

        {/* Email input */}
        <div className="input-details">
          <label htmlFor="email">Enter your Email ID:</label>
          <input
            className="register-input"
            type="email"
            placeholder="Email ID"
            id="email"
            required
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title="Please enter a valid email address."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password input */}
        <div className="input-details">
          <label htmlFor="password">Enter your password:</label>
          <input
            className="register-input"
            type="password"
            placeholder="Password"
            id="password"
            required
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
            title="Password must be at least 8 characters long and contain at least one letter and one number."
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
        </div>

        {/* Confirm password input */}
        <div className="input-details">
          <label htmlFor="reenter-password">Re-enter your password:</label>
          <input
            className="register-input"
            type="password"
            placeholder="Re-enter Password"
            id="reenter-password"
            required
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
            title="Please ensure this matches the password entered above."
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>

        <div className="button">
          <button type="submit">Register</button>
        </div>
      </form>

      {/* Popups */}
      <SuccessPopup show={showSuccessPopup} onClose={handleCloseSuccessPopup} />
      <IncorrectPopup show={showErrorPopup} onClose={handleCloseErrorPopup} />
      <UserExistsPopup show={showExistsPopup} onClose={handleCloseExistsPopup} />
    </div>
  );
};

export default Register;