/**
 * AiBadge - Clean vector badge for AI-extracted fields
 */
function AiBadge({ label = "AI Extracted", className = "" }) {
  return (
    <span className={`ai-suggested-tag ${className}`} title="Populated by AI extraction — review or edit anytime">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="11"
        height="11"
        aria-hidden="true"
      >
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      </svg>
      {label}
    </span>
  );
}

export default AiBadge;
