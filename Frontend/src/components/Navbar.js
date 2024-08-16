import React, { useState, useEffect, Suspense, lazy } from 'react';
import '../styles/Navbar.css';
import { Link, useLocation } from 'react-router-dom';

// Lazy load components
const ProfileImage = lazy(() => import('./ProfileImage'));

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Set to null initially
  const location = useLocation();

  useEffect(() => {
    // Check if the user is logged in by checking for a token in local storage
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token); // Set isLoggedIn based on the presence of the token
  }, [location]);

  const handleLogout = () => {
    // Handle logout by removing the token and updating the logged-in state
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  // Check if the current page is Login or Register page
  const isAuthPage = location.pathname === '/Loginpage' || location.pathname === '/Registerpage';

  // Render nothing until we know the login state
  if (isLoggedIn === null) {
    return null; // Or you can return a spinner if you want
  }

  return (
    <div className="navbar">
      <div className="nav-left">
        <ul className="nav-list">
          <li className="name">
            <i>InvenTrack</i>
          </li>
          <li className="nav-list-item">
            <Link to="/">HOME</Link>
          </li>
          <li className="nav-list-item">
            <Link to="/Productpage">PRODUCTS</Link>
          </li>
          <li className="nav-list-item">
            <Link to="/Contactpage">CONTACT</Link>
          </li>
        </ul>
      </div>

      <div className="nav-right">
        {isLoggedIn ? (
          <Suspense fallback={<div>Loading...</div>}>
            <Link to="#">
              <ProfileImage />
            </Link>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </Suspense>
        ) : (
          !isAuthPage && (
            <>
              <Link to="/Loginpage">
                <button type="button">Login</button>
              </Link>
              <Link to="/Registerpage">
                <button type="button">Signup</button>
              </Link>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Navbar;
