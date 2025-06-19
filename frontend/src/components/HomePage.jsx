import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="landing-wrapper">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="logo-text">NoteNest</div>
        <div className="nav-buttons">
          <a href="/login" className="nav-btn">Login</a>
          <a href="/signup" className="nav-btn">Signup</a>
        </div>
      </nav>

      {/* Header Section */}
      <header className="landing-header">
        <h1 className="landing-title">Browse Notes Effortlessly</h1>
        <p className="tagline">
          Discover, download, and share notes tailored for your curriculum.
        </p>
      </header>

      {/* Button Group */}
      <div className="button-group">
        <a href="#search">Search Notes</a>
        <a href="#upload">Upload</a>
        <a href="#categories">Subjects</a>
        <a href="#popular">Popular</a>
      </div>

      {/* Features Section */}
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
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Built by students, for students. Start exploring your notes today!</p>
      </footer>
    </div>
  );
};

export default HomePage;
