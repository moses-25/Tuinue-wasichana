import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="tuinue-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Tuinue Wasichana <FaHeart className="heart-icon" /></h3>
          <p>Empowering girls through education in Kenya.</p>
        </div>
        
        <div className="footer-section">
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/donations">Donations</a></li>
            <li><a href="/faqs">FAQ's</a></li>
            <li><a href="/contacts">Contacts</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <div className="social-media">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
          <div className="footer-cta">
            Support our cause &rarr;
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>Made by 6 by Tuinue Wasichana &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;