import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Navbar from './components/Navbar';
import Login from './features/auth/Login';
import Footer from './components/Footer';
import FAQ from './components/FAQItem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/footer" element={<Footer />} />
        <Route path ="/faq" element={<FAQ />} />
      </Routes>
    </Router>
  );
}

export default App;