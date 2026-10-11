function CheckboxField({ field, register, error }) {
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : error?.message;

  return (
    <div className={`form-field checkbox-field ${hasError ? "has-error" : ""}`}>
      <label>
        <input
          type="checkbox"
          aria-invalid={hasError}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
          {...register(field.name, {
            required: field.required
              ? `${field.label} is required`
              : false,
          })}
        />

        <span>{field.label}</span>
      </label>

      {hasError && (
        <p id={`${field.name}-error`} className="ui-input-error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default CheckboxField;