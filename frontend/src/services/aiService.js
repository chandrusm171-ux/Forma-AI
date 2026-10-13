import api from "./api";

function getResponseData(response) {
  return response.data?.data ?? response.data;
}

function getApiErrorMessage(error, fallback) {
  return error.response?.data?.message || error.message || fallback;
}

/**
 * Ask the backend AI integration to extract values for the selected schema.
 * The backend currently returns AI_SERVICE_NOT_CONFIGURED until the LangChain
 * provider is implemented. This service intentionally does not fabricate data.
 */
export async function extractFormData(story, schemaId = "insurance-claim") {
  if (typeof story !== "string" || !story.trim()) {
    throw new Error("Please provide a description before analysing.");
  }

  try {
    const response = await api.post("/ai/extract", {
      text: story.trim(),
      schemaId,
    });
    return getResponseData(response);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "AI extraction failed. Please try again."),
      { cause: error }
    );
  }
}

/** Send a resume file to the backend parser when that endpoint is implemented. */
export async function parseResume(file) {
  if (!(file instanceof File)) {
    throw new Error("Please select a resume file before parsing.");
  }

  const allowedTypes = ["application/pdf"];
  const allowedExtensions = /\.(pdf|doc|docx)$/i;
  if (!allowedTypes.includes(file.type) && !allowedExtensions.test(file.name)) {
    throw new Error("Please select a PDF, DOC, or DOCX resume.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Resume files must be 10 MB or smaller.");
  }

  const body = new FormData();
  body.append("resume", file);

  try {
    const response = await api.post("/ai/parse-resume", body, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });
    return getResponseData(response);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Resume parsing failed. Please try again."),
      { cause: error }
    );
  }
}
