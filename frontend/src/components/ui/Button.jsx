import React from "react";

/**
 * Reusable Button Component
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'} [props.variant='primary'] - Visual style variant
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.isLoading=false] - Displays spinner and disables interaction
 * @param {boolean} [props.disabled=false] - Disables button
 * @param {boolean} [props.fullWidth=false] - Stretches button to 100% width
 * @param {React.ReactNode} [props.leftIcon] - Icon displayed before text
 * @param {React.ReactNode} [props.rightIcon] - Icon displayed after text
 * @param {React.ReactNode} props.children - Button label / content
 * @param {string} [props.type='button'] - Button type attribute
 * @param {string} [props.className=''] - Custom additional CSS classes
 */
function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) {
  const isDisabled = disabled || isLoading;

  const classes = [
    "ui-btn",
    `ui-btn-${variant}`,
    `ui-btn-${size}`,
    fullWidth ? "ui-btn-full" : "",
    isLoading ? "ui-btn-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <span className="ui-btn-spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle
              cx="12"
              cy="12"
              r="10"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="31.415, 31.415"
            />
          </svg>
        </span>
      )}

      {!isLoading && leftIcon && (
        <span className="ui-btn-icon ui-btn-icon-left">{leftIcon}</span>
      )}

      <span className="ui-btn-text">{children}</span>

      {!isLoading && rightIcon && (
        <span className="ui-btn-icon ui-btn-icon-right">{rightIcon}</span>
      )}
    </button>
  );
}

export default Button;
