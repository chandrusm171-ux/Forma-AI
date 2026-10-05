import { NavLink } from "react-router-dom";

function Navbar({ brandName = "Forma AI" }) {
  const getNavClass = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  return (
    <header className="site-header">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand" aria-label="Forma AI home">
          <span className="brand-badge">AI</span>
          <span className="brand-name">{brandName}</span>
        </NavLink>

        <nav className="navbar-nav" aria-label="Main Navigation">
          <NavLink to="/" end className={getNavClass}>
            Home
          </NavLink>
          <NavLink to="/form" className={getNavClass}>
            Forms
          </NavLink>
          <NavLink to="/resume" className={getNavClass}>
            Resume Parser
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <span className="status-pill status-ready">
            <span className="pulse-dot" aria-hidden="true" />
            Engine Ready
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
