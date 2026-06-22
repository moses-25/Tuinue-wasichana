import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiHome, FiDollarSign, FiBookmark, FiMessageSquare, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import logo from '../assets/TN.svg';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="tuinue-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>
            <img src={logo} alt="Tuinue Wasichana" className="footer-logo" />
            Tuinue Wasichana
          </h3>
          <p>Empowering girls through education. Every donation helps break the cycle of poverty and builds a brighter future for communities in Kenya.</p>
          <div className="social-media">
            <a href="#" aria-label="Facebook"><FiHeart /></a>
            <a href="#" aria-label="Twitter"><FiHeart /></a>
            <a href="#" aria-label="Instagram"><FiHeart /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3><FiHome /> Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/Charity">Charities</Link></li>
            <li><Link to="/stories">Stories</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3><FiBookmark /> Programs</h3>
          <ul className="footer-links">
            <li><a href="#">School Sponsorship</a></li>
            <li><a href="#">Mentorship Program</a></li>
            <li><a href="#">STEM for Girls</a></li>
            <li><a href="#">Community Outreach</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3><FiMessageSquare /> Contact</h3>
          <ul className="footer-links">
            <li><FiMapPin /> Nairobi, Kenya</li>
            <li><FiPhone /> +254 700 000 000</li>
            <li><FiMail /> info@tuinuwasichana.org</li>
          </ul>
          <Link to="/donate" className="footer-cta">Donate Now</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Tuinue Wasichana. All rights reserved. Made with <FiHeart className="heart-icon" /> for every girl.</p>
      </div>
    </footer>
  );
};

export default Footer;
