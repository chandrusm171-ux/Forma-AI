
function Navbar({ brandName = "Forma AI" }) {
  return (
    <header className="site-header">
      <div className="navbar-container">
        <a href="/" className="navbar-brand">
          <span className="brand-badge">AI</span>
          <span className="brand-name">{brandName}</span>
        </a>

        <nav className="navbar-nav" aria-label="Main Navigation">
          <a href="/" className="nav-link active">Home</a>
          <a href="#forms" className="nav-link">Forms</a>
          <a href="#resume" className="nav-link">Resume Parser</a>
        </nav>

        <div className="navbar-actions">
          <span className="status-pill status-ready">Engine Ready</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
