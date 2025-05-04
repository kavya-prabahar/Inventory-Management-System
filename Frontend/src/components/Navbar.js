import React, { useState, useEffect, Suspense, lazy } from 'react';
import '../styles/Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Lazy load components
const ProfileImage = lazy(() => import('./ProfileImage'));

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Set to null initially
  const location = useLocation()
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by checking for a token in local storage
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token); // Set isLoggedIn based on the presence of the token
  }, [location]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include' // Include cookies (session) in the request
      });
      localStorage.removeItem('authToken'); // Clear any auth token if used
      navigate('/Loginpage');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>HOME</Link>
          </li>
          <li className="nav-list-item">
            <Link to="/ProductListPage" className={location.pathname === "/ProductListPage" ? "active" : ""}>PRODUCTS</Link>
          </li>
          <li className="nav-list-item">
            <Link to="/Productpage" className={location.pathname === "/Productpage" ? "active" : ""}>INVENTORY</Link>
          </li>
          <li className="nav-list-item">
            <Link to="/Salespage" className={location.pathname === "/Salespage" ? "active" : ""}>SALES</Link>
          </li>
          <li className="nav-list-item">
            <Link to="/Contactpage" className={location.pathname === "/Contactpage" ? "active" : ""}>CONTACT</Link>
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
