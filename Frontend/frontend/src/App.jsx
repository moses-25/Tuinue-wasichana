import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FAQ from './components/FAQItem';
import HeroSection from './components/HeroSection';
import CharityCards from './components/CharityCard';
import ProgramCards from './components/ProgramCard';
import StoryCard from './components/StoryCard';
import HomePage from './Pages/HomePage';
import ImpactNote from './components/ImpactNote';
import Charities from './Pages/Charities';
import Donations from './Pages/Donations';
import Stories from './Pages/Stories';
import Login2 from './features/auth/Login2';
import Register from './features/auth/Register';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import DonorDashboard from './Pages/Dashboards/DonorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/hero" element={<HeroSection />} />
        <Route path="/cha" element={<CharityCards />} />
        <Route path="/prog" element={<ProgramCards />} />
        <Route path="/story" element={<StoryCard />} />
        <Route path="/note" element={<ImpactNote />} />
        <Route path="/Charity" element={<Charities />} />
        <Route path="/don" element={<Donations />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/log" element={<Login2 />} />
        <Route path ="/reg" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/donor" element={<DonorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;