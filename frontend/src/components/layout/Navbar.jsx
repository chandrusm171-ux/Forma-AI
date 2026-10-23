import { useCallback, useEffect, useState } from "react";
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

  /* Close mobile menu on Escape key */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  /* Auto-close mobile drawer when viewport is resized to desktop */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen]);

  /* Check backend health when the application loads without synchronously
     scheduling state updates from the effect body. */
  const loadBackendStatus = useCallback(async ({ showChecking = true } = {}) => {
    if (showChecking) setBackendStatus("checking");
    try {
      const health = await checkBackendHealth();

      if (health?.success && health.database === "connected") {
        setBackendStatus("connected");
      } else if (health?.success) {
        setBackendStatus("degraded");
      } else {
        setBackendStatus("offline");
      }
    } catch {
      setBackendStatus("offline");
    }
  }, []);

  useEffect(() => {
    let active = true;

    checkBackendHealth()
      .then((health) => {
        if (!active) return;
        if (health?.success && health.database === "connected") {
          setBackendStatus("connected");
        } else if (health?.success) {
          setBackendStatus("degraded");
        } else {
          setBackendStatus("offline");
        }
      })
      .catch(() => {
        if (active) setBackendStatus("offline");
      });

    return () => {
      active = false;
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

    degraded: {
      label: "API Online · DB Offline",
      className: "status-pill",
      dotStyle: {
        background: "#f59e0b",
      },
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
    <div className="navbar-status-wrapper">
      <span
        className={statusContent.className}
        style={
          backendStatus === "offline"
            ? {
                background: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fecaca",
              }
            : backendStatus === "degraded"
              ? {
                  background: "#fffbeb",
                  color: "#b45309",
                  border: "1px solid #fde68a",
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
      <button
        type="button"
        className="status-refresh-btn"
        onClick={loadBackendStatus}
        title="Refresh backend status"
        aria-label="Refresh backend health"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      </button>
    </div>
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