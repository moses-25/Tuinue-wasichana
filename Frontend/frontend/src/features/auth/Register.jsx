import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase, FiHeart } from 'react-icons/fi';
import './Register.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Register = () => {
  const [accountType, setAccountType] = useState('donor'); // 'donor' or 'charity'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    charityName: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (accountType === 'donor') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    } else {
      if (!formData.charityName.trim()) newErrors.charityName = 'Charity name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(accountType === 'donor' 
        ? 'Donor account created successfully!' 
        : 'Charity application submitted for review!');
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        charityName: ''
      });
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ form: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <div className="register-card">
          <h2>Create an account</h2>
          <p className="register-subtitle">
            Choose your account type to get started
          </p>

          <div className="account-type-selector">
            <button
              type="button"
              className={`type-option ${accountType === 'donor' ? 'active' : ''}`}
              onClick={() => setAccountType('donor')}
            >
              <FiHeart className="type-icon" />
              <span>Donor</span>
            </button>
            <button
              type="button"
              className={`type-option ${accountType === 'charity' ? 'active' : ''}`}
              onClick={() => setAccountType('charity')}
            >
              <FiBriefcase className="type-icon" />
              <span>Charity</span>
            </button>
          </div>

          {accountType === 'charity' && (
            <div className="charity-notice">
              <p>Charity applications are reviewed by our administrators before approval.</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {accountType === 'donor' ? (
              <div className="name-fields">
                <div className={`input-group ${errors.firstName ? 'error' : ''}`}>
                  <div className="input-icon">
                    <FiUser />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                <div className={`input-group ${errors.lastName ? 'error' : ''}`}>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>
            ) : (
              <div className={`input-group ${errors.charityName ? 'error' : ''}`}>
                <div className="input-icon">
                  <FiBriefcase />
                </div>
                <input
                  type="text"
                  name="charityName"
                  placeholder="Charity name"
                  value={formData.charityName}
                  onChange={handleChange}
                />
                {errors.charityName && <span className="error-message">{errors.charityName}</span>}
              </div>
            )}

            <div className={`input-group ${errors.email ? 'error' : ''}`}>
              <div className="input-icon">
                <FiMail />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className={`input-group ${errors.password ? 'error' : ''}`}>
              <div className="input-icon">
                <FiLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className={`input-group ${errors.confirmPassword ? 'error' : ''}`}>
              <div className="input-icon">
                <FiLock />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <button 
              type="submit" 
              className={`register-button ${loading ? 'loading' : ''}`} 
              disabled={loading}
            >
              {loading ? (
                <span className="loading-text">
                  {accountType === 'donor' ? 'Creating account' : 'Applying'}
                  <span className="loading-dots">...</span>
                </span>
              ) : accountType === 'donor' ? (
                'Create donor account'
              ) : (
                'Apply as a charity'
              )}
            </button>

            {errors.form && <div className="form-error">{errors.form}</div>}
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link to="/log" className="toggle-auth">
                Log in
              </Link>
            </p>
          </div>

          <div className="social-auth">
            <div className="divider">
              <span>OR</span>
            </div>
            <div className="social-buttons">
              <button type="button" className="social-button google">
                <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;