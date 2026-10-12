function TextareaField({ field, register, error }) {
  const validation = field.validation || {};
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : error?.message;

  const rules = {
    required: field.required
      ? `${field.label} is required`
      : false,
  };

  if (validation.minLength) {
    rules.minLength = {
      value: validation.minLength,
      message: `${field.label} must be at least ${validation.minLength} characters`,
    };
  }

  if (validation.maxLength) {
    rules.maxLength = {
      value: validation.maxLength,
      message: `${field.label} must not exceed ${validation.maxLength} characters`,
    };
  }

  if (validation.pattern) {
    rules.pattern = {
      value: new RegExp(validation.pattern),
      message:
        validation.patternMessage ||
        `${field.label} has an invalid format`,
    };
  }

  return (
    <div className={`form-field ${hasError ? "has-error" : ""}`}>
      <label htmlFor={field.name}>
        {field.label}
        {field.required && (
          <span style={{ color: "var(--color-danger)", marginLeft: "2px" }}
                aria-hidden="true"> *</span>
        )}
      </label>

      <textarea
        id={field.name}
        rows="4"
        placeholder={field.placeholder || ""}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${field.name}-error` : undefined}
        {...register(field.name, rules)}
      />

      {hasError && (
        <p id={`${field.name}-error`} className="ui-input-error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default TextareaField;