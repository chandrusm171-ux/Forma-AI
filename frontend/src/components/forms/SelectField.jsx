import { buildValidationRules } from "./validation";

function SelectField({ field, register, error }) {
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : error?.message;

  return (
    <div className={`form-field ${hasError ? "has-error" : ""}`}>
      <label htmlFor={field.name}>
        {field.label}
        {field.required && (
          <span
            style={{ color: "var(--color-danger)", marginLeft: "2px" }}
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      <select
        id={field.name}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${field.name}-error` : undefined}
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

      {hasError && (
        <p id={`${field.name}-error`} className="ui-input-error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default SelectField;
