const test = require("node:test");
const assert = require("node:assert/strict");
const {
  AIServiceError,
  extractFormData,
  normalizeExtractedData,
  resolveChatCompletionsUrl,
} = require("../services/aiExtractionService");

function fakeFetch(payload, status = 200) {
  return async (_url, options) => {
    assert.equal(options.method, "POST");
    assert.equal(options.headers.Authorization, "Bearer test-key");
    const request = JSON.parse(options.body);
    assert.equal(request.response_format.type, "json_object");
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => payload,
    };
  };
}

test("AI extraction requires an API key and does not fabricate results", async () => {
  await assert.rejects(
    extractFormData(
      { text: "My car was damaged in an accident." },
      { apiKey: "", fetchImpl: fakeFetch({}) }
    ),
    (error) => error instanceof AIServiceError &&
      error.statusCode === 503 &&
      error.code === "AI_SERVICE_NOT_CONFIGURED"
  );
});

test("AI extraction sends a prompt and returns only allowed, normalized fields", async () => {
  const result = await extractFormData(
    { text: "My Honda City was hit by a deer. The front bumper is damaged." },
    {
      apiKey: "test-key",
      fetchImpl: fakeFetch({
        choices: [{
          message: {
            content: JSON.stringify({
              fullName: null,
              incidentType: "animal_collision",
              vehicle: " Honda City ",
              description: "The vehicle collided with a deer.",
              hasDamage: true,
              damageDescription: "The front bumper is damaged.",
              admin: true,
              unsupported: "ignored",
            }),
          },
        }],
      }),
    }
  );

  assert.deepEqual(result, {
    vehicle: "Honda City",
    description: "The vehicle collided with a deer.",
    damageDescription: "The front bumper is damaged.",
    incidentType: "animal_collision",
    hasDamage: true,
  });
});

test("AI extraction drops invalid enum values and does not preserve damage details when no damage is reported", () => {
  assert.deepEqual(normalizeExtractedData({
    incidentType: "made-up-type",
    hasDamage: false,
    damageDescription: "Some damage",
    unknownField: "not allowed",
  }), { hasDamage: false });
});

test("AI extraction rejects unsupported schema identifiers", async () => {
  await assert.rejects(
    extractFormData(
      { text: "An incident happened.", schemaId: "unknown-form" },
      { apiKey: "test-key", fetchImpl: fakeFetch({}) }
    ),
    (error) => error instanceof AIServiceError &&
      error.statusCode === 400 &&
      error.code === "UNSUPPORTED_SCHEMA"
  );
});

test("AI extraction rejects empty and overly long descriptions", async () => {
  await assert.rejects(
    extractFormData({ text: " " }, { apiKey: "test-key", fetchImpl: fakeFetch({}) }),
    (error) => error.code === "INVALID_EXTRACTION_INPUT"
  );
  await assert.rejects(
    extractFormData({ text: "x".repeat(10001) }, { apiKey: "test-key", fetchImpl: fakeFetch({}) }),
    (error) => error.code === "INPUT_TOO_LARGE"
  );
});

test("AI provider failures are returned as safe errors", async () => {
  await assert.rejects(
    extractFormData(
      { text: "An incident happened." },
      { apiKey: "test-key", fetchImpl: fakeFetch({ error: "private" }, 401) }
    ),
    (error) => error instanceof AIServiceError &&
      error.statusCode === 502 &&
      !error.message.includes("private")
  );
});


test("Chat Completions URL resolver accepts a base URL or a complete endpoint", () => {
  assert.equal(
    resolveChatCompletionsUrl("http://localhost:11434/v1"),
    "http://localhost:11434/v1/chat/completions"
  );
  assert.equal(
    resolveChatCompletionsUrl("http://localhost:11434/v1/"),
    "http://localhost:11434/v1/chat/completions"
  );
  assert.equal(
    resolveChatCompletionsUrl("http://localhost:11434/v1/chat/completions"),
    "http://localhost:11434/v1/chat/completions"
  );
  assert.equal(
    resolveChatCompletionsUrl("http://localhost:11434"),
    "http://localhost:11434/v1/chat/completions"
  );
});

test("AI normalization rejects wrong primitive types and invalid dates", () => {
  const result = normalizeExtractedData({
    vehicle: true,
    hasDamage: "yes",
    incidentDate: "yesterday",
    description: "  A deer hit the vehicle.  ",
    damageDescription: 123,
  }, {
    fields: {
      vehicle: "string or null",
      hasDamage: "boolean or null",
      incidentDate: "string (YYYY-MM-DD) or null",
      description: "string or null",
      damageDescription: "string or null",
    },
  });

  assert.deepEqual(result, {
    description: "A deer hit the vehicle.",
  });
});


