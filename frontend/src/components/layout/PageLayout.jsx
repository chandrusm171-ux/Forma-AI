import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function PageLayout({ children, maxWidth = "900px" }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content" style={{ maxWidth }}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-top-grid">
            <div className="footer-brand-col">
              <div className="footer-brand">
                <span className="brand-badge">AI</span>
                <span className="footer-brand-name">Forma AI</span>
              </div>
              <p className="footer-tagline">
                Adaptive form automation engine powered by schema-aware entity extraction and reactive validation.
              </p>
              <div className="footer-badge-row">
                <span className="footer-chip">React 19</span>
                <span className="footer-chip">Ollama Llama 3.2</span>
                <span className="footer-chip">MongoDB</span>
              </div>
            </div>

            <div className="footer-links-col">
              <h4>Workflows</h4>
              <ul>
                <li><Link to="/form?schema=insurance-claim">Insurance Claim</Link></li>
                <li><Link to="/form?schema=patient-intake">Patient Intake</Link></li>
                <li><Link to="/form?schema=personal-loan">Personal Loan</Link></li>
                <li><Link to="/form?schema=legal-intake">Legal Client Intake</Link></li>
                <li><Link to="/form?schema=job-application">Job Application</Link></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Platform</h4>
              <ul>
                <li><Link to="/">Home Overview</Link></li>
                <li><Link to="/form">Form Studio</Link></li>
                <li><Link to="/resume">Resume Parser (Preview)</Link></li>
                <li><a href="#how-it-works">Architecture & Flow</a></li>
              </ul>
            </div>

            <div className="footer-team-col">
              <h4>Engineering Team</h4>
              <p className="team-member"><strong>Vishal</strong> • Frontend UI & Components</p>
              <p className="team-member"><strong>Chandru</strong> • Lead & AI Integration</p>
              <p className="team-member"><strong>Khushi</strong> • Backend & Persistence</p>
              <div className="footer-status-indicator">
                <span className="status-live-dot" />
                <span>Client Architecture: Stable</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p>© {new Date().getFullYear()} Forma AI Platform • Axlero Internship Project</p>
            <p className="footer-privacy-text">Private Local Processing • Zero External Telemetry</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PageLayout;
