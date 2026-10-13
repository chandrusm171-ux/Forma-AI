const SUPPORTED_FIELD_TYPES = new Set([
  "text",
  "email",
  "select",
  "textarea",
  "checkbox",
]);

function validateFormSchema(schema) {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    return { valid: false, error: "Schema must be an object" };
  }

  if (!Array.isArray(schema.fields) || schema.fields.length === 0) {
    return { valid: false, error: "Schema must contain at least one field" };
  }

  if (schema.fields.length > 100) {
    return { valid: false, error: "Schema cannot contain more than 100 fields" };
  }

  const names = new Set();

  for (const field of schema.fields) {
    if (!field || typeof field !== "object" || Array.isArray(field)) {
      return { valid: false, error: "Each field must be an object" };
    }

    if (typeof field.name !== "string" || !field.name.trim()) {
      return { valid: false, error: "Each field needs a name" };
    }

    const name = field.name.trim();
    if (names.has(name)) {
      return { valid: false, error: `Duplicate field name: ${name}` };
    }
    names.add(name);

    if (typeof field.label !== "string" || !field.label.trim()) {
      return { valid: false, error: `Field ${name} needs a label` };
    }

    if (!SUPPORTED_FIELD_TYPES.has(field.type)) {
      return { valid: false, error: `Unsupported field type: ${field.type}` };
    }

    if (field.required !== undefined && typeof field.required !== "boolean") {
      return { valid: false, error: `Field ${name} required must be a boolean` };
    }

    if (field.type === "select") {
      if (!Array.isArray(field.options) || field.options.length === 0) {
        return { valid: false, error: `Select field ${name} needs non-empty options` };
      }

      const optionValues = new Set();
      for (const option of field.options) {
        const value = typeof option === "string" ? option : option?.value;
        const label = typeof option === "string" ? option : option?.label;
        if (typeof value !== "string" || !value.trim() || typeof label !== "string" || !label.trim()) {
          return { valid: false, error: `Select field ${name} options must have non-empty string labels and values` };
        }
        if (optionValues.has(value)) {
          return { valid: false, error: `Select field ${name} has duplicate option value: ${value}` };
        }
        optionValues.add(value);
      }
    }

    if (field.validation !== undefined) {
      if (!field.validation || typeof field.validation !== "object" || Array.isArray(field.validation)) {
        return { valid: false, error: `Field ${name} validation must be an object` };
      }
      for (const key of ["minLength", "maxLength"]) {
        const limit = field.validation[key];
        if (limit !== undefined && (!Number.isInteger(limit) || limit < 0 || limit > 10000)) {
          return { valid: false, error: `Field ${name} ${key} must be an integer between 0 and 10000` };
        }
      }
      if (field.validation.pattern !== undefined && typeof field.validation.pattern !== "string") {
        return { valid: false, error: `Field ${name} pattern must be a string` };
      }
      if (field.validation.pattern) {
        try {
          new RegExp(field.validation.pattern);
        } catch {
          return { valid: false, error: `Field ${name} pattern is not a valid regular expression` };
        }
      }
    }

    if (field.condition !== undefined) {
      const condition = field.condition;
      if (!condition || typeof condition !== "object" || Array.isArray(condition)) {
        return { valid: false, error: `Field ${name} condition must be an object` };
      }
      if (typeof condition.field !== "string" || !condition.field.trim()) {
        return { valid: false, error: `Field ${name} condition needs a source field` };
      }
      const supportedOperators = new Set(["equals", "notEquals", "contains", "exists"]);
      if (condition.operator !== undefined && !supportedOperators.has(condition.operator)) {
        return { valid: false, error: `Field ${name} uses an unsupported condition operator` };
      }
    }
  }

  for (const field of schema.fields) {
    if (field.condition && !names.has(field.condition.field.trim())) {
      return { valid: false, error: `Field ${field.name} condition references an unknown field` };
    }
  }

  return { valid: true, error: null };
}

module.exports = validateFormSchema;
