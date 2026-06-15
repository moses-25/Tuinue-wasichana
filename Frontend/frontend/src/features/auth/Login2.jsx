import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './Login.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // 👈 added navigation

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      //  these arem ock role check based on email
      let role = '';
      switch (formData.email) {
        case 'admin@gmail.com':
          role = 'admin';
          break;
        case 'donor@gmail.com':
          role = 'donor';
          break;
        case 'charity@gmail.com':
          role = 'charity';
          break;
        default:
          setErrors({ form: 'Invalid credentials for demo. Try using one of the sample emails.' });
          setLoading(false);
          return;
      }

      const loggedInUser = { email: formData.email, role };
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      // the redirect to the right dashboard
      if (role === 'admin') navigate('/admin');
      if (role === 'donor') navigate('/donor');
      if (role === 'charity') navigate('/org');

    } catch (error) {
      console.error('Login error:', error);
      setErrors({ form: error.message || 'An error occurred during login' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Login to your account</p>

          <form onSubmit={handleSubmit}>
            <div className={`input-group ${errors.email ? 'error' : ''}`}>
              <div className="input-icon"><FiMail /></div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className={`input-group ${errors.password ? 'error' : ''}`}>
              <div className="input-icon"><FiLock /></div>
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

            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className={`auth-button ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? (
                <span className="loading-text">
                  Logging in<span className="loading-dots">...</span>
                </span>
              ) : 'Login'}
            </button>

            {errors.form && <div className="form-error">{errors.form}</div>}
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/reg" className="toggle-auth">Sign Up</Link></p>
          </div>

          <div className="social-auth">
            <div className="divider"><span>OR</span></div>
            <div className="social-buttons">
              <button type="button" className="social-button google">
                <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92..." fill="#4285F4" />
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

export default Login;
