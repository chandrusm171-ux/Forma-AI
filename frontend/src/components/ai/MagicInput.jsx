import { useState } from "react";

function MagicInput({ onAnalyze }) {
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!story.trim()) {
      return;
    }

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
    <section className="magic-input">
      <div className="magic-input-header">
        <h2>Describe Your Incident</h2>

        <p>
          Tell us what happened in your own words. AI will help extract the
          relevant information.
        </p>
      </div>

      <textarea
        value={story}
        onChange={(event) => setStory(event.target.value)}
        placeholder="Example: I hit a deer yesterday in my Honda City and the windshield was damaged."
        rows={6}
        disabled={isLoading}
      />

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={isLoading || !story.trim()}
      >
        {isLoading ? "Analyzing..." : "Analyze with AI"}
      </button>
    </section>
  );
}

export default MagicInput;