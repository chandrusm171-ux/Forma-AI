
/**
 * Progress Bar Component
 *
 * Displays a horizontal progress indicator.
 * Supports both determinate (value-based) and indeterminate (animated) modes.
 *
 * @param {Object} props
 * @param {number} [props.value] - Progress value (0–100). If omitted, renders indeterminate.
 * @param {string} [props.label] - Optional label displayed alongside the bar
 * @param {'sm' | 'md'} [props.size='sm'] - Height of the bar
 * @param {string} [props.className=''] - Extra CSS classes
 */
function ProgressBar({
  value,
  label,
  size = "sm",
  className = "",
}) {
  const isIndeterminate = value === undefined || value === null;

  return (
    <div className={`ui-progress ${className}`} role="progressbar"
      aria-valuenow={isIndeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || "Loading progress"}
    >
      {label && <span className="ui-progress-label">{label}</span>}
      <div className={`ui-progress-track ui-progress-track-${size}`}>
        <div
          className={`ui-progress-fill ${isIndeterminate ? "ui-progress-indeterminate" : ""}`}
          style={isIndeterminate ? {} : { width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
