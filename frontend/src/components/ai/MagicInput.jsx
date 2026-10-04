import { useState } from "react";
import Button from "../ui/Button";

function MagicInput({ onAnalyze }) {
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!story.trim()) return;

    setIsLoading(true);
    try {
      if (onAnalyze) {
        await onAnalyze(story);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="magic-input" aria-label="AI Natural Language Input">
      <div className="magic-input-header">
        <h2>Describe Your Incident</h2>
        <p>
          Tell us what happened in your own words. The AI will automatically
          extract and fill the relevant form fields for you.
        </p>
      </div>

      <textarea
        id="magic-story-input"
        value={story}
        onChange={(event) => setStory(event.target.value)}
        placeholder="Example: I hit a deer yesterday evening on Route 9 in my Honda City. The windshield cracked and the front bumper was damaged."
        rows={5}
        disabled={isLoading}
        aria-label="Incident description"
      />

      <Button
        type="button"
        variant="primary"
        size="md"
        isLoading={isLoading}
        disabled={!story.trim()}
        onClick={handleAnalyze}
      >
        {isLoading ? "Analyzing..." : "Analyze with AI"}
      </Button>
    </section>
  );
}

export default MagicInput;