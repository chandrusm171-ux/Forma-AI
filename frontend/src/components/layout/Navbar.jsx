import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { checkBackendHealth } from "../../services/api";

/**
 * Navbar – Site-wide top navigation bar.
 *
 * Features:
 * - Sticky header with brand badge and navigation links.
 * - Animated hamburger toggle for mobile viewports (≤768px).
 * - Auto-closes the mobile drawer on route change.
 * - Displays the real backend health state instead of a static status.
 *
 * @param {{ brandName?: string }} props
 */
function Navbar({ brandName = "Forma AI" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");

  /* Prevent body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* Check backend health when the application loads */
  useEffect(() => {
    let isMounted = true;

    const loadBackendStatus = async () => {
      try {
        const health = await checkBackendHealth();

        if (isMounted && health?.success) {
          setBackendStatus("connected");
        } else if (isMounted) {
          setBackendStatus("offline");
        }
      } catch (error) {
        console.error("Backend health check failed:", error);

        if (isMounted) {
          setBackendStatus("offline");
        }
      }
    };

    loadBackendStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const getNavClass = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  const statusContent = {
    checking: {
      label: "Checking Backend",
      className: "status-pill",
      dotStyle: {
        background: "#f59e0b",
      },
    },

    connected: {
      label: "Backend Connected",
      className: "status-pill status-ready",
      dotStyle: undefined,
    },

    offline: {
      label: "Backend Offline",
      className: "status-pill",
      dotStyle: {
        background: "#ef4444",
      },
    },
  }[backendStatus];

  const renderStatus = () => (
    <span
      className={statusContent.className}
      style={
        backendStatus === "offline"
          ? {
              background: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
            }
          : backendStatus === "checking"
            ? {
                background: "#fffbeb",
                color: "#b45309",
                border: "1px solid #fde68a",
              }
            : undefined
      }
    >
      <span
        className="pulse-dot"
        aria-hidden="true"
        style={statusContent.dotStyle}
      />

      {statusContent.label}
    </span>
  );

  return (
    <header className="site-header">
      <div className="navbar-container">
        {/* Brand */}
        <NavLink
          to="/"
          className="navbar-brand"
          aria-label="Forma AI home"
        >
          <span className="brand-badge">AI</span>
          <span className="brand-name">{brandName}</span>
        </NavLink>

        {/* Desktop navigation */}
        <nav
          className="navbar-nav"
          aria-label="Main Navigation"
        >
          <NavLink
            to="/"
            end
            className={getNavClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/form"
            className={getNavClass}
          >
            Forms
          </NavLink>

          <NavLink
            to="/resume"
            className={getNavClass}
          >
            Resume Parser
          </NavLink>
        </nav>

        {/* Desktop backend status */}
        <div className="navbar-actions">
          {renderStatus()}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={`mobile-menu-toggle${
            mobileOpen ? " is-open" : ""
          }`}
          onClick={() =>
            setMobileOpen((prev) => !prev)
          }
          aria-label={
            mobileOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={mobileOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile navigation */}
      <nav
        className={`mobile-nav-drawer${
          mobileOpen ? " is-open" : ""
        }`}
        aria-label="Mobile Navigation"
        onClick={(event) => {
          if (event.target.closest("a")) {
            setMobileOpen(false);
          }
        }}
      >
        <NavLink
          to="/"
          end
          className={getNavClass}
        >
          Home
        </NavLink>

        <NavLink
          to="/form"
          className={getNavClass}
        >
          Forms
        </NavLink>

        <NavLink
          to="/resume"
          className={getNavClass}
        >
          Resume Parser
        </NavLink>

        <div className="mobile-nav-status">
          {renderStatus()}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;