import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; // 🔹 Added for smooth transitions

// ... your imports
import Homepage from './pages/Homepage';
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage';
import Productpage from './pages/Productpage';
import Contactpage from './pages/Contactpage';
import ProductListPage from './pages/ProductListPage';
import Salespage from './pages/Salespage';
import Footer from './components/Footer';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait"> {/* 🔸 Added wrapper */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Homepage />} />
        <Route path="/Loginpage" element={<Loginpage />} />
        <Route path="/Registerpage" element={<Registerpage />} />
        <Route path="/Productpage" element={<Productpage />} />
        <Route path="/ProductListPage" element={<ProductListPage />} />
        <Route path="/Salespage" element={<Salespage />} />
        <Route path="/Contactpage" element={<Contactpage />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <AnimatedRoutes /> {/* 🔸 Swapped in animated routes */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
