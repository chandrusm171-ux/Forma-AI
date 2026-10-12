import { useState } from "react";
import Button from "../ui/Button";
import ProgressBar from "../ui/ProgressBar";

/**
 * MagicInput – AI Natural Language Input Section
 *
 * Allows the user to describe an incident in plain text. On clicking
 * "Analyze with AI", a progress indicator and animated status text are
 * shown while the AI extraction call runs asynchronously. Success and
 * error outcomes are communicated via status banners with distinct
 * colours and icons.
 *
 * @param {{ onAnalyze: (story: string) => Promise<void> }} props
 */
function MagicInput({ onAnalyze }) {
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  const handleAnalyze = async () => {
    if (!story.trim()) return;

    setIsLoading(true);
    setStatus(null);

    try {
      if (onAnalyze) {
        await onAnalyze(story);
      }
      setStatus({
        type: "success",
        message: "AI analysis complete — form fields have been populated.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.message ||
          "Something went wrong during analysis. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dismissStatus = () => setStatus(null);

  return (
    <section
      className={`magic-input ${isLoading ? "magic-input-busy" : ""}`}
      aria-label="AI Natural Language Input"
    >
      <div className="magic-input-header">
        <h2>Describe Your Incident</h2>
        <p>
          Tell us what happened in your own words. The AI will automatically
          extract and fill the relevant form fields for you.
        </p>
      </div>

      {/* ── Status banner (success / error) ── */}
      {status && (
        <div
          className={`magic-status magic-status-${status.type}`}
          role="alert"
        >
          <span className="magic-status-icon" aria-hidden="true">
            {status.type === "success" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </span>
          <p className="magic-status-message">{status.message}</p>
          <button
            className="magic-status-dismiss"
            onClick={dismissStatus}
            aria-label="Dismiss message"
          >
            ✕
          </button>
        </div>
      )}

      <textarea
        id="magic-story-input"
        value={story}
        onChange={(event) => setStory(event.target.value)}
        placeholder="Example: I hit a deer yesterday evening on Route 9 in my Honda City. The windshield cracked and the front bumper was damaged."
        rows={5}
        disabled={isLoading}
        aria-label="Incident description"
      />

      {/* ── Indeterminate progress bar while analyzing ── */}
      {isLoading && (
        <div className="magic-input-progress">
          <ProgressBar label="Analyzing your description…" />
        </div>
      )}

      <div className="magic-input-actions">
        <Button
          type="button"
          variant="primary"
          size="md"
          isLoading={isLoading}
          disabled={!story.trim()}
          onClick={handleAnalyze}
        >
          {isLoading ? "Analyzing…" : "Analyze with AI"}
        </Button>

        {isLoading && (
          <span className="magic-input-hint" aria-live="polite">
            This may take a few seconds…
          </span>
        )}
      </div>
    </section>
  );
}

export default MagicInput;