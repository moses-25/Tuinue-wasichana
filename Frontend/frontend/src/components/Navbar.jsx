import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiDollarSign, 
  FiBookmark, 
  FiMessageSquare,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiPieChart 
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, forceLogout, hasCharity } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    console.log("User isAuthenticated:", isAuthenticated);
    console.log("User role:", user?.role);
  }, [isAuthenticated, user]);

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'donor':
        // If donor owns a charity, show charity dashboard, otherwise donor dashboard
        return hasCharity ? '/org' : '/donor';
      case 'charity':
        return '/org';
      default:
        return '/dashboard';
    }
  };

  const handleLogout = () => {
    try {
      forceLogout();
      navigate('/'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout error:', error);
      // Emergency logout if normal logout fails
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <nav className={`navbar-container ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-logo">
        <Link to={isAuthenticated ? "/home" : "/"}>TuinueWasichana</Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/home" className="nav-link">
          <FiHome className="nav-icon" />
          <span>Home</span>
        </Link>
        
        <Link to="/charity" className="nav-link">
          <FiDollarSign className="nav-icon" />
          <span>Charities</span>
        </Link>
        
        <Link to="/stories" className="nav-link">
          <FiBookmark className="nav-icon" />
          <span>Stories</span>
        </Link>
        
        <Link to="/contact" className="nav-link">
          <FiMessageSquare className="nav-icon" />
          <span>Contact</span>
        </Link>

        {isAuthenticated && user?.role && (
          <Link to={getDashboardPath()} className="nav-link">
            <FiPieChart className="nav-icon" />
            <span>Dashboard</span>
          </Link>
        )}
        
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="nav-link">
              <FiUser className="nav-icon" />
              <span>Profile</span>
            </Link>
            <button onClick={handleLogout} className="nav-link logout-btn">
              <FiLogOut className="nav-icon" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link to="/log" className="nav-link">
            <FiLogIn className="nav-icon" />
            <span>Login/Signup</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
