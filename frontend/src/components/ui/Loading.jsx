import React from "react";

/**
 * Reusable Loading Spinner & Overlay Component
 *
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Spinner size
 * @param {string} [props.text] - Optional text displayed below or next to the spinner
 * @param {boolean} [props.overlay=false] - If true, wraps spinner in a backdrop overlay
 * @param {boolean} [props.fullScreen=false] - If true, covers the entire viewport
 * @param {string} [props.className=''] - Extra custom class names
 */
function Loading({
  size = "md",
  text = "",
  overlay = false,
  fullScreen = false,
  className = "",
}) {
  const content = (
    <div className={`ui-loading ui-loading-${size} ${className}`} role="status">
      <div className="ui-loading-spinner" aria-hidden="true">
        <svg viewBox="0 0 50 50">
          <circle
            className="ui-loading-path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
          />
        </svg>
      </div>
      {text && <p className="ui-loading-text">{text}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return <div className="ui-loading-fullscreen-overlay">{content}</div>;
  }

  if (overlay) {
    return <div className="ui-loading-overlay">{content}</div>;
  }

  return content;
}

export default Loading;
