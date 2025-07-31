import { Link } from 'react-router-dom';
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
import './Navbar.css';

const Navbar = ({ isAuthenticated, userRole }) => {
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
    console.log("User role:", userRole);
  }, [isAuthenticated, userRole]);

  const getDashboardPath = () => {
    switch (userRole) {
      case 'admin':
        return '/admin-dashboard';
      case 'donor':
        return '/donor-dashboard';
      case 'charity':
        return '/org-dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <nav className={`navbar-container ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-logo">
        <Link to="/">TuinueWasichana</Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/" className="nav-link">
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

        {isAuthenticated && userRole && (
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
            <Link to="/log" className="nav-link">
              <FiLogOut className="nav-icon" />
              <span>Logout</span>
            </Link>
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
