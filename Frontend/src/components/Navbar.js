import React,{useState} from 'react';
import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import Loginpage from '../pages/Loginpage';
import Productpage from '../pages/Productpage';

const Navbar = () => {

  return (
    <div className="navbar">
      <div className="nav-left">
        <ul className="nav-list">
          <li className = "nav-list-item name">
            <i>InvenTrack</i>
          </li>
          <li className="nav-list-item">
            <Link to="/">
              HOME
            </Link>
          </li>
          <li className="nav-list-item">
            <Link to="/Productpage">
              PRODUCTS
            </Link>
          </li>
          <li className="nav-list-item">
            <Link to="/contact">
              CONTACT
            </Link>
          </li>
        </ul>
      </div>

      <div className="nav-right">
        <Link to="/Loginpage">
          <button type="button">
            Login
          </button>
        </Link>
      </div>

    </div>
  );
};

export default Navbar;
