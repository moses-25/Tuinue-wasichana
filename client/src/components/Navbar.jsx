import { Link, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiDollarSign,
  FiBookmark,
  FiInfo,
  FiMessageSquare,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiPieChart,
  FiMenu,
  FiX,
  FiHeart
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/TN.svg';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, forceLogout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'admin': return '/admin';
      case 'donor': return '/donor';
      case 'charity': return '/org';
      default: return '/dashboard';
    }
  };

  const handleLogout = () => {
    forceLogout();
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  const handleNavClick = () => {
    closeMenu();
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/home" className="navbar-brand" onClick={handleNavClick}>
            <img src={logo} alt="Tuinue Wasichana" className="navbar-logo" />
          </Link>

          <span className="navbar-mobile-title">Tuinue Wasichana</span>

          <div className="navbar-links-desktop">
            <Link to="/home" className="nav-link" onClick={handleNavClick}>
              <FiHome className="nav-icon" />
              <span>Home</span>
            </Link>
            <Link to="/contact" className="nav-link" onClick={handleNavClick}>
              <FiInfo className="nav-icon" />
              <span>About</span>
            </Link>
            <Link to="/charity" className="nav-link" onClick={handleNavClick}>
              <FiDollarSign className="nav-icon" />
              <span>Impact</span>
            </Link>
            <Link to="/stories" className="nav-link" onClick={handleNavClick}>
              <FiBookmark className="nav-icon" />
              <span>Stories</span>
            </Link>
            <Link to="/contact" className="nav-link" onClick={handleNavClick}>
              <FiMessageSquare className="nav-icon" />
              <span>Contact Us</span>
            </Link>
            {isAuthenticated && user?.role && (
              <Link to={getDashboardPath()} className="nav-link" onClick={handleNavClick}>
                <FiPieChart className="nav-icon" />
                <span>Dashboard</span>
              </Link>
            )}
            <Link to="/donate" className="btn-give" onClick={handleNavClick}>Give</Link>
            {isAuthenticated ? (
              <div className="navbar-user">
                <Link to="/profile" className="nav-avatar" title="Profile" onClick={handleNavClick}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                </Link>
                <button onClick={handleLogout} className="nav-logout" title="Logout">
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <Link to="/log" className="nav-link nav-login" onClick={handleNavClick}>
                <FiLogIn className="nav-icon" />
                <span>Login</span>
              </Link>
            )}
          </div>

          <div className="navbar-actions">
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}>
        <div className="mobile-menu-overlay" onClick={closeMenu} />
        <div className="mobile-menu-panel">
          <div className="mobile-menu-links">
            <Link to="/home" className="mobile-link" onClick={handleNavClick}>
              <FiHome className="mobile-link-icon" />
              <span>Home</span>
            </Link>
            <Link to="/contact" className="mobile-link" onClick={handleNavClick}>
              <FiInfo className="mobile-link-icon" />
              <span>About</span>
            </Link>
            <Link to="/charity" className="mobile-link" onClick={handleNavClick}>
              <FiDollarSign className="mobile-link-icon" />
              <span>Impact</span>
            </Link>
            <Link to="/stories" className="mobile-link" onClick={handleNavClick}>
              <FiBookmark className="mobile-link-icon" />
              <span>Stories</span>
            </Link>
            <Link to="/contact" className="mobile-link" onClick={handleNavClick}>
              <FiMessageSquare className="mobile-link-icon" />
              <span>Contact Us</span>
            </Link>
            {isAuthenticated && user?.role && (
              <Link to={getDashboardPath()} className="mobile-link" onClick={handleNavClick}>
                <FiPieChart className="mobile-link-icon" />
                <span>Dashboard</span>
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="mobile-link" onClick={handleNavClick}>
                  <FiUser className="mobile-link-icon" />
                  <span>Profile</span>
                </Link>
                <button onClick={handleLogout} className="mobile-link mobile-link-logout">
                  <FiLogOut className="mobile-link-icon" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/log" className="mobile-link" onClick={handleNavClick}>
                <FiLogIn className="mobile-link-icon" />
                <span>Login</span>
              </Link>
            )}
          </div>
          <Link to="/donate" className="mobile-give" onClick={handleNavClick}>Make a Donation</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
