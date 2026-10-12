import Input from "../ui/Input";

function TextField({ field, register, error }) {
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
    <Input
      id={field.name}
      label={field.label}
      type="text"
      placeholder={field.placeholder || ""}
      required={field.required}
      error={error}
      {...register(field.name, rules)}
    />
  );
}

export default TextField;
