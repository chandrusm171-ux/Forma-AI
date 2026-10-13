import { Link } from "react-router-dom";
import { Button } from "../components/ui";
import { PageLayout } from "../components/layout";

const features = [
  {
    title: "Describe naturally",
    description:
      "Explain an incident in your own words instead of manually completing every field.",
  },
  {
    title: "Schema-driven forms",
    description:
      "Forms are rendered from reusable JSON schemas with validation and conditional fields.",
  },
  {
    title: "AI-assisted prefill",
    description:
      "Extracted information can be mapped back into the form so users can review it before submission.",
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
                <Button type="button" variant="primary" size="lg">
                  Try the Form
                </Button>
              </Link>
              <Link to="/resume" className="home-action-link">
                <Button type="button" variant="outline" size="lg">
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
