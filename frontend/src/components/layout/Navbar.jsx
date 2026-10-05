import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

/**
 * Navbar – Site-wide top navigation bar.
 *
 * Features:
 * - Sticky header with brand badge and navigation links.
 * - Animated hamburger toggle for mobile viewports (≤768px).
 * - Auto-closes the mobile drawer on route change.
 * - Engine-status pill with animated pulse dot.
 *
 * @param {{ brandName?: string }} props
 */
function Navbar({ brandName = "Forma AI" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  /* Close mobile drawer on navigation */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* Prevent body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const getNavClass = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  return (
    <header className="site-header">
      <div className="navbar-container">
        {/* ── Brand ── */}
        <NavLink to="/" className="navbar-brand" aria-label="Forma AI home">
          <span className="brand-badge">AI</span>
          <span className="brand-name">{brandName}</span>
        </NavLink>

        {/* ── Desktop nav ── */}
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

        {/* ── Desktop actions ── */}
        <div className="navbar-actions">
          <span className="status-pill status-ready">
            <span className="pulse-dot" aria-hidden="true" />
            Engine Ready
          </span>
        </div>

        {/* ── Mobile hamburger button ── */}
        <button
          className={`mobile-menu-toggle${mobileOpen ? " is-open" : ""}`}
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} />
      )}
      <nav
        className={`mobile-nav-drawer${mobileOpen ? " is-open" : ""}`}
        aria-label="Mobile Navigation"
      >
        <NavLink to="/" end className={getNavClass}>
          Home
        </NavLink>
        <NavLink to="/form" className={getNavClass}>
          Forms
        </NavLink>
        <NavLink to="/resume" className={getNavClass}>
          Resume Parser
        </NavLink>

        <div className="mobile-nav-status">
          <span className="status-pill status-ready">
            <span className="pulse-dot" aria-hidden="true" />
            Engine Ready
          </span>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
