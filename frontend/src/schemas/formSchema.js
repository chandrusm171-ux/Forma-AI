const option = (label, value = label) => ({ label, value });

export const insuranceClaimSchema = {
  id: "insurance-claim",
  title: "Insurance Claim Form",
  description: "Share the incident details. AI can help prefill fields, and you can review every value before submission.",
  fields: [
    { name: "fullName", type: "text", label: "Full Name", placeholder: "Enter your full name", required: true, validation: { minLength: 3, maxLength: 50 } },
    { name: "incidentType", type: "select", label: "Incident Type", required: true, options: [option("Accident", "accident"), option("Animal Collision", "animal_collision"), option("Theft", "theft"), option("Weather-related", "weather"), option("Other", "other")] },
    { name: "vehicle", type: "text", label: "Vehicle", placeholder: "Example: Honda City", required: true, validation: { minLength: 2, maxLength: 50 } },
    { name: "incidentDate", type: "text", label: "Incident Date", placeholder: "YYYY-MM-DD", helperText: "Use YYYY-MM-DD when the date is known.", validation: { maxLength: 10, pattern: "^$|^\\d{4}-\\d{2}-\\d{2}$" } },
    { name: "incidentLocation", type: "text", label: "Incident Location", placeholder: "Road, city, or nearby landmark", validation: { maxLength: 150 } },
    { name: "description", type: "textarea", label: "Incident Description", placeholder: "Describe what happened...", required: true, validation: { minLength: 10, maxLength: 500 } },
    { name: "hasDamage", type: "checkbox", label: "Was the vehicle damaged?" },
    { name: "damageDescription", type: "textarea", label: "Damage Description", placeholder: "Describe the damage...", required: true, validation: { minLength: 10, maxLength: 500 }, condition: { field: "hasDamage", operator: "equals", value: true } },
  ],
};

export const patientIntakeSchema = {
  id: "patient-intake",
  title: "Patient Intake Form",
  description: "Capture the reason for a visit and relevant health information. Review all AI-suggested values carefully.",
  fields: [
    { name: "fullName", type: "text", label: "Full Name", placeholder: "Patient full name", required: true, validation: { minLength: 2, maxLength: 100 } },
    { name: "chiefComplaint", type: "textarea", label: "Main Concern", placeholder: "Describe the reason for the visit", required: true, validation: { minLength: 5, maxLength: 1000 } },
    { name: "symptomDuration", type: "select", label: "Symptom Duration", options: [option("Less than 24 hours", "lt_24h"), option("1–3 days", "1_3_days"), option("4–7 days", "4_7_days"), option("1–4 weeks", "1_4_weeks"), option("More than a month", "gt_1_month")] },
    { name: "painLevel", type: "select", label: "Pain Level", options: [option("No pain", "0"), option("Mild (1–3)", "1-3"), option("Moderate (4–6)", "4-6"), option("Severe (7–9)", "7-9"), option("Worst possible (10)", "10")] },
    { name: "existingConditions", type: "textarea", label: "Existing Conditions", placeholder: "Any relevant existing conditions?", validation: { maxLength: 1000 } },
    { name: "currentMedications", type: "textarea", label: "Current Medications", placeholder: "List medications if known", validation: { maxLength: 1000 } },
    { name: "hasAllergies", type: "checkbox", label: "Do you have any known allergies?" },
    { name: "allergies", type: "textarea", label: "Allergy Details", placeholder: "List allergies and reactions", validation: { maxLength: 1000 }, condition: { field: "hasAllergies", operator: "equals", value: true } },
    { name: "smoker", type: "select", label: "Smoking Status", options: [option("Never", "never"), option("Former smoker", "former"), option("Current smoker", "current")] },
  ],
};

