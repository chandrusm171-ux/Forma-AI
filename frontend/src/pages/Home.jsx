import { Link } from "react-router-dom";
import { Button, PageLayout } from "../components";

const features = [
  {
    number: "01",
    title: "Write like a human",
    description: "Describe an incident, request, or application in plain language. No long, intimidating forms to start.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3H13a8.5 8.5 0 0 1 8 8v.5Z"/><path d="M8 10h8M8 14h5"/></svg>,
  },
  {
    number: "02",
    title: "Structure it with AI",
    description: "A local or compatible language model maps relevant details to fields in your selected workflow.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"/></svg>,
  },
  {
    number: "03",
    title: "Review with confidence",
    description: "Keep control with validation, conditional fields, clear feedback, and editable AI suggestions.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></svg>,
  },
];

const workflows = [
  { id: "insurance-claim", title: "Insurance claim", category: "INCIDENTS", icon: "↗", color: "mint", description: "Incident details, vehicle information, and damage" },
  { id: "patient-intake", title: "Patient intake", category: "HEALTHCARE", icon: "+", color: "blue", description: "Visit reason and relevant intake details" },
  { id: "personal-loan", title: "Personal loan", category: "FINANCE", icon: "$", color: "violet", description: "Purpose, employment, and request summary" },
  { id: "legal-intake", title: "Legal intake", category: "PROFESSIONAL", icon: "§", color: "amber", description: "Matter summary, other party, and urgency" },
  { id: "job-application", title: "Job application", category: "CAREERS", icon: "⌁", color: "rose", description: "Candidate profile and role preferences" },
];

function Home() {
  return (
    <PageLayout maxWidth="1200px">
      <div className="ambient-orb ambient-orb-one" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-two" aria-hidden="true" />
      <section className="home-page modern-home" aria-labelledby="home-title">
        <div className="home-hero modern-hero">
          <div className="home-hero-copy hero-copy-modern">
            <span className="home-eyebrow hero-eyebrow"><span className="eyebrow-live-dot" /> AI-POWERED WORKFLOW PLATFORM</span>
            <h1 id="home-title">Forms that feel less like <span className="gradient-text">paperwork.</span></h1>
            <p className="hero-description">Turn everyday language into structured, review-ready data. Forma AI brings intelligent extraction, adaptive forms, and a calmer user experience into one workspace.</p>
            <div className="home-actions modern-home-actions">
              <Link to="/form" className="home-action-link">
                <Button type="button" variant="primary" size="lg" rightIcon={<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd"/></svg>}>Explore workflows</Button>
              </Link>
              <a href="#how-it-works" className="hero-secondary-link"><span className="play-icon">▷</span> See how it works</a>
            </div>
            <div className="hero-proof-row">
              <div className="proof-avatar-stack" aria-hidden="true"><span>F</span><span>AI</span><span>✓</span></div>
              <p><strong>Built for clarity.</strong><br />Designed for human review, not blind automation.</p>
            </div>
          </div>

          <div className="hero-visual" aria-label="Illustration of an AI-assisted form workflow">
            <div className="hero-visual-glow" />
            <div className="floating-chip floating-chip-top"><span className="chip-sparkle">✦</span> AI extraction <span className="chip-status-dot" /></div>
            <div className="preview-window">
              <div className="preview-window-top"><div className="window-dots"><i /><i /><i /></div><span>FORMA / WORKSPACE</span><span className="preview-lock">◈ Secure flow</span></div>
              <div className="preview-window-body">
                <div className="preview-kicker">INSURANCE CLAIM <span>AI DRAFT</span></div>
                <h3>Let's start with your story.</h3>
                <p className="preview-subtitle">A few details are ready for your review.</p>
                <div className="preview-ai-note"><span className="preview-ai-icon">✦</span><div><strong>Extracted from your description</strong><p>“My Honda City hit a deer…”</p></div><span className="preview-check">✓</span></div>
                <div className="preview-field-row"><div><label>Vehicle</label><div className="preview-field">Honda City <span>✓</span></div></div><div><label>Incident type</label><div className="preview-field">Animal collision <span>⌄</span></div></div></div>
                <div className="preview-field-row"><div className="preview-wide-field"><label>Damage description</label><div className="preview-field preview-field-muted">Front bumper damaged…</div></div></div>
                <div className="preview-bottom-row"><span><i className="preview-mini-dot" /> Draft ready to review</span><span className="preview-progress"><i /></span></div>
              </div>
            </div>
            <div className="floating-chip floating-chip-bottom"><span className="floating-check">✓</span><div><strong>Human in control</strong><small>Review every suggestion</small></div></div>
            <span className="hero-orbit orbit-one" aria-hidden="true" /><span className="hero-orbit orbit-two" aria-hidden="true" />
          </div>
        </div>

        <div className="trust-strip reveal-up"><span>ONE FLEXIBLE ENGINE</span><i /><span>FIVE STARTING WORKFLOWS</span><i /><span>AI SUGGESTIONS, HUMAN REVIEW</span><i /><span>LOCAL MODEL SUPPORT</span></div>

        <section className="workflow-section reveal-up" aria-labelledby="workflow-heading">
          <div className="section-heading-row"><div><span className="home-eyebrow">START WITH A TEMPLATE</span><h2 id="workflow-heading">One engine. Different workflows.</h2><p>Choose a starting point and shape the details to fit your needs.</p></div><Link to="/form" className="text-link">Browse all workflows <span>↗</span></Link></div>
          <div className="workflow-card-grid">
            {workflows.map((workflow, index) => (
              <Link to={`/form?schema=${workflow.id}`} className={`workflow-card workflow-${workflow.color}`} key={workflow.title} style={{ "--card-index": index }}>
                <div className="workflow-card-top"><span className="workflow-card-icon">{workflow.icon}</span><span className="workflow-category">{workflow.category}</span></div>
                <h3>{workflow.title}</h3><p>{workflow.description}</p><span className="workflow-card-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="how-section reveal-up" id="how-it-works" aria-labelledby="how-heading">
          <div className="how-copy"><span className="home-eyebrow">A BETTER WAY TO COLLECT DETAILS</span><h2 id="how-heading">From messy context to <span className="gradient-text">clear structure.</span></h2><p>Skip the blank-page feeling. Start with the information you already know, then review the structured draft before anything is submitted.</p><Link to="/form" className="text-link">Try the AI form <span>↗</span></Link></div>
          <div className="how-steps">
            {features.map((feature) => <article className="how-step" key={feature.number}><span className="how-step-number">{feature.number}</span><span className="how-step-icon">{feature.icon}</span><div><h3>{feature.title}</h3><p>{feature.description}</p></div></article>)}
          </div>
        </section>

        <section className="bottom-cta reveal-up"><div className="cta-sparkle" aria-hidden="true">✦</div><div><span className="home-eyebrow">READY WHEN YOU ARE</span><h2>Make the next form feel effortless.</h2><p>Start with a workflow. Keep the final say.</p></div><Link to="/form" className="home-action-link"><Button type="button" variant="primary" size="lg" rightIcon={<span aria-hidden="true">↗</span>}>Start a form</Button></Link></section>
      </section>
    </PageLayout>
  );
}

export default Home;
