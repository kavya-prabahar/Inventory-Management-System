import React, { Suspense, useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

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
    // Load navbar once at app start
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

// Component to wrap each page with footer
const PageWithFooter = ({ PageComponent }) => {
  const [Footer, setFooter] = useState(null);
  
  useEffect(() => {
    // Load footer when this page is rendered
    footerImport().then(module => {
      setFooter(() => module.default);
    }).catch(err => {
      console.error("Failed to load footer:", err);
    });
  }, []);
  
  return (
    <div className="page-with-footer" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100%',
      width: '100%'
    }}>
      <div className="dynamic-content" style={{ flex: 1 }}>
        {PageComponent && <PageComponent />}
      </div>
      <div className="page-footer">
        {Footer ? <Footer /> : <div style={{ height: '50px' }} />}
      </div>
    </div>
  );
};

// Zero blink router with global navbar and per-page content with footer
const ZeroBlinkRouter = () => {
  const location = useLocation();
  // Keep track of all loaded components
  const [loadedComponents, setLoadedComponents] = useState({});
  // Create refs to hold all component instances
  const componentRefs = useRef({});
  
  // Preload all routes immediately
  useEffect(() => {
    // Preload navbar and footer
    navbarImport();
    footerImport();
    
    const loadAllComponents = async () => {
      const loadPromises = routes.map(async route => {
        try {
          // Load the component
          const module = await route.Component();
          // Update the loaded state
          setLoadedComponents(prev => ({
            ...prev,
            [route.path]: true
          }));
          // Store reference to the component
          componentRefs.current[route.path] = module.default;
          return module;
        } catch (error) {
          console.error(`Failed to load component for ${route.path}:`, error);
          return null;
        }
      });
      
      await Promise.all(loadPromises);
    };
    
    loadAllComponents();
  }, []);
  
  return (
    <div className="app-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Global navbar stays outside the page transitions */}
      <GlobalNavbar />
      
      {/* Page content with contained scrolling */}
      <div className="page-container" style={{ 
        flex: 1, 
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch' // For smooth scrolling on iOS
      }}>
        {routes.map(({ path }) => {
          const isActive = path === location.pathname;
          const isLoaded = loadedComponents[path];
          const Component = componentRefs.current[path];
          
          // Only render components that have been loaded
          if (!isLoaded) {
            return isActive ? (
              <div key={path} style={{ width: '100%' }}>
                <div style={{ width: '100%', minHeight: '100%', background: 'white' }} />
              </div>
            ) : null;
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
  // Prevent overscrolling
  useEffect(() => {
    // Handle overscroll prevention
    const handleOverscroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // If we're at the bottom of the page, prevent further scrolling
      if (scrollY + viewportHeight >= documentHeight) {
        document.body.style.overscrollBehavior = 'none';
      } else {
        document.body.style.overscrollBehavior = 'auto';
      }
    };
    
    window.addEventListener('scroll', handleOverscroll);
    return () => window.removeEventListener('scroll', handleOverscroll);
  }, []);
  
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
