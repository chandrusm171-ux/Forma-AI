const zlib = require("node:zlib");

const MAX_EXTRACTED_TEXT = 100_000;
const MAX_EXPANDED_STREAM = 5 * 1024 * 1024;

class DocumentParseError extends Error {
  constructor(message, code = "DOCUMENT_PARSE_FAILED", statusCode = 400) {
    super(message);
    this.name = "DocumentParseError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

function decodePdfLiteral(value) {
  return value
    .replace(/\\([nrtbf()\\])/g, (_match, character) => ({
      n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", "(": "(", ")": ")", "\\": "\\",
    })[character])
    .replace(/\\([0-7]{1,3})/g, (_match, octal) => String.fromCharCode(parseInt(octal, 8)))
    .replace(/\\\r?\n/g, "");
}

function decodePdfHex(value) {
  const hex = value.replace(/\s/g, "");
  if (!hex || !/^[0-9a-f]+$/i.test(hex)) return "";
  const padded = hex.length % 2 ? `${hex}0` : hex;
  const bytes = Buffer.from(padded, "hex");
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    let output = "";
    for (let i = 2; i + 1 < bytes.length; i += 2) output += String.fromCharCode(bytes.readUInt16BE(i));
    return output;
  }
  return bytes.toString("latin1");
}

function textFromPdfOperators(stream) {
  const source = Buffer.isBuffer(stream) ? stream.toString("latin1") : String(stream);
  const output = [];
  // Text-showing operators used by many text-based PDFs.
  const operatorPattern = /\(((?:\\.|[^\\)])*)\)\s*Tj|\[((?:.|\n|\r)*?)\]\s*TJ|<([0-9a-f\s]+)>\s*Tj/gim;
  let match;
  while ((match = operatorPattern.exec(source))) {
    if (match[1] !== undefined) output.push(decodePdfLiteral(match[1]));
    else if (match[2] !== undefined) {
      const array = match[2];
      const itemPattern = /\(((?:\\.|[^\\)])*)\)|<([0-9a-f\s]+)>/gim;
      let item;
      while ((item = itemPattern.exec(array))) output.push(item[1] !== undefined ? decodePdfLiteral(item[1]) : decodePdfHex(item[2]));
      output.push(" ");
    } else if (match[3] !== undefined) output.push(decodePdfHex(match[3]));
    output.push(" ");
  }
  return output.join("").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, " ").replace(/[ \t]+/g, " ").trim();
}

function extractPdfText(buffer) {
  if (!buffer.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
    throw new DocumentParseError("The uploaded file is not a valid PDF.", "INVALID_FILE_SIGNATURE");
  }

  const source = buffer.toString("latin1");
  const chunks = [];
  const streamPattern = /<<(.*?)>>\s*stream\r?\n/gis;
  let match;
  while ((match = streamPattern.exec(source))) {
    const dataStart = streamPattern.lastIndex;
    const declaredLength = match[1].match(/\/Length\s+(\d+)\b/)?.[1];
    const exactEnd = declaredLength ? dataStart + Number(declaredLength) : -1;
    const end = source.indexOf("endstream", dataStart);
    if (end < 0) break;
    let streamBuffer = exactEnd >= dataStart && exactEnd <= buffer.length
      ? buffer.subarray(dataStart, exactEnd)
      : buffer.subarray(dataStart, end);
    // Without a direct /Length value, trim only the line break before endstream.
    if (!(exactEnd >= dataStart && exactEnd <= buffer.length)) {
      while (streamBuffer.length && (streamBuffer[streamBuffer.length - 1] === 10 || streamBuffer[streamBuffer.length - 1] === 13)) {
        streamBuffer = streamBuffer.subarray(0, streamBuffer.length - 1);
      }
    }
    let decoded = streamBuffer;
    if (/\/FlateDecode\b/.test(match[1])) {
      try {
        decoded = zlib.inflateSync(streamBuffer, { maxOutputLength: MAX_EXPANDED_STREAM });
      } catch {
        try {
          decoded = zlib.inflateRawSync(streamBuffer, { maxOutputLength: MAX_EXPANDED_STREAM });
        } catch {
          streamPattern.lastIndex = end + 9;
          continue;
        }
      }
    }
    const text = textFromPdfOperators(decoded);
    if (text) chunks.push(text);
    streamPattern.lastIndex = end + 9;
    if (chunks.join(" ").length > MAX_EXTRACTED_TEXT) break;
  }

  // Also support simple PDFs with text operators outside stream blocks.
  if (!chunks.length) {
    const direct = textFromPdfOperators(source);
    if (direct) chunks.push(direct);
  }

  const result = chunks.join(" ").replace(/\s+/g, " ").trim().slice(0, MAX_EXTRACTED_TEXT);
  if (result.length < 20) {
    throw new DocumentParseError(
      "No readable text was found. Scanned/image-only PDFs need OCR and are not supported in this release.",
      "NO_READABLE_TEXT",
      422
    );
  }
  return result;
}

