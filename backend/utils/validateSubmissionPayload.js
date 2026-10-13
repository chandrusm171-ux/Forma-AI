function validateSubmissionPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { valid: false, error: "Request body must be an object" };
  }

  const { formId, formTitle, data } = payload;

  if (typeof formId !== "string" || !formId.trim() || formId.length > 100) {
    return { valid: false, error: "A valid formId is required (maximum 100 characters)" };
  }

  if (typeof formTitle !== "string" || !formTitle.trim() || formTitle.length > 200) {
    return { valid: false, error: "A valid formTitle is required (maximum 200 characters)" };
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { valid: false, error: "Submission data must be an object" };
  }

  const entries = Object.entries(data);
  if (entries.length === 0 || entries.length > 100) {
    return { valid: false, error: "Submission must contain between 1 and 100 fields" };
  }

  for (const [key, value] of entries) {
    if (!key.trim() || key.length > 100) {
      return { valid: false, error: "Submission contains an invalid field name" };
    }
    const isPrimitive = value === null || ["string", "number", "boolean"].includes(typeof value);
    if (!isPrimitive) {
      return { valid: false, error: `Field ${key} must contain a string, number, boolean, or null` };
    }
    if (typeof value === "string" && value.length > 10000) {
      return { valid: false, error: `Field ${key} exceeds the maximum length` };
    }
  }

  return { valid: true, error: null };
}

module.exports = validateSubmissionPayload;