export const personalLoanSchema = {
  id: "personal-loan",
  title: "Personal Loan Application",
  description: "Provide a high-level loan request. Do not enter account numbers or other highly sensitive credentials.",
  fields: [
    { name: "fullName", type: "text", label: "Full Name", placeholder: "Applicant full name", required: true, validation: { minLength: 2, maxLength: 100 } },
    { name: "loanPurpose", type: "select", label: "Loan Purpose", required: true, options: [option("Debt consolidation", "debt_consolidation"), option("Home improvement", "home_improvement"), option("Medical expenses", "medical"), option("Education", "education"), option("Vehicle", "vehicle"), option("Special event", "event"), option("Other", "other")] },
    { name: "loanAmount", type: "text", label: "Requested Amount (USD)", placeholder: "Example: 12000", validation: { pattern: "^$|^\\d+(\\.\\d{1,2})?$", maxLength: 15 } },
    { name: "employmentStatus", type: "select", label: "Employment Status", options: [option("Full-time", "full_time"), option("Part-time", "part_time"), option("Self-employed", "self_employed"), option("Unemployed", "unemployed"), option("Retired", "retired"), option("Student", "student")] },
    { name: "monthlyIncome", type: "text", label: "Monthly Income (USD)", placeholder: "Example: 4500", validation: { pattern: "^$|^\\d+(\\.\\d{1,2})?$", maxLength: 15 } },
    { name: "employerName", type: "text", label: "Employer Name", placeholder: "Employer or organization", validation: { maxLength: 100 } },
  ],
};

export const legalIntakeSchema = {
  id: "legal-intake",
  title: "Legal Client Intake",
  description: "Summarize the legal matter at a high level. Avoid sharing confidential information until an appropriate professional relationship exists.",
  fields: [
    { name: "fullName", type: "text", label: "Full Name", placeholder: "Your full name", required: true, validation: { minLength: 2, maxLength: 100 } },
    { name: "matterType", type: "select", label: "Matter Type", required: true, options: [option("Personal injury", "personal_injury"), option("Family", "family"), option("Employment", "employment"), option("Contract", "contract"), option("Criminal", "criminal"), option("Estate", "estate"), option("Business", "business"), option("Other", "other")] },
    { name: "caseSummary", type: "textarea", label: "Matter Summary", placeholder: "Summarize the key facts", required: true, validation: { minLength: 10, maxLength: 2000 } },
    { name: "incidentDate", type: "text", label: "Relevant Date", placeholder: "YYYY-MM-DD", validation: { maxLength: 10, pattern: "^$|^\\d{4}-\\d{2}-\\d{2}$" } },
    { name: "opposingParty", type: "text", label: "Other Party", placeholder: "Name of other party, if applicable", validation: { maxLength: 150 } },
    { name: "urgency", type: "select", label: "Urgency", options: [option("Low", "low"), option("Medium", "medium"), option("High", "high")] },
    { name: "hasLawyer", type: "checkbox", label: "Are you currently represented by a lawyer?" },
  ],
};

export const jobApplicationSchema = {
  id: "job-application",
  title: "Job Application Intake",
  description: "Capture a concise candidate profile and preferred role. Verify extracted details before submitting.",
  fields: [
    { name: "fullName", type: "text", label: "Full Name", placeholder: "Your full name", required: true, validation: { minLength: 2, maxLength: 100 } },
    { name: "email", type: "email", label: "Email Address", placeholder: "you@example.com", required: true, validation: { maxLength: 150 } },
    { name: "yearsExperience", type: "text", label: "Years of Experience", placeholder: "Example: 3", validation: { pattern: "^$|^\\d{1,2}(\\.\\d{1,2})?$", maxLength: 5 } },
    { name: "currentRole", type: "text", label: "Current Role", placeholder: "Current title or student status", validation: { maxLength: 150 } },
    { name: "desiredRole", type: "text", label: "Desired Role", placeholder: "Role you are applying for", required: true, validation: { minLength: 2, maxLength: 150 } },
    { name: "availability", type: "select", label: "Availability", options: [option("Immediately", "immediate"), option("Two weeks", "2_weeks"), option("One month", "1_month"), option("More than one month", "gt_1_month")] },
    { name: "workAuthorization", type: "checkbox", label: "Authorized to work in the target location?" },
  ],
};

export const formSchemas = [
  { id: insuranceClaimSchema.id, name: "Insurance Claim", description: "Incident reporting and vehicle damage", schema: insuranceClaimSchema },
  { id: patientIntakeSchema.id, name: "Patient Intake", description: "Visit reason and relevant health details", schema: patientIntakeSchema },
  { id: personalLoanSchema.id, name: "Personal Loan", description: "Purpose, employment, and request summary", schema: personalLoanSchema },
  { id: legalIntakeSchema.id, name: "Legal Intake", description: "High-level matter summary and urgency", schema: legalIntakeSchema },
  { id: jobApplicationSchema.id, name: "Job Application", description: "Candidate profile and role preferences", schema: jobApplicationSchema },
];

export const getFormSchema = (schemaId) => formSchemas.find((item) => item.id === schemaId)?.schema || insuranceClaimSchema;
