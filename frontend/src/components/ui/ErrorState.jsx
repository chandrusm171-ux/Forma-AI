import Button from "./Button";

/**
 * ErrorState - A reusable fallback/error state component
 * 
 * @param {Object} props
 * @param {string} props.title - The primary error message
 * @param {string} [props.description] - Additional context about the error
 * @param {React.ReactNode} [props.icon] - An SVG or Icon component
 * @param {string} [props.retryLabel] - Text for the retry button
 * @param {Function} [props.onRetry] - Callback for the retry action
 * @param {string} [props.className] - Additional CSS classes
 */
function ErrorState({
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again.",
  icon,
  retryLabel = "Retry",
  onRetry,
  className = "",
}) {
  return (
    <div className={`ui-error-state ${className}`}>
      <div className="ui-error-state-icon">
        {icon || (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
      </div>
      <h3 className="ui-error-state-title">{title}</h3>
      <p className="ui-error-state-description">{description}</p>
      {onRetry && (
        <div className="ui-error-state-action">
          <Button variant="danger" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;
