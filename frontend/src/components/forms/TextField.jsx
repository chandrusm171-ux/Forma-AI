function TextField({ field, register }) {
  const validation = field.validation || {};

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
    <div className="form-field">
      <label htmlFor={field.name}>
        {field.label}
        {field.required && <span> *</span>}
      </label>

      <input
        id={field.name}
        type="text"
        placeholder={field.placeholder || ""}
        {...register(field.name, rules)}
      />
    </div>
  );
}

export default TextField;