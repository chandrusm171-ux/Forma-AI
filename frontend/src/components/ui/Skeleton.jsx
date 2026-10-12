
/**
 * Skeleton Placeholder Component
 *
 * Shows an animated shimmer placeholder while content is loading.
 *
 * @param {Object} props
 * @param {'line' | 'circle' | 'card'} [props.variant='line'] - Shape of the skeleton
 * @param {string} [props.width] - CSS width (e.g. '100%', '200px')
 * @param {string} [props.height] - CSS height (e.g. '16px', '48px')
 * @param {number} [props.lines=1] - Number of skeleton lines (only for variant='line')
 * @param {string} [props.className=''] - Extra custom class names
 */
function Skeleton({
  variant = "line",
  width,
  height,
  lines = 1,
  className = "",
}) {
  if (variant === "circle") {
    const size = width || "48px";
    return (
      <div
        className={`ui-skeleton ui-skeleton-circle ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`ui-skeleton ui-skeleton-card ${className}`}
        style={{ width: width || "100%", height: height || "120px" }}
        aria-hidden="true"
      />
    );
  }

  // variant === "line" (default)
  return (
    <div className={`ui-skeleton-group ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className="ui-skeleton ui-skeleton-line"
          style={{
            width: index === lines - 1 && lines > 1 ? "60%" : (width || "100%"),
            height: height || "14px",
          }}
        />
      ))}
    </div>
  );
}

export default Skeleton;
