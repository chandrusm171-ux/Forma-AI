import { forwardRef } from "react";
/**
 * Reusable Input Component with forwardRef support for React Hook Form
 */
const Input = forwardRef(function Input(
  {
    id,
    name,
    label,
    type = "text",
    placeholder = "",
    error,
    helperText,
    required = false,
    disabled = false,
    className = "",
    leftIcon,
    rightIcon,
    ...props
  },
  ref
) {
  const inputId = id || name;
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : error?.message;

  return (
    <div className={`ui-input-wrapper ${hasError ? "has-error" : ""} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="ui-input-label">
          {label}
          {required && <span className="ui-required-mark" aria-hidden="true"> *</span>}
        </label>
      )}

      <div className="ui-input-container">
        {leftIcon && <span className="ui-input-icon left">{leftIcon}</span>}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          className={`ui-input-field ${leftIcon ? "has-left-icon" : ""} ${
            rightIcon ? "has-right-icon" : ""
          }`}
          {...props}
        />

        {rightIcon && <span className="ui-input-icon right">{rightIcon}</span>}
      </div>

      {hasError && (
        <p id={`${inputId}-error`} className="ui-input-error" role="alert">
          {errorMessage}
        </p>
      )}

      {!hasError && helperText && (
        <p id={`${inputId}-helper`} className="ui-input-helper">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
