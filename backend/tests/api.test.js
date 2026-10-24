const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../app");

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  if (!server) return;
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("root endpoint confirms that the API is running", async () => {
  const response = await fetch(baseUrl);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.match(body.message, /Backend is running/);
});

test("health endpoint stays available when MongoDB is disconnected", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.database, "disconnected");
  assert.equal(body.status, "degraded");
});

test("readiness endpoint returns 503 while MongoDB is disconnected", async () => {
  const response = await fetch(`${baseUrl}/api/ready`);
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.success, false);
  assert.equal(body.status, "not_ready");
});

test("malformed JSON returns a structured 400 response", async () => {
  const response = await fetch(`${baseUrl}/api/forms`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{invalid-json",
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.code, "INVALID_JSON");
});

test("unknown routes return a structured 404 response", async () => {
  const response = await fetch(`${baseUrl}/api/does-not-exist`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.code, "ROUTE_NOT_FOUND");
});

test("resume parser rejects requests without multipart upload data", async () => {
  const response = await fetch(`${baseUrl}/api/ai/parse-resume`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fileName: "resume.pdf" }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.code, "INVALID_MULTIPART_REQUEST");
});

test("resume parser validates the uploaded file signature before invoking AI", async () => {
  const boundary = "forma-ai-test-boundary";
  const bodyBuffer = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="resume.pdf"\r\nContent-Type: application/pdf\r\n\r\n`, "utf8"),
    Buffer.from("not really a PDF document", "utf8"),
    Buffer.from(`\r\n--${boundary}--\r\n`, "utf8"),
  ]);
  const response = await fetch(`${baseUrl}/api/ai/parse-resume`, {
    method: "POST",
    headers: { "content-type": `multipart/form-data; boundary=${boundary}` },
    body: bodyBuffer,
  });
  const result = await response.json();

  assert.equal(response.status, 415);
  assert.equal(result.success, false);
  assert.equal(result.code, "FILE_SIGNATURE_MISMATCH");
});
