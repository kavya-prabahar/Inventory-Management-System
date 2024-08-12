import React,{useState} from 'react';
import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import imageSrc from '../images/output-onlinetools.png';
import Productpage from '../pages/Productpage';

const Profile = () => {

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
      <Link to="#">
      <img class = "image-profile" src={imageSrc} alt="user profile" />
      </Link>


        </div>
    </div>
  );
};

export default Profile;