function findZipEntry(buffer, targetName) {
  if (buffer.length < 22) {
    throw new DocumentParseError("The DOCX archive is malformed.", "INVALID_DOCX_ARCHIVE");
  }
  // Locate the End of Central Directory record (the comment may be up to 65,535 bytes).
  const min = Math.max(0, buffer.length - 65_557);
  let eocd = -1;
  for (let i = buffer.length - 22; i >= min; i -= 1) {
    if (buffer.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new DocumentParseError("The DOCX archive is malformed.", "INVALID_DOCX_ARCHIVE");
  const entryCount = buffer.readUInt16LE(eocd + 10);
  const directoryOffset = buffer.readUInt32LE(eocd + 16);
  let cursor = directoryOffset;

  for (let i = 0; i < entryCount; i += 1) {
    if (cursor + 46 > buffer.length || buffer.readUInt32LE(cursor) !== 0x02014b50) break;
    const method = buffer.readUInt16LE(cursor + 10);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const uncompressedSize = buffer.readUInt32LE(cursor + 24);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.subarray(cursor + 46, cursor + 46 + nameLength).toString("utf8");

    if (name === targetName) {
      if (uncompressedSize > MAX_EXPANDED_STREAM) {
        throw new DocumentParseError("The document text is too large to process safely.", "DOCUMENT_CONTENT_TOO_LARGE", 413);
      }
      if (localOffset + 30 > buffer.length || buffer.readUInt32LE(localOffset) !== 0x04034b50) {
        throw new DocumentParseError("The DOCX document entry is malformed.", "INVALID_DOCX_ARCHIVE");
      }
      const localNameLength = buffer.readUInt16LE(localOffset + 26);
      const localExtraLength = buffer.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
      try {
        if (method === 0) return compressed;
        if (method === 8) return zlib.inflateRawSync(compressed, { maxOutputLength: MAX_EXPANDED_STREAM });
      } catch {
        throw new DocumentParseError("The DOCX document could not be decompressed safely.", "INVALID_DOCX_ARCHIVE");
      }
      throw new DocumentParseError("This DOCX compression method is not supported.", "UNSUPPORTED_DOCX_COMPRESSION");
    }
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  throw new DocumentParseError("This file is not a valid DOCX document.", "INVALID_DOCX_CONTENT");
}

function decodeXmlEntities(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_m, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, code) => String.fromCodePoint(parseInt(code, 16)));
}

function extractDocxText(buffer) {
  if (buffer.length < 4 || buffer.readUInt32LE(0) !== 0x04034b50) {
    throw new DocumentParseError("The uploaded file is not a valid DOCX archive.", "INVALID_FILE_SIGNATURE");
  }
  const xml = findZipEntry(buffer, "word/document.xml").toString("utf8");
  const text = xml
    .replace(/<w:tab\b[^>]*\/>/g, "\t")
    .replace(/<w:br\b[^>]*\/>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(?:lt|gt|quot|apos|amp|#\d+|#x[0-9a-f]+);/gi, decodeXmlEntities)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_EXTRACTED_TEXT);
  if (text.length < 20) {
    throw new DocumentParseError("No readable text was found in the DOCX document.", "NO_READABLE_TEXT", 422);
  }
  return text;
}

function extractDocumentText(buffer, extension) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new DocumentParseError("The uploaded document is empty.", "EMPTY_DOCUMENT");
  }
  const ext = String(extension || "").toLowerCase();
  if (ext === ".pdf") return extractPdfText(buffer);
  if (ext === ".docx") return extractDocxText(buffer);
  if (ext === ".doc") {
    throw new DocumentParseError("Legacy .doc files are not supported yet. Please save the resume as PDF or DOCX.", "UNSUPPORTED_DOCUMENT_TYPE", 415);
  }
  throw new DocumentParseError("Only PDF and DOCX resumes are supported.", "UNSUPPORTED_DOCUMENT_TYPE", 415);
}

module.exports = {
  DocumentParseError,
  extractDocumentText,
  extractPdfText,
  extractDocxText,
  textFromPdfOperators,
};
