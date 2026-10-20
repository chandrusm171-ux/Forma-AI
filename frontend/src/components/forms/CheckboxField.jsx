import AiBadge from "../ui/AiBadge";
import { buildValidationRules } from "./validation";

/**
 * CheckboxField component for boolean/consent form inputs.
 */
function CheckboxField({ field, register, error, isAiPrefilled }) {
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : error?.message;
  const helper = field.helperText || field.description;

  return (
    <div className={`form-field checkbox-field ${isAiPrefilled ? "is-ai-prefilled" : ""} ${hasError ? "has-error" : ""}`}>
      <label htmlFor={field.name}>
        <input
          id={field.name}
          type="checkbox"
          disabled={field.disabled}
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
        <span>
          {field.label}
          {field.required && (
            <span className="ui-required-mark" aria-hidden="true">
              {" "}*
            </span>
          )}
        </span>
        {isAiPrefilled && <AiBadge />}
      </label>

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

export default CheckboxField;
