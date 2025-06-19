import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import Navbar from "./Navbar";

const HomePage = () => {
  return (
    <>
      <div className="landing-wrapper">

      {/* Header Section */}
      <header className="landing-header">
        <h1 className="landing-title">Browse Notes Effortlessly</h1>
        <p className="tagline">
          Discover, download, and share notes tailored for your curriculum.
        </p>
      </header>

      {/* Button Group */}
      <div className="button-group">
        <Link to="/browse" className="nav-btn">Browse Notes</Link>
        <Link to="/upload" className="nav-btn">Upload Notes</Link>
        <Link to="/notes" className="nav-btn">My Notes</Link>
      </div>

      {/* Features Section */}
      <h2 className="features-heading">Features</h2>
      <section className="features-section">
        <div className="feature-card styled-card">
          <h3 className="card-heading">Smart Search</h3>
          <p className="card-subtext">Quickly find notes by title, author, or subject using an intuitive search bar.</p>
        </div>

        <div className="feature-card styled-card">
          <h3 className="card-heading">Subject Filters</h3>
          <p className="card-subtext">Filter notes based on your semester subjects like DSA, WAP, Math, PSP and more.</p>
        </div>

        <div className="feature-card styled-card">
          <h3 className="card-heading">Sort & Organize</h3>
          <p className="card-subtext">Sort notes by popularity, upload date, or alphabetical order with just a click.</p>
        </div>

        <div className="feature-card styled-card">
          <h3 className="card-heading">Quick View</h3>
          <p className="card-subtext">Preview notes before downloading and make informed choices.</p>
        </div>

        <div className="feature-card styled-card">
          <h3 className="card-heading">Save Favorites</h3>
          <p className="card-subtext">Bookmark frequently used notes for quick access from your personal dashboard.</p>
        </div>

        <div className="feature-card styled-card">
          <h3 className="card-heading">Auto-Sync</h3>
          <p className="card-subtext">All your uploads and saved notes are automatically synced across your devices.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Built by students, for students. Start exploring your notes today!</p>
      </footer>
    </div>
  </>
  );
};

export default HomePage;
