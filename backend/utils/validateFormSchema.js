
const SUPPORTED_FIELD_TYPES = [
  "text",
  "email",
  "select",
  "textarea",
];

function validateFormSchema(schema) {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    return { valid: false, error: "Schema must be an object" };
  }

  if (!Array.isArray(schema.fields)) {
    return { valid: false, error: "Schema must contain a fields array" };
  }

  const names = new Set();

  for (const field of schema.fields) {
    if (!field || typeof field !== "object" || Array.isArray(field)) {
      return { valid: false, error: "Each field must be an object" };
    }

    if (typeof field.name !== "string" || !field.name.trim()) {
      return { valid: false, error: "Each field needs a name" };
    }

    if (names.has(field.name)) {
      return { valid: false, error: `Duplicate field name: ${field.name}` };
    }

    names.add(field.name);

    if (typeof field.label !== "string" || !field.label.trim()) {
      return { valid: false, error: `Field ${field.name} needs a label` };
    }

    if (!SUPPORTED_FIELD_TYPES.includes(field.type)) {
      return { valid: false, error: `Unsupported field type: ${field.type}` };
    }

    if (typeof field.required !== "boolean") {
      return { valid: false, error: `Field ${field.name} needs a boolean required value` };
    }

    if (
      field.type === "select" &&
      (!Array.isArray(field.options) ||
        field.options.length === 0 ||
        !field.options.every(
          (option) => typeof option === "string" && option.trim()
        ))
    ) {
      return { valid: false, error: `Select field ${field.name} needs non-empty string options` };
    }
  }

  return { valid: true, error: null };
}

module.exports = validateFormSchema;
