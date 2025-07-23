import { Link } from 'react-router-dom';
import { 
  FiHome, 
  FiDollarSign, 
  FiBookOpen, 
  FiBookmark, 
  FiInfo, 
  FiMessageSquare,
  FiUser,
  FiLogIn,
  FiLogOut
} from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ isAuthenticated }) => {
  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <Link to="/">TuinueWasichana</Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          <FiHome className="nav-icon" />
          <span>Home</span>
        </Link>
        
        <Link to="/donations" className="nav-link">
          <FiDollarSign className="nav-icon" />
          <span>Donations</span>
        </Link>
        
        <Link to="/programs" className="nav-link">
          <FiBookOpen className="nav-icon" />
          <span>Programs</span>
        </Link>
        
        <Link to="/stories" className="nav-link">
          <FiBookmark className="nav-icon" />
          <span>Stories</span>
        </Link>
        
        <Link to="/about" className="nav-link">
          <FiInfo className="nav-icon" />
          <span>About</span>
        </Link>
        
        <Link to="/contact" className="nav-link">
          <FiMessageSquare className="nav-icon" />
          <span>Contact</span>
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="nav-link">
              <FiUser className="nav-icon" />
              <span>Profile</span>
            </Link>
            <Link to="/logout" className="nav-link">
              <FiLogOut className="nav-icon" />
              <span>Logout</span>
            </Link>
          </>
        ) : (
          <Link to="/login" className="nav-link">
            <FiLogIn className="nav-icon" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;