/**
 * Utility to construct React Hook Form validation rules from schema field definitions.
 * Centralizes validation logic for text, textarea, select, and checkbox fields.
 *
 * @param {Object} field - Schema field definition
 * @returns {Object} React Hook Form validation rules
 */
export function buildValidationRules(field) {
  if (!field) return {};

  const validation = field.validation || {};
  const rules = {};

  if (field.required) {
    rules.required = `${field.label || field.name} is required`;
  }

  if (validation.minLength) {
    rules.minLength = {
      value: validation.minLength,
      message: `${field.label || field.name} must be at least ${validation.minLength} characters`,
    };
  }

  if (validation.maxLength) {
    rules.maxLength = {
      value: validation.maxLength,
      message: `${field.label || field.name} must not exceed ${validation.maxLength} characters`,
    };
  }

  if (validation.pattern) {
    rules.pattern = {
      value: new RegExp(validation.pattern),
      message:
        validation.patternMessage ||
        `${field.label || field.name} has an invalid format`,
    };
  }

  return rules;
}
