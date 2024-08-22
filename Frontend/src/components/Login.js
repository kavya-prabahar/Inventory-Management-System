import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { Link } from 'react-router-dom';
import UserIncorrectPopup from './UserIncorrectPopup';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token); // Store the token
        navigate('/Productpage', { state: { email, organization: '' } }); // Redirect to the product page
      } else {
        setPopupMessage(data.message || 'Login failed');
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMessage('An error occurred. Please try again.');
      setShowPopup(true);
    }
  };

  return (
    <div className="form-login">
      <form className="login-details" onSubmit={handleSubmit}>
        <div className="input-details">
          <label htmlFor="user-name">Enter your email: </label>
          <input 
            type="text" 
            placeholder="User Name" 
            id="user-name" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="input-details">
          <label htmlFor="password">Enter your password: </label>
          <input 
            type="password" 
            placeholder="Password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <div className="button">
          <button type="submit">Login</button>
        </div>

        <Link to="/Registerpage" className="register">
          <p>Create an account</p>
        </Link>
      </form>

      <UserIncorrectPopup 
        show={showPopup} 
        onClose={() => setShowPopup(false)} 
        message={popupMessage} 
      />
    </div>
  );
};

export default Login;