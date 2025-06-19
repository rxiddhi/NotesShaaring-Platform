import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">NoteNest</Link>
      </div>
      <div className="navbar-links">
        <Link to="/upload" className="nav-link">Upload</Link>
        <Link to="/browse" className="nav-link">Browse</Link>
        <Link to="/notes" className="nav-link">Notes</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/signup" className="nav-link">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
