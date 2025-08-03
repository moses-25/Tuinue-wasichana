import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FAQ from './components/FAQItem';
import HeroSection from './components/HeroSection';
import CharityCards from './components/CharityCard';
import ProgramCards from './components/ProgramCard';
import StoryCard from './components/StoryCard';
import './components/CharityCard.css';
import HomePage from './Pages/HomePage';
import ImpactNote from './components/ImpactNote';
import Charities from './Pages/Charities';
import Donations from './Pages/Donations';
import Stories from './Pages/Stories';
import Login2 from './features/auth/Login2';
import Register from './features/auth/Register';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import DonorDashboard from './Pages/Dashboards/DonorDashboard';
import CharityDashboard from './Pages/Dashboards/CharityDashboard';
import DonationPage from './Pages/Donate';
import ApplyCharity from './Pages/ApplyCharity';
import Profile from './Pages/Profile';
import Contact from './Pages/Contact';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Login2 />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/apply-charity" element={<ApplyCharity />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/hero" element={<HeroSection />} />
        <Route path="/cha" element={<CharityCards />} />
        <Route path="/prog" element={<ProgramCards />} />
        <Route path="/story" element={<StoryCard />} />
        <Route path="/note" element={<ImpactNote />} />
        <Route path="/Charity" element={<Charities />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/don" element={<Donations />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/donate" element={<DonationPage />} />
        <Route path="/log" element={<Login2 />} />
        <Route path ="/reg" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/donor" element={<DonorDashboard />} />
        <Route path="/org" element={<CharityDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;