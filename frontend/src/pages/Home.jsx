import { Link } from "react-router-dom";
import { Button, PageLayout } from "../components";

const features = [
  {
    title: "Describe naturally",
    description:
      "Explain an incident in your own words instead of manually completing every field.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Schema-driven forms",
    description:
      "Forms are rendered from reusable JSON schemas with validation and conditional fields.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    title: "AI-assisted prefill",
    description:
      "Extracted information can be mapped back into the form so users can review it before submission.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
];

function Home() {
  return (
    <PageLayout maxWidth="1100px">
      <section className="home-page" aria-labelledby="home-title">
        <div className="home-hero">
          <div className="home-hero-copy">
            <span className="home-eyebrow">AI-AUGMENTED FORM ENGINE</span>
            <h1 id="home-title">Turn natural language into structured forms.</h1>
            <p>
              Forma AI helps users describe what happened in their own words,
              extracts relevant information, and prepares a schema-driven form
              for review.
            </p>

            <div className="home-actions">
              <Link to="/form" className="home-action-link">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  rightIcon={
                    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  Try the Form
                </Button>
              </Link>
              <Link to="/resume" className="home-action-link">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  leftIcon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  }
                >
                  Resume Parser
                </Button>
              </Link>
            </div>
          </div>

          <div className="home-hero-card" aria-label="Forma AI workflow">
            <div className="workflow-step">
              <span className="workflow-number">01</span>
              <div>
                <strong>Describe</strong>
                <span>Tell Forma AI what happened.</span>
              </div>
            </div>
            <div className="workflow-line" aria-hidden="true" />
            <div className="workflow-step">
              <span className="workflow-number">02</span>
              <div>
                <strong>Extract</strong>
                <span>Identify the relevant structured data.</span>
              </div>
            </div>
            <div className="workflow-line" aria-hidden="true" />
            <div className="workflow-step">
              <span className="workflow-number">03</span>
              <div>
                <strong>Review</strong>
                <span>Verify the populated form before submitting.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="home-section-heading">
          <span className="home-eyebrow">CORE CAPABILITIES</span>
          <h2>Built around a reusable form engine</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon" aria-hidden="true">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

export default Home;
