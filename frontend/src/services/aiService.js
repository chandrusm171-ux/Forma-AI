
import axios from "axios";

function getResponseData(response) {
  return response.data?.data ?? response.data;
}

function getApiErrorMessage(error, fallback) {
  if (error.code === "ERR_NETWORK") {
    return "Local AI is unavailable. Start Ollama and the Forma-AI Local AI server on your computer.";
  }

  return error.response?.data?.message || error.message || fallback;
}

const localAiApi = axios.create({
  baseURL:
    import.meta.env.VITE_LOCAL_AI_BASE_URL ||
    "http://127.0.0.1:5001/api",
  timeout: 120000,
});

export async function extractFormData(
  story,
  schemaId = "insurance-claim"
) {
  if (typeof story !== "string" || !story.trim()) {
    throw new Error("Please provide a description before analysing.");
  }

  try {
    const response = await localAiApi.post("/ai/extract", {
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

export async function parseResume(file) {
  if (!(file instanceof File)) {
    throw new Error("Please select a resume file before parsing.");
  }

  if (!/\.(pdf|docx)$/i.test(file.name)) {
    throw new Error(
      "Please select a PDF or DOCX resume. Legacy DOC files are not supported yet."
    );
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Resume files must be 10 MB or smaller.");
  }

  const body = new FormData();
  body.append("resume", file);

  try {
    const response = await localAiApi.post("/ai/parse-resume", body, {
      timeout: 120000,
    });

    return getResponseData(response);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Resume parsing failed. Please try again."),
      { cause: error }
    );
  }
}
