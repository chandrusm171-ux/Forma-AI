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


test("Ollama base URL is normalized to the Chat Completions endpoint", () => {
  assert.equal(
    resolveChatCompletionsUrl("http://localhost:11434/v1"),
    "http://localhost:11434/v1/chat/completions"
  );
});

test("Chat Completions URL is not appended twice", () => {
  assert.equal(
    resolveChatCompletionsUrl("http://localhost:11434/v1/chat/completions/"),
    "http://localhost:11434/v1/chat/completions"
  );
});

test("host-only compatible provider URLs receive the standard v1 endpoint", () => {
  assert.equal(
    resolveChatCompletionsUrl("https://api.example.test"),
    "https://api.example.test/v1/chat/completions"
  );
});

test("AI extraction posts to the resolved Chat Completions URL", async () => {
  let requestedUrl;
  const fetchImpl = async (url, options) => {
    requestedUrl = url;
    return {
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ vehicle: "Honda City" }) } }],
      }),
    };
  };

  await extractFormData(
    { text: "My Honda City was damaged." },
    {
      apiKey: "ollama-local",
      baseUrl: "http://localhost:11434/v1",
      fetchImpl,
    }
  );

  assert.equal(requestedUrl, "http://localhost:11434/v1/chat/completions");
});
