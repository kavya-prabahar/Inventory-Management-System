import Homepage from './pages/Homepage';
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage';
import Productpage from './pages/Productpage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Loginpage" element={<Loginpage />} />
        <Route path="/Registerpage" element={<Registerpage />} />
        <Route path = "/Productpage" element = {<Productpage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
