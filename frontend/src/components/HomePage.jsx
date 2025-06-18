import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="landing-wrapper">
      <header className="landing-header">
        <h1>Browse Notes</h1>
        <p className="tagline">
          Discover, download, and share notes tailored for your curriculum.
        </p>
      </header>

      <div className="button-group">
        <a href="#search">Search Notes</a>
        <a href="#upload">Upload</a>
        <a href="#categories">Subjects</a>
        <a href="#popular">Popular</a>
      </div>

      <section className="features-section">
        <div className="feature-card">
          <h3>Smart Search</h3>
          <p>Quickly find notes by title, author, or subject using an intuitive search bar.</p>
        </div>

        <div className="feature-card">
          <h3>Subject Filters</h3>
          <p>Filter notes based on your semester subjects like DSA, WAP, Math, PSP and more.</p>
        </div>

        <div className="feature-card">
          <h3>Sort & Organize</h3>
          <p>Sort notes by popularity, upload date, or alphabetical order with just a click.</p>
        </div>

        <div className="feature-card">
          <h3>Quick View</h3>
          <p>Preview notes before downloading and make informed choices.</p>
        </div>

        <div className="feature-card">
          <h3>Secure Downloads</h3>
          <p>All documents are stored safely and download-ready for your use.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>Built by students, for students. Start exploring your notes today!</p>
      </footer>
    </div>
  );
};

export default HomePage;
