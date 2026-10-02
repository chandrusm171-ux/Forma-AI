export async function extractFormData(story) {
  // Temporary implementation.
  // This will be replaced with the backend API call.

  return {
    incidentType: "animal_collision",
    vehicle: "Honda City",
    description: story,
    hasDamage: true,
    damageDescription: "The windshield was damaged.",
  };
}