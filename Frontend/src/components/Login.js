import React from 'react';
import '../styles/Login.css';
import { Link } from 'react-router-dom';
import Registerpage from '../pages/Registerpage';

const Login =() => {
  return (
    <div className="form-login">
      <form className="login-details">
        <div className="input-details">
          <label htmlFor="user-name">Enter your email: </label>
          <input type="text" placeholder="User Name" id="user-name" required />
        </div>
        <div className="input-details">
          <label htmlFor="password">Enter your password: </label>
          <input type="password" placeholder="Password" id="password" required />
        </div>
        <div className="button">
          <button type="submit">Login</button>
        </div>

        <Link to="/Registerpage" className="register">
        <p>Create an account</p>
        </Link>
      </form>
    </div>
  );
};

export default Login;
