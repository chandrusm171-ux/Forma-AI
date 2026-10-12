import Button from "./Button";

/**
 * EmptyState - A reusable empty state component
 * 
 * @param {Object} props
 * @param {string} props.title - The primary message
 * @param {string} [props.description] - The secondary message
 * @param {React.ReactNode} [props.icon] - An SVG or Icon component
 * @param {string} [props.actionLabel] - Text for the primary action button
 * @param {Function} [props.onAction] - Callback for the primary action button
 * @param {string} [props.className] - Additional CSS classes
 */
function EmptyState({
  title = "No data found",
  description = "There is nothing to display at the moment.",
  icon,
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div className={`ui-empty-state ${className}`}>
      <div className="ui-empty-state-icon">
        {icon || (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )}
      </div>
      <h3 className="ui-empty-state-title">{title}</h3>
      <p className="ui-empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <div className="ui-empty-state-action">
          <Button variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
