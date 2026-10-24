const test = require("node:test");
const assert = require("node:assert/strict");
const { Readable } = require("node:stream");
const { readResumeUpload, UploadError } = require("../utils/readResumeUpload");

function requestFor(buffer, boundary, contentType = `multipart/form-data; boundary=${boundary}`) {
  const req = Readable.from([buffer]);
  req.headers = { "content-type": contentType, "content-length": String(buffer.length) };
  return req;
}

function multipartFile({ boundary = "resume-test", name = "resume.pdf", content = "%PDF-1.7\ntext", field = "resume" } = {}) {
  return Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${field}"; filename="${name}"\r\nContent-Type: application/pdf\r\n\r\n`, "utf8"),
    Buffer.from(content, "utf8"),
    Buffer.from(`\r\n--${boundary}--\r\n`, "utf8"),
  ]);
}

test("reads a bounded PDF file from multipart/form-data", async () => {
  const boundary = "resume-test";
  const upload = await readResumeUpload(requestFor(multipartFile({ boundary }), boundary));
  assert.equal(upload.originalName, "resume.pdf");
  assert.equal(upload.extension, ".pdf");
  assert.equal(upload.buffer.subarray(0, 5).toString(), "%PDF-");
});

test("rejects a missing resume field", async () => {
  const boundary = "resume-test";
  await assert.rejects(
    readResumeUpload(requestFor(multipartFile({ boundary, field: "other" }), boundary)),
    (error) => error instanceof UploadError && error.code === "RESUME_FILE_REQUIRED"
  );
});

test("rejects files whose extension does not match the content signature", async () => {
  const boundary = "resume-test";
  await assert.rejects(
    readResumeUpload(requestFor(multipartFile({ boundary, content: "not a PDF" }), boundary)),
    (error) => error instanceof UploadError && error.code === "FILE_SIGNATURE_MISMATCH"
  );
});

test("rejects unsupported legacy DOC extension", async () => {
  const boundary = "resume-test";
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="resume.doc"\r\nContent-Type: application/msword\r\n\r\n`),
    Buffer.from([0xcf, 0xd0, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0x00]),
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);
  await assert.rejects(
    readResumeUpload(requestFor(body, boundary)),
    (error) => error instanceof UploadError && error.code === "UNSUPPORTED_DOCUMENT_TYPE"
  );
});

test("rejects a non-multipart request", async () => {
  const req = requestFor(Buffer.from("{}"), "", "application/json");
  await assert.rejects(
    readResumeUpload(req),
    (error) => error instanceof UploadError && error.code === "INVALID_MULTIPART_REQUEST"
  );
});
