import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { charityAPI } from '../services/api';
import { FiBriefcase, FiFileText, FiUser, FiMail } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ApplyCharity.css';

const ApplyCharity = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    mission: '',
    description: '',
    contactEmail: '',
    contactName: '',
    website: '',
    location: '',
    category: ''
  });
  const [errors, setErrors] = useState({});

  const categories = [
    'Education',
    'Health',
    'Infrastructure',
    'Nutrition',
    'Safety',
    'Technology',
    'Other'
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
    
    // Only validate required fields for backend
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    
    if (!formData.mission.trim()) {
      newErrors.mission = 'Mission statement is required';
    } else if (formData.mission.length < 50) {
      newErrors.mission = 'Mission statement should be at least 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to apply as a charity');
      navigate('/');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Backend only accepts organization_name and mission
      const applicationData = {
        organization_name: formData.organizationName,
        mission: formData.mission
      };

      const result = await charityAPI.applyForCharity(applicationData);
      
      if (result.success) {
        alert('Your charity application has been submitted successfully! Our team will review it and get back to you within 5-7 business days.');
        navigate('/charity');
      } else {
        alert(result.error || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Application error:', error);
      alert('An error occurred while submitting your application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="apply-charity-container">
          <div className="apply-charity-card">
            <h2>Login Required</h2>
            <p>You need to be logged in to apply as a charity.</p>
            <button onClick={() => navigate('/')} className="login-btn">
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="apply-charity-container">
        <div className="apply-charity-card">
          <div className="apply-header">
            <h1>Apply as a Charity</h1>
            <p className="apply-subtitle">
              Join our platform and connect with donors who want to support your mission
            </p>
          </div>

          <div className="application-info">
            <h3>Application Process</h3>
            <ul>
              <li>Fill out the application form below</li>
              <li>Our team reviews your application (5-7 business days)</li>
              <li>If approved, you'll receive access to your charity dashboard</li>
              <li>Start receiving donations and sharing your impact stories</li>
            </ul>
          </div>

          <form className="apply-form" onSubmit={handleSubmit}>
            {/* Organization Name */}
            <div className={`form-group ${errors.organizationName ? 'error' : ''}`}>
              <label>
                <FiBriefcase className="form-icon" />
                Organization Name *
              </label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Enter your organization's name"
              />
              {errors.organizationName && (
                <span className="error-message">{errors.organizationName}</span>
              )}
            </div>

            {/* Mission Statement */}
            <div className={`form-group ${errors.mission ? 'error' : ''}`}>
              <label>
                <FiFileText className="form-icon" />
                Mission Statement *
              </label>
              <textarea
                name="mission"
                value={formData.mission}
                onChange={handleChange}
                placeholder="Describe your organization's mission and goals (minimum 50 characters)"
                rows="4"
              />
              <div className="char-count">
                {formData.mission.length}/50 minimum
              </div>
              {errors.mission && (
                <span className="error-message">{errors.mission}</span>
              )}
            </div>

            {/* Description */}
            <div className={`form-group ${errors.description ? 'error' : ''}`}>
              <label>
                <FiFileText className="form-icon" />
                Detailed Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of your work, target beneficiaries, and impact (minimum 100 characters)"
                rows="6"
              />
              <div className="char-count">
                {formData.description.length}/100 minimum
              </div>
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>

            {/* Contact Information */}
            <div className="form-row">
              <div className={`form-group ${errors.contactName ? 'error' : ''}`}>
                <label>
                  <FiUser className="form-icon" />
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Primary contact person"
                />
                {errors.contactName && (
                  <span className="error-message">{errors.contactName}</span>
                )}
              </div>

              <div className={`form-group ${errors.contactEmail ? 'error' : ''}`}>
                <label>
                  <FiMail className="form-icon" />
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="contact@yourcharity.org"
                />
                {errors.contactEmail && (
                  <span className="error-message">{errors.contactEmail}</span>
                )}
              </div>
            </div>

            {/* Website */}
            <div className="form-group">
              <label>Website (Optional)</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.yourcharity.org"
              />
            </div>

            {/* Location and Category */}
            <div className="form-row">
              <div className={`form-group ${errors.location ? 'error' : ''}`}>
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
                {errors.location && (
                  <span className="error-message">{errors.location}</span>
                )}
              </div>

              <div className={`form-group ${errors.category ? 'error' : ''}`}>
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="error-message">{errors.category}</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-submit">
              <button 
                type="submit" 
                className={`submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </div>
          </form>

          <div className="application-note">
            <p>
              <strong>Note:</strong> All applications are reviewed manually by our team. 
              We'll contact you within 5-7 business days with the status of your application.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default ApplyCharity;