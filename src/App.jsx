import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Gameplay from './components/Gameplay';
import HomePage from './components/pages/Homepage';


const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<Gameplay />} />
        </Routes>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
};

export default App;