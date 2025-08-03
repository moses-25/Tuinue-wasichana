import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="tuinue-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>
            <FaHeart className="heart-icon" />
            Tuinue Wasichana
          </h3>
          <p>
            Empowering young women through education, mentorship, and community support. 
            Together, we're building a brighter future for the next generation.
          </p>
          <div className="social-media">
            <a href="#" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/charities">Charities</Link></li>
            <li><Link to="/donate">Donate</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <ul className="footer-links">
            <li><Link to="/apply-charity">Apply as Charity</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#help">Help Center</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Get Involved</h3>
          <p>Ready to make a difference in a young woman's life?</p>
          <Link to="/donate" className="footer-cta">
            Start Donating Today
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Tuinue Wasichana. All rights reserved. Made with ❤️ for empowering young women.</p>
      </div>
    </footer>
  );
};

export default Footer;