import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { FiUser, FiMail, FiEdit3, FiSave, FiX, FiShield } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated, updateUser, hasCharity, charityData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [errors, setErrors] = useState({});

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || ''
      });
    }
  }, [user]);

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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // For now, we'll just update the local state
      // In a real app, you'd make an API call to update the profile
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email
      };
      
      updateUser(updatedUser);
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'donor':
        return 'Donor';
      case 'charity':
        return 'Charity Organization';
      default:
        return 'User';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#dc3545';
      case 'donor':
        return '#28a745';
      case 'charity':
        return '#e91e63';
      default:
        return '#6c757d';
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <div className="profile-card">
            <h2>Access Denied</h2>
            <p>Please login to view your profile.</p>
            <a href="/" className="login-link">Go to Login</a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <FiUser className="avatar-icon" />
            </div>
            <div className="profile-title">
              <h1>My Profile</h1>
              <p>Manage your account information</p>
            </div>
            <div className="profile-actions">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="edit-btn"
                >
                  <FiEdit3 className="btn-icon" />
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    onClick={handleSave}
                    className="save-btn"
                    disabled={loading}
                  >
                    <FiSave className="btn-icon" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="cancel-btn"
                    disabled={loading}
                  >
                    <FiX className="btn-icon" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <h3>Personal Information</h3>
              
              <div className="form-group">
                <label>
                  <FiUser className="form-icon" />
                  Full Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? 'error' : ''}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <span className="error-message">{errors.name}</span>
                    )}
                  </div>
                ) : (
                  <div className="field-value">{user?.name || 'Not provided'}</div>
                )}
              </div>

              <div className="form-group">
                <label>
                  <FiMail className="form-icon" />
                  Email Address
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <span className="error-message">{errors.email}</span>
                    )}
                  </div>
                ) : (
                  <div className="field-value">{user?.email || 'Not provided'}</div>
                )}
              </div>

              <div className="form-group">
                <label>
                  <FiShield className="form-icon" />
                  Account Type
                </label>
                <div className="field-value">
                  <span 
                    className="role-badge"
                    style={{ backgroundColor: getRoleColor(user?.role) }}
                  >
                    {getRoleDisplayName(user?.role)}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Account Information</h3>
              
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Member Since</span>
                  <span className="info-value">
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString()
                      : 'Recently joined'
                    }
                  </span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Account Status</span>
                  <span className="info-value status-active">Active</span>
                </div>
              </div>
            </div>

            {hasCharity && charityData && (
              <div className="profile-section">
                <h3>Charity Information</h3>
                <div className="profile-info">
                  <div className="info-item">
                    <span className="info-label">Organization:</span>
                    <span className="info-value">{charityData.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Category:</span>
                    <span className="info-value">{charityData.category}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location:</span>
                    <span className="info-value">{charityData.location}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Goal:</span>
                    <span className="info-value">${charityData.goal?.toLocaleString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span className="info-value">{charityData.status}</span>
                  </div>
                </div>
                <div className="charity-info">
                  <p>
                    Manage your charity campaigns and view donations through your 
                    <a href="/org"> charity dashboard</a>.
                  </p>
                </div>
              </div>
            )}

            <div className="profile-section">
              <h3>Donor Information</h3>
              <div className="donor-info">
                <p>
                  Thank you for supporting our cause! View your donation history 
                  and impact through your <a href="/donor">donor dashboard</a>.
                </p>
                {!hasCharity && (
                  <p>
                    Want to start your own charity? 
                    <a href="/apply-charity"> Apply to become a charity</a> and start receiving donations.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Profile;