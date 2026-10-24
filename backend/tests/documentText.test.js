const test = require("node:test");
const assert = require("node:assert/strict");
const {
  DocumentParseError,
  extractDocumentText,
  extractPdfText,
  extractDocxText,
} = require("../utils/extractDocumentText");

function makeStoredZip(entryName, contents) {
  const name = Buffer.from(entryName, "utf8");
  const data = Buffer.from(contents, "utf8");
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0, 6);
  local.writeUInt16LE(0, 8);
  local.writeUInt32LE(0, 14); // CRC is not needed by our reader.
  local.writeUInt32LE(data.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(name.length, 26);
  local.writeUInt16LE(0, 28);
  const localRecord = Buffer.concat([local, name, data]);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0, 8);
  central.writeUInt16LE(0, 10);
  central.writeUInt32LE(0, 16);
  central.writeUInt32LE(data.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(name.length, 28);
  central.writeUInt16LE(0, 30);
  central.writeUInt16LE(0, 32);
  central.writeUInt32LE(0, 42);
  const centralRecord = Buffer.concat([central, name]);

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(1, 8);
  eocd.writeUInt16LE(1, 10);
  eocd.writeUInt32LE(centralRecord.length, 12);
  eocd.writeUInt32LE(localRecord.length, 16);
  return Buffer.concat([localRecord, centralRecord, eocd]);
}

test("extracts text from a simple text-based PDF", () => {
  const pdf = Buffer.from("%PDF-1.4\n1 0 obj\n<< /Length 56 >>\nstream\nBT (Priya Sharma) Tj (priya@example.com) Tj ET\nendstream\nendobj\n%%EOF", "latin1");
  assert.match(extractPdfText(pdf), /Priya Sharma/);
  assert.match(extractPdfText(pdf), /priya@example.com/);
});

test("extracts readable text from DOCX document.xml", () => {
  const xml = '<?xml version="1.0"?><w:document xmlns:w="urn:test"><w:body><w:p><w:r><w:t>Priya Sharma</w:t></w:r></w:p><w:p><w:r><w:t>priya@example.com</w:t></w:r></w:p><w:p><w:r><w:t>React &amp; Node.js developer with five years of experience</w:t></w:r></w:p></w:body></w:document>';
  const docx = makeStoredZip("word/document.xml", xml);
  const text = extractDocxText(docx);
  assert.match(text, /Priya Sharma/);
  assert.match(text, /priya@example.com/);
  assert.match(text, /React & Node.js/);
});

test("rejects mismatched document signatures", () => {
  assert.throws(
    () => extractDocumentText(Buffer.from("not a pdf"), ".pdf"),
    (error) => error instanceof DocumentParseError && error.code === "INVALID_FILE_SIGNATURE"
  );
});

test("rejects scanned or image-only PDFs without readable text", () => {
  assert.throws(
    () => extractPdfText(Buffer.from("%PDF-1.4\n1 0 obj << /Type /Page >> endobj %%EOF", "latin1")),
    (error) => error instanceof DocumentParseError && error.code === "NO_READABLE_TEXT"
  );
});

test("rejects legacy DOC files with a clear message", () => {
  assert.throws(
    () => extractDocumentText(Buffer.from("legacy binary"), ".doc"),
    (error) => error instanceof DocumentParseError && error.code === "UNSUPPORTED_DOCUMENT_TYPE"
  );
});
