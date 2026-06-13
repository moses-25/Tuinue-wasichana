import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageSquare, FiClock, FiUsers } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'donation', label: 'Donation Support' },
    { value: 'charity', label: 'Charity Application' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'media', label: 'Media & Press' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate API call - replace with actual contact form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (error) {
      console.error('Contact form error:', error);
      setErrors({ form: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="contact-container">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="container">
            <h1>Get in Touch</h1>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
        </section>

        <div className="container">
          <div className="contact-content">
            {/* Contact Information */}
            <div className="contact-info">
              <h2>Contact Information</h2>
              <p>Reach out to us through any of these channels</p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <FiMail />
                  </div>
                  <div className="method-details">
                    <h3>Email Us</h3>
                    <p>info@tuinuewasichana.org</p>
                    <p>support@tuinuewasichana.org</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="method-icon">
                    <FiPhone />
                  </div>
                  <div className="method-details">
                    <h3>Call Us</h3>
                    <p>+254 700 123 456</p>
                    <p>Mon - Fri: 9:00 AM - 6:00 PM EAT</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="method-icon">
                    <FiMapPin />
                  </div>
                  <div className="method-details">
                    <h3>Visit Us</h3>
                    <p>Nairobi, Kenya</p>
                    <p>East Africa</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="contact-stats">
                <div className="stat-item">
                  <FiClock className="stat-icon" />
                  <div>
                    <h4>Response Time</h4>
                    <p>Within 24 hours</p>
                  </div>
                </div>
                <div className="stat-item">
                  <FiUsers className="stat-icon" />
                  <div>
                    <h4>Support Team</h4>
                    <p>Dedicated professionals</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="social-media">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a href="#" className="social-link facebook">
                    <FaFacebook />
                  </a>
                  <a href="#" className="social-link twitter">
                    <FaTwitter />
                  </a>
                  <a href="#" className="social-link instagram">
                    <FaInstagram />
                  </a>
                  <a href="#" className="social-link linkedin">
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Send us a Message</h2>
              
              {success && (
                <div className="success-message">
                  <FiSend className="success-icon" />
                  <p>Thank you for your message! We'll get back to you soon.</p>
                </div>
              )}
              
              <form className="contact-form" onSubmit={handleSubmit}>
                {/* Inquiry Type */}
                <div className="form-group">
                  <label htmlFor="inquiryType">What can we help you with?</label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                  >
                    {inquiryTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name and Email Row */}
                <div className="form-row">
                  <div className={`form-group ${errors.name ? 'error' : ''}`}>
                    <label htmlFor="name">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <span className="error-message">{errors.name}</span>
                    )}
                  </div>

                  <div className={`form-group ${errors.email ? 'error' : ''}`}>
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <span className="error-message">{errors.email}</span>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className={`form-group ${errors.subject ? 'error' : ''}`}>
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief description of your inquiry"
                  />
                  {errors.subject && (
                    <span className="error-message">{errors.subject}</span>
                  )}
                </div>

                {/* Message */}
                <div className={`form-group ${errors.message ? 'error' : ''}`}>
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows="6"
                  />
                  <div className="char-count">
                    {formData.message.length}/10 minimum
                  </div>
                  {errors.message && (
                    <span className="error-message">{errors.message}</span>
                  )}
                </div>

                {/* Form Error */}
                {errors.form && (
                  <div className="form-error">
                    {errors.form}
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className={`submit-btn ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  <FiSend className="btn-icon" />
                  {loading ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="contact-faq">
          <div className="container">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>How can I make a donation?</h3>
                <p>You can make donations through our secure donation page. We accept various payment methods including M-Pesa, credit cards, and PayPal.</p>
              </div>
              <div className="faq-item">
                <h3>How do I apply as a charity?</h3>
                <p>Visit our charities page and click "Apply as a Charity". Fill out the application form and our team will review it within 5-7 business days.</p>
              </div>
              <div className="faq-item">
                <h3>Can I track my donation impact?</h3>
                <p>Yes! Once you make a donation, you'll receive updates about how your contribution is making a difference in girls' lives.</p>
              </div>
              <div className="faq-item">
                <h3>Is my donation secure?</h3>
                <p>Absolutely. We use industry-standard encryption and secure payment processors to ensure your donation information is protected.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default Contact;