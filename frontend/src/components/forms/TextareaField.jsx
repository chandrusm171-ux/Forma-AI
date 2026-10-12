import { buildValidationRules } from "./validation";

function TextareaField({ field, register, error }) {
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : error?.message;
  const rules = buildValidationRules(field);

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