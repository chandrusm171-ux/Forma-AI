import { buildValidationRules } from "./validation";

function SelectField({ field, register, error }) {
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : error?.message;
  const helper = field.helperText || field.description;

  return (
    <div className={`ui-input-wrapper form-field ${hasError ? "has-error" : ""}`}>
      <label htmlFor={field.name} className="ui-input-label">
        {field.label}
        {field.required && (
          <span className="ui-required-mark" aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>

      <div className="ui-input-container">
        <select
          id={field.name}
          disabled={field.disabled}
          className="ui-input-field ui-select-field"
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${field.name}-error`
              : helper
              ? `${field.name}-helper`
              : undefined
          }
          {...register(field.name, buildValidationRules(field))}
        >
          <option value="">— Select an option —</option>
          {field.options?.map((option) => {
            const value = typeof option === "string" ? option : option.value;
            const label = typeof option === "string" ? option : option.label;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
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

export default SelectField;
