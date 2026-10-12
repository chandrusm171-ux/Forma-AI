import api from "./api";

/**
 * Service for handling dynamic form submissions and schema fetching.
 */
export const formService = {
  /**
   * Submit form claim data to backend API.
   * @param {Object} formData
   * @returns {Promise<any>}
   */
  async submitClaim(formData) {
    try {
      const response = await api.post("/claims", formData);
      return response.data;
    } catch (error) {
      // Fallback for offline/mock development
      console.warn("Backend /claims endpoint not reached, falling back to local simulation:", error);
      return { success: true, data: formData };
    }
  },

  /**
   * Fetch form schema by ID from backend API.
   * @param {string} schemaId
   * @returns {Promise<any>}
   */
  async getSchema(schemaId) {
    const response = await api.get(`/schemas/${schemaId}`);
    return response.data;
  },
};

export default formService;
