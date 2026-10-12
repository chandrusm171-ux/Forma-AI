/**
 * AI Service – handles AI-related API calls.
 *
 * All functions include a simulated network delay so that loading states
 * and user-feedback components can be observed during development.
 * These stubs will be replaced with real backend API calls once the
 * extraction endpoint is available.
 */

/**
 * Simulates a network delay for development/testing.
 * @param {number} ms – Delay duration in milliseconds.
 * @returns {Promise<void>}
 */
function delay(ms = 1500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extracts structured form data from a natural-language story.
 *
 * @param {string} story – The user's plain-text incident description.
 * @returns {Promise<Object>} Extracted key-value pairs matching the form schema.
 * @throws {Error} If the input is empty or extraction fails.
 */
export async function extractFormData(story) {
  if (!story || !story.trim()) {
    throw new Error("Please provide a description before analysing.");
  }

  // Simulate network latency (will be removed when real API is connected)
  await delay(2000);

  return {
    fullName: "John Doe",
    incidentType: "animal_collision",
    vehicle: "Honda City",
    description: story,
    hasDamage: true,
    damageDescription: "The windshield was damaged.",
  };
}

/**
 * Parses a resume file and returns structured candidate data.
 *
 * @param {File} file – The uploaded resume file.
 * @returns {Promise<Object>} Parsed resume data.
 * @throws {Error} If no file is provided or parsing fails.
 */
export async function parseResume(file) {
  if (!file) {
    throw new Error("No file provided for parsing.");
  }

  // Simulate network latency (will be removed when real API is connected)
  await delay(2500);

  return {
    name: "Extracted Candidate Name",
    email: "candidate@example.com",
    skills: ["JavaScript", "React", "Node.js"],
    experience: "3 years",
    fileName: file.name,
  };
}