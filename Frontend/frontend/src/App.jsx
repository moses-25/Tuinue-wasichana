import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Navbar from './components/Navbar';
import Login from './features/auth/Login';
import Footer from './components/Footer';
import FAQ from './components/FAQItem';
import HeroSection from './components/HeroSection';
import CharityCards from './components/CharityCard';
import ProgramCards from './components/ProgramCard';
import StoryCard from './components/StoryCard';
import HomePage from './Pages/HomePage';
import ImpactNote from './components/ImpactNote';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/hero" element={<HeroSection />} />
        <Route path="/cha" element={<CharityCards />} />
        <Route path="/prog" element={<ProgramCards />} />
        <Route path="/story" element={<StoryCard />} />
        <Route path="/note" element={<ImpactNote />} />
      </Routes>
    </Router>
  );
}

export default App;