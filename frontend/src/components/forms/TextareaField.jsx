import AiBadge from "../ui/AiBadge";
import { buildValidationRules } from "./validation";

function TextareaField({ field, register, error, isAiPrefilled }) {
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : error?.message;
  const helper = field.helperText || field.description;

  return (
    <div className={`ui-input-wrapper form-field ${isAiPrefilled ? "is-ai-prefilled" : ""} ${hasError ? "has-error" : ""}`}>
      <div className="ui-input-label-row">
        <label htmlFor={field.name} className="ui-input-label">
          {field.label}
          {field.required && (
            <span className="ui-required-mark" aria-hidden="true">
              {" "}*
            </span>
          )}
        </label>
        {isAiPrefilled && <AiBadge />}
      </div>

      <div className="ui-input-container">
        <textarea
          id={field.name}
          rows={4}
          disabled={field.disabled}
          placeholder={field.placeholder || ""}
          className="ui-input-field ui-textarea-field"
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${field.name}-error`
              : helper
              ? `${field.name}-helper`
              : undefined
          }
          {...register(field.name, buildValidationRules(field))}
        />
      </div>

      {hasError && (
        <p id={`${field.name}-error`} className="ui-input-error" role="alert">
          {errorMessage}
        </p>
      )}

      {!hasError && helper && (
        <p id={`${field.name}-helper`} className="ui-input-helper">
          {helper}
        </p>
      )}
    </div>
  );
}

export default TextareaField;
