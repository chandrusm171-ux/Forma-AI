const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_MULTIPART_OVERHEAD = 64 * 1024;

class UploadError extends Error {
  constructor(message, code = "INVALID_UPLOAD", statusCode = 400) {
    super(message);
    this.name = "UploadError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

async function readRequestBody(req, maxBytes) {
  const declaredLength = Number(req.headers["content-length"] || 0);
  if (declaredLength > maxBytes) {
    req.resume();
    throw new UploadError("The upload exceeds the 10 MB file limit.", "FILE_TOO_LARGE", 413);
  }

  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > maxBytes) {
      req.resume();
      throw new UploadError("The upload exceeds the 10 MB file limit.", "FILE_TOO_LARGE", 413);
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks, total);
}

async function readResumeUpload(req) {
  const contentType = String(req.headers["content-type"] || "");
  const boundaryMatch = contentType.match(/multipart\/form-data\s*;\s*boundary=(?:"([^"]+)"|([^;\s]+))/i);
  if (!boundaryMatch) {
    throw new UploadError("Upload a resume using multipart/form-data.", "INVALID_MULTIPART_REQUEST");
  }
  const boundary = boundaryMatch[1] || boundaryMatch[2];
  if (!boundary || boundary.length > 200) {
    throw new UploadError("The upload boundary is invalid.", "INVALID_MULTIPART_REQUEST");
  }

  const body = await readRequestBody(req, MAX_FILE_SIZE + MAX_MULTIPART_OVERHEAD);
  const marker = Buffer.from(`--${boundary}`);
  const separator = Buffer.from("\r\n\r\n");
  let cursor = body.indexOf(marker);
  let resumeFile = null;

  while (cursor !== -1) {
    cursor += marker.length;
    if (body.subarray(cursor, cursor + 2).toString() === "--") break;
    if (body.subarray(cursor, cursor + 2).toString() === "\r\n") cursor += 2;

    const headerEnd = body.indexOf(separator, cursor);
    if (headerEnd < 0) throw new UploadError("The upload body is malformed.", "INVALID_MULTIPART_REQUEST");
    const headers = body.subarray(cursor, headerEnd).toString("latin1");
    const contentStart = headerEnd + separator.length;
    const nextMarker = body.indexOf(Buffer.concat([Buffer.from("\r\n"), marker]), contentStart);
    if (nextMarker < 0) throw new UploadError("The upload body is incomplete.", "INVALID_MULTIPART_REQUEST");

    const disposition = headers.match(/content-disposition:\s*form-data;([^\r\n]+)/i)?.[1] || "";
    const fieldName = disposition.match(/(?:^|;)\s*name="([^"]*)"/i)?.[1];
    const filenameMatch = disposition.match(/(?:^|;)\s*filename="([^"]*)"/i);
    if (fieldName === "resume" && filenameMatch) {
      if (resumeFile) throw new UploadError("Upload only one resume at a time.", "MULTIPLE_FILES_NOT_ALLOWED");
      const rawName = filenameMatch[1].replace(/\\"/g, '"').replace(/\\/g, "/").split("/").pop();
      const extension = rawName.slice(rawName.lastIndexOf(".")).toLowerCase();
      const fileBuffer = body.subarray(contentStart, nextMarker);
      if (!rawName || rawName.length > 180 || rawName.includes("\0")) {
        throw new UploadError("The file name is invalid.", "INVALID_FILE_NAME");
      }
      if (!fileBuffer.length) throw new UploadError("The selected file is empty.", "EMPTY_DOCUMENT");
      if (fileBuffer.length > MAX_FILE_SIZE) throw new UploadError("Resume files must be 10 MB or smaller.", "FILE_TOO_LARGE", 413);
      if (!new Set([".pdf", ".docx"]).has(extension)) {
        throw new UploadError("Only PDF and DOCX resumes are supported. Legacy DOC files are not supported yet.", "UNSUPPORTED_DOCUMENT_TYPE", 415);
      }
      const isPdf = fileBuffer.subarray(0, 5).equals(Buffer.from("%PDF-"));
      const isZip = fileBuffer.length >= 4 && fileBuffer.readUInt32LE(0) === 0x04034b50;
      if ((extension === ".pdf" && !isPdf) || (extension === ".docx" && !isZip)) {
        throw new UploadError("The file content does not match its extension. Choose a valid PDF or DOCX file.", "FILE_SIGNATURE_MISMATCH", 415);
      }
      resumeFile = { originalName: rawName, extension, buffer: fileBuffer };
    }
    cursor = nextMarker + 2;
  }

  if (!resumeFile) {
    throw new UploadError('No file was received in the "resume" field.', "RESUME_FILE_REQUIRED");
  }
  return resumeFile;
}

module.exports = { readResumeUpload, UploadError, MAX_FILE_SIZE };
