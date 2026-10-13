const test = require("node:test");
const assert = require("node:assert/strict");
const validateFormSchema = require("../utils/validateFormSchema");
const validateSubmissionPayload = require("../utils/validateSubmissionPayload");

const insuranceSchema = {
  id: "insurance-claim",
  title: "Insurance Claim Form",
  fields: [
    { name: "fullName", type: "text", label: "Full Name", required: true },
    {
      name: "incidentType",
      type: "select",
      label: "Incident Type",
      required: true,
      options: [
        { label: "Accident", value: "accident" },
        { label: "Animal Collision", value: "animal_collision" },
      ],
    },
    { name: "hasDamage", type: "checkbox", label: "Was the vehicle damaged?", required: false },
    {
      name: "damageDescription",
      type: "textarea",
      label: "Damage Description",
      required: true,
      condition: { field: "hasDamage", operator: "equals", value: true },
    },
  ],
};

test("accepts frontend-compatible dynamic form schemas", () => {
  assert.deepEqual(validateFormSchema(insuranceSchema), { valid: true, error: null });
});

test("rejects duplicate field names", () => {
  const schema = { fields: [
    { name: "name", type: "text", label: "Name" },
    { name: "name", type: "text", label: "Another name" },
  ] };
  assert.match(validateFormSchema(schema).error, /Duplicate field name/);
});

test("rejects conditions that reference unknown fields", () => {
  const schema = { fields: [
    { name: "detail", type: "text", label: "Detail", condition: { field: "missing", operator: "equals", value: true } },
  ] };
  assert.match(validateFormSchema(schema).error, /unknown field/);
});

test("accepts valid submission payloads with primitive field values", () => {
  assert.deepEqual(validateSubmissionPayload({
    formId: "insurance-claim",
    formTitle: "Insurance Claim Form",
    data: { fullName: "Alex Example", hasDamage: true, incidentType: "accident" },
  }), { valid: true, error: null });
});

test("rejects submission payloads with nested values", () => {
  const result = validateSubmissionPayload({
    formId: "insurance-claim",
    formTitle: "Insurance Claim Form",
    data: { extra: { nested: true } },
  });
  assert.match(result.error, /must contain a string, number, boolean, or null/);
});
