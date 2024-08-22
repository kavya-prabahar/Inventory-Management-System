import Homepage from './pages/Homepage';
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage';
import Productpage from './pages/Productpage';
import Contactpage from './pages/Contactpage';
import Footer from './components/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Loginpage" element={<Loginpage />} />
          <Route path="/Registerpage" element={<Registerpage />} />
          <Route path="/Productpage" element={
            <ProtectedRoute>
              <Productpage />
            </ProtectedRoute>
          } />
          <Route path="/Contactpage" element={<Contactpage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