test("all five starter workflows are available to the AI extraction service", () => {
  const { listSupportedSchemas } = require("../services/aiExtractionService");
  assert.deepEqual(listSupportedSchemas().map((item) => item.id), [
    "insurance-claim",
    "patient-intake",
    "personal-loan",
    "legal-intake",
    "job-application",
  ]);
});

test("AI extraction uses the selected workflow schema", async () => {
  let requestBody;
  const fetchImpl = async (_url, options) => {
    requestBody = JSON.parse(options.body);
    return {
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({
          fullName: "Jamie Doe",
          chiefComplaint: "A persistent headache for two days",
          symptomDuration: "1_3_days",
          painLevel: "4-6",
          hasAllergies: false,
        }) } }],
      }),
    };
  };

  const result = await extractFormData(
    { text: "Jamie has had a headache for two days, moderate pain, no known allergies.", schemaId: "patient-intake" },
    { apiKey: "ollama-local", baseUrl: "http://localhost:11434/v1", fetchImpl }
  );

  assert.match(requestBody.messages[0].content, /Patient Intake/);
  assert.deepEqual(result, {
    fullName: "Jamie Doe",
    chiefComplaint: "A persistent headache for two days",
    symptomDuration: "1_3_days",
    painLevel: "4-6",
    hasAllergies: false,
  });
});


test("AI extraction maps provider timeout to a safe 504 error", async () => {
  const timeoutFetch = async () => {
    const error = new Error("aborted");
    error.name = "AbortError";
    throw error;
  };
  await assert.rejects(
    extractFormData(
      { text: "My vehicle was damaged." },
      { apiKey: "test-key", fetchImpl: timeoutFetch, timeoutMs: 1 }
    ),
    (error) => error instanceof AIServiceError &&
      error.statusCode === 504 &&
      error.code === "AI_PROVIDER_TIMEOUT"
  );
});

test("AI extraction maps an unavailable local provider to a safe error", async () => {
  const offlineFetch = async () => { throw new Error("private host detail"); };
  await assert.rejects(
    extractFormData(
      { text: "My vehicle was damaged." },
      { apiKey: "test-key", baseUrl: "http://localhost:11434/v1", fetchImpl: offlineFetch }
    ),
    (error) => error instanceof AIServiceError &&
      error.statusCode === 502 &&
      error.code === "AI_PROVIDER_UNREACHABLE" &&
      !error.message.includes("private host detail")
  );
});

test("AI extraction rejects malformed JSON returned by the model", async () => {
  await assert.rejects(
    extractFormData(
      { text: "My vehicle was damaged." },
      {
        apiKey: "test-key",
        fetchImpl: async () => ({
          ok: true,
          status: 200,
          json: async () => ({ choices: [{ message: { content: "not valid JSON" } }] }),
        }),
      }
    ),
    (error) => error instanceof AIServiceError &&
      error.code === "AI_PROVIDER_ERROR" &&
      /valid JSON/.test(error.message)
  );
});


test("resume-profile extraction returns only the defined resume fields", async () => {
  const result = await extractFormData(
    { text: "Priya Sharma is a frontend engineer with five years of experience. Email priya@example.com. Skills: React, Node.js. B.Tech Computer Science.", schemaId: "resume-profile" },
    {
      apiKey: "ollama-local",
      baseUrl: "http://localhost:11434/v1",
      fetchImpl: async (_url, options) => {
        const request = JSON.parse(options.body);
        assert.match(request.messages[0].content, /Resume Profile/);
        return {
          ok: true,
          status: 200,
          json: async () => ({ choices: [{ message: { content: JSON.stringify({
            name: "Priya Sharma",
            email: "priya@example.com",
            role: "Frontend Engineer",
            experience: "5 years",
            education: "B.Tech Computer Science",
            skills: "React, Node.js",
            summary: "Frontend engineer with five years of experience.",
            internalNotes: "must be ignored",
          }) } }] }),
        };
      },
    }
  );

  assert.deepEqual(result, {
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "Frontend Engineer",
    experience: "5 years",
    education: "B.Tech Computer Science",
    skills: "React, Node.js",
    summary: "Frontend engineer with five years of experience.",
  });
  assert.equal(require("../services/aiExtractionService").listSupportedSchemas().length, 5);
});
