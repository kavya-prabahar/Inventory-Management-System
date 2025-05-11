import React, { Suspense, useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


// Define your routes
const routes = [
  { path: '/', Component: () => import('./pages/Homepage') },
  { path: '/Loginpage', Component: () => import('./pages/Loginpage') },
  { path: '/Registerpage', Component: () => import('./pages/Registerpage') },
  { path: '/Productpage', Component: () => import('./pages/Productpage') },
  { path: '/Contactpage', Component: () => import('./pages/Contactpage') },
  { path: '/ProductListPage', Component: () => import('./pages/ProductListPage') },
  { path: '/Salespage', Component: () => import('./pages/Salespage') },
];

// Load navbar and footer components
const navbarImport = () => import('./components/Navbar'); // Assuming you have a Navbar component
const footerImport = () => import('./components/Footer');

// Global Navbar Component that stays consistent across all pages
const GlobalNavbar = () => {
  const [Navbar, setNavbar] = useState(null);

  useEffect(() => {
    navbarImport().then(module => {
      setNavbar(() => module.default);
    }).catch(err => {
      console.error("Failed to load navbar:", err);
    });
  }, []);

  return (
    <div className="global-navbar" style={{
      width: '100%',
      zIndex: 100,
      position: 'sticky',
      top: 0
    }}>
      {Navbar ? <Navbar /> : <div style={{ height: '60px', background: '#f0f0f0' }} />}
    </div>
  );
};

const PageWithFooter = ({ PageComponent }) => {
  const [Footer, setFooter] = useState(null);

  useEffect(() => {
    footerImport().then(module => {
      setFooter(() => module.default);
    }).catch(err => {
      console.error("Failed to load footer:", err);
    });
  }, []);

  return (
    <div className="page-with-footer" style={{ width: '100%' }}>
      {PageComponent && <PageComponent />}
      {Footer ? <Footer /> : <div style={{ height: '50px' }} />}
    </div>
  );
};

// Zero blink router with global navbar and per-page content with footer
const ZeroBlinkRouter = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [loadedComponents, setLoadedComponents] = useState({});
  const componentRefs = useRef({});
  const redirectedRef = useRef(false);
  const protectedPaths = ['/Productpage', '/ProductListPage', '/Salespage'];

  // Preload all routes immediately
  useEffect(() => {
    navbarImport();
    footerImport();

    const loadAllComponents = async () => {
      const loadPromises = routes.map(async route => {
        try {
          const module = await route.Component();
          setLoadedComponents(prev => ({ ...prev, [route.path]: true }));
          componentRefs.current[route.path] = module.default;
        } catch (error) {
          console.error(`Failed to load component for ${route.path}:`, error);
        }
      });
      await Promise.all(loadPromises);
    };

    loadAllComponents();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const currentPath = location.pathname;
    const isProtected = protectedPaths.includes(currentPath);

    if (isProtected) {
      if (!token) {
        if (!redirectedRef.current) {
          redirectedRef.current = true;
          alert('Please log in to access this page.');
          navigate('/Loginpage');
        }
      } else {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            localStorage.removeItem('authToken');
            if (!redirectedRef.current) {
              redirectedRef.current = true;
              alert('Session expired. Please log in again.');
              navigate('/Loginpage');
            }
          } else {
            redirectedRef.current = false;
          }
        } catch (error) {
          localStorage.removeItem('authToken');
          if (!redirectedRef.current) {
            redirectedRef.current = true;
            alert('Invalid session. Please log in again.');
            navigate('/Loginpage');
          }
        }
      }
    } else {
      redirectedRef.current = false; // Reset only when leaving protected page
    }
  }, [location.pathname, navigate]);

  return (
    <div className="app-container" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <GlobalNavbar />
      
      <div className="page-container" style={{
        flex: 1,
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch'
      }}>
        {routes.map(({ path }) => {
          const isActive = path === location.pathname;
          const isLoaded = loadedComponents[path];
          const Component = componentRefs.current[path];

          if (!isLoaded) {
            return isActive ? (
              <div key={path} style={{ width: '100%' }}>
                <div style={{ width: '100%', minHeight: '100%', background: 'white' }} />
              </div>
            ) : null;
          }

          const token = localStorage.getItem('authToken');
          const isProtectedRoute = protectedPaths.includes(path);
          const isLoggedIn = !!token;

          if (isProtectedRoute && !isLoggedIn && isActive) {
            alert("Please log in to access this page.");
            navigate('/Loginpage');
            return null;
          }

          return (
            <div
              key={path}
              style={{
                position: isActive ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: isActive ? 'auto' : 0,
                visibility: isActive ? 'visible' : 'hidden',
                zIndex: isActive ? 2 : 1,
                opacity: isActive ? 1 : 0,
                overflow: isActive ? 'visible' : 'hidden'
              }}
            >
              <PageWithFooter PageComponent={Component} />
            </div>
          );
        })}
      </div>
    </div>
  );
};


// Main App with scroll control
const App = () => {
  return (
    <Router>
      <div className="App" style={{
        width: '100%',
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <ZeroBlinkRouter />
      </div>
    </Router>
  );
};

export default App;
