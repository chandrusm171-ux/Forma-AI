import api from "./api";

function unwrap(response) {
  return response.data?.data ?? response.data;
}

export const formService = {
  async createForm(form) {
    const response = await api.post("/forms", form);
    return unwrap(response);
  },

  async listForms() {
    const response = await api.get("/forms");
    return response.data?.data ?? [];
  },

  async getForm(formId) {
    if (!formId) throw new Error("A form ID is required.");
    const response = await api.get(`/forms/${encodeURIComponent(formId)}`);
    return unwrap(response);
  },

  // Kept as a compatibility alias for earlier callers.
  async getSchema(formId) {
    return this.getForm(formId);
  },

  async deleteForm(formId) {
    if (!formId) throw new Error("A form ID is required.");
    const response = await api.delete(`/forms/${encodeURIComponent(formId)}`);
    return response.data;
  },

  async submitSubmission({ formId, formTitle, data }) {
    const response = await api.post("/submissions", {
      formId,
      formTitle,
      data,
    });
    return unwrap(response);
  },

  async listSubmissions({ page = 1, limit = 10, search = "" } = {}) {
    const response = await api.get("/submissions", {
      params: { page, limit, ...(search.trim() ? { search: search.trim() } : {}) },
    });
    return response.data;
  },

  async getSubmission(submissionId) {
    if (!submissionId) throw new Error("A submission ID is required.");
    const response = await api.get(`/submissions/${encodeURIComponent(submissionId)}`);
    return unwrap(response);
  },
};

export default formService;
