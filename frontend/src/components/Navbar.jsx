import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">NoteNest</Link>
      </div>
      <div className="navbar-links">
        <Link to="/upload" className="nav-link">Upload</Link>
        <span
          className="nav-link"
          style={{ cursor: 'pointer' }}
          onClick={() => isLoggedIn ? navigate('/browse') : navigate('/login')}
        >
          Browse
        </span>
        <span
          className="nav-link"
          style={{ cursor: 'pointer' }}
          onClick={() => isLoggedIn ? navigate('/notes') : navigate('/login')}
        >
          Notes
        </span>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/signup" className="nav-link">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
