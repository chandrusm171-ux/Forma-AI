import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DynamicForm,
  MagicInput,
  PageLayout,
  Loading,
  Toast,
} from "../components";
import { formSchemas, insuranceClaimSchema } from "../schemas/formSchema";
import { extractFormData } from "../services";

// Clean Vector Icons (No Emojis for professional enterprise look)
const IconCar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconMedical = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const IconActivity = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <circle cx="12" cy="12" r="10" />
    <path d="m10 15 5-3-5-3v6Z" />
  </svg>
);

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconCreditCard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const IconScale = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="M7 21h10" />
    <path d="M12 3v18" />
  </svg>
);

const IconFileText = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconCode = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconSparkles = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const samplePromptsBySchema = {
  "insurance-claim": [
    {
      label: "Deer Collision",
      icon: <IconAlert />,
      text: "I was driving my Honda City yesterday evening on Route 9 when a deer suddenly jumped out. The front bumper and left headlight were heavily damaged, and the windshield cracked. Alex Morgan, incident on 2026-03-12.",
    },
    {
      label: "Parking Lot Hit & Run",
      icon: <IconCar />,
      text: "Yesterday afternoon in the downtown plaza parking lot, someone backed into my Toyota Corolla and fled without notice. The rear fender is dented and scratched. Alex Rivera, 2026-03-14.",
    },
  ],
  "patient-intake": [
    {
      label: "Severe Migraine",
      icon: <IconMedical />,
      text: "Patient Jane Doe. Experiencing severe throbbing migraine with acute light sensitivity for 3 days. Pain level is around 8 out of 10. No known drug allergies, non-smoker, currently taking paracetamol.",
    },
    {
      label: "Lower Back Pain",
      icon: <IconActivity />,
      text: "Marcus Vance. Moderate lower back ache and stiffness for 2 weeks following moving heavy furniture. Pain level 4. No allergies, former smoker.",
    },
  ],
  "personal-loan": [
    {
      label: "Home Renovation",
      icon: <IconHome />,
      text: "Applicant Sarah Jenkins. Requesting a personal loan of 18000 USD for kitchen and bathroom renovation. Employed full-time as Senior Software Architect with monthly income of 8200 USD at Apex Tech.",
    },
    {
      label: "Debt Consolidation",
      icon: <IconCreditCard />,
      text: "David Chen. Looking for 12000 USD personal loan for debt consolidation. Full-time Marketing Manager earning 5500 USD monthly at Horizon Media.",
    },
  ],
  "legal-intake": [
    {
      label: "Contract Dispute",
      icon: <IconScale />,
      text: "Client Elena Rostova. Contract dispute involving breach of freelance software agreement by NorthStar Corp dated 2026-02-10. Outstanding payment of 14,000 USD unpaid. Urgency is high. Not represented by an attorney.",
    },
    {
      label: "Property Line Issue",
      icon: <IconFileText />,
      text: "Robert Taylor. Neighbor erected an unauthorized concrete boundary fence violating residential parcel survey lines. Medium urgency.",
    },
  ],
  "job-application": [
    {
      label: "Senior React Engineer",
      icon: <IconCode />,
      text: "Applicant Priya Sharma, email priya.sharma@example.com. Applying for Senior React Developer role. 5 years experience in React, TypeScript, and modern state architecture. Available in two weeks, authorized to work.",
    },
    {
      label: "Product Designer",
      icon: <IconLayers />,
      text: "Candidate Leo Martinez, leo.martinez@example.com. Applying for Senior UI/UX Designer. 4 years of product design and design systems experience. Available immediately.",
    },
  ],
};

function FormPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSchemaId = searchParams.get("schema");
  const selectedSchemaId = formSchemas.some((item) => item.id === requestedSchemaId)
    ? requestedSchemaId
    : insuranceClaimSchema.id;
  const [prefillData, setPrefillData] = useState({});
  const [isExtracting, setIsExtracting] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: "info", message: "" });
  const selectedForm = formSchemas.find((item) => item.id === selectedSchemaId) || formSchemas[0];

  const schema = selectedForm.schema;

  const showToast = (type, message) => setToast({ visible: true, type, message });
  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }));

  const handleSchemaChange = (schemaId) => {
    setSearchParams({ schema: schemaId });
    setPrefillData({});
    showToast("info", "Workflow changed. Ready for a new description.");
  };

  const handleAnalyze = async (story) => {
    setIsExtracting(true);
    try {
      const extractedData = await extractFormData(story, selectedSchemaId);
      setPrefillData(extractedData);
      showToast("success", "AI suggestions populated! Review every field before submitting.");
    } catch (error) {
      showToast("error", error?.message || "Failed to extract data. Please try again.");
      throw error;
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCopyJson = () => {
    const payload = Object.keys(prefillData).length > 0 ? prefillData : schema;
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
    showToast("success", "JSON copied to clipboard!");
  };

  const hasExtractedData = Object.keys(prefillData).length > 0;

  return (
    <PageLayout maxWidth="1160px">
      <section className="form-page modern-form-page" aria-labelledby="form-page-title">
        {/* ── Page Header ── */}
        <div className="form-page-header reveal-up">
          <span className="home-eyebrow">
            <span className="sparkle-icon"><IconSparkles /></span> ADAPTIVE AI ENGINE · ENTERPRISE WORKFLOWS
          </span>
          <h1 id="form-page-title">From your words to <span className="gradient-text">work-ready data.</span></h1>
          <p>Choose a workflow, describe your details in plain language, and let Forma AI draft a validated, structured form for review.</p>
        </div>

        {/* ── Forma AI Glass Schema Selector Card ── */}
        <div className="schema-picker-card reveal-up">
          <div className="schema-picker-copy">
            <span className="schema-picker-icon" aria-hidden="true">
              <IconSparkles />
            </span>
            <div>
              <label htmlFor="schema-picker">Select Workflow</label>
              <p>{selectedForm.description}</p>
            </div>
          </div>

          <select
            id="schema-picker"
            className="schema-picker-select"
            value={selectedSchemaId}
            onChange={(e) => handleSchemaChange(e.target.value)}
            aria-label="Select form workflow"
          >
            {formSchemas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.schema.fields.length} fields)
              </option>
            ))}
          </select>

          <div className="schema-picker-actions">
            <button
              type="button"
              className="json-inspector-btn"
              onClick={() => setShowJsonModal(true)}
              title="Inspect Schema / Extracted JSON payload"
            >
              <span className="code-brackets">&lt;/&gt;</span>
              <span>{hasExtractedData ? "Inspect AI Data" : "Inspect Schema"}</span>
              {hasExtractedData && <span className="json-badge">{Object.keys(prefillData).length}</span>}
            </button>
            <span className="schema-picker-count">{schema.fields.length} fields</span>
          </div>
        </div>

        {/* ── Split Layout: Magic Input + Dynamic Form ── */}
        <div className="form-page-layout">
          <MagicInput
            key={selectedSchemaId}
            title={`Describe your ${selectedForm.name.toLowerCase()}`}
            description={`Write in everyday language. Forma AI identifies entities and populates ${selectedForm.name.toLowerCase()} fields. You retain 100% control to review and edit.`}
            placeholder={`Tell us what happened with ${selectedForm.name.toLowerCase()} details…`}
            samplePrompts={samplePromptsBySchema[selectedSchemaId] || []}
            onAnalyze={handleAnalyze}
          />

          <div className="form-section-wrapper">
            {isExtracting && <Loading overlay size="lg" text="Structuring details with AI…" />}
            <DynamicForm
              key={selectedSchemaId}
              schema={schema}
              initialValues={prefillData}
              onReset={() => setPrefillData({})}
            />
          </div>
        </div>

        <p className="form-privacy-note">
          <span className="privacy-shield-icon" aria-hidden="true"><IconShield /></span>
          AI-suggested fields are flagged with <span className="sample-inline-tag"><IconSparkles /> AI Extracted</span>. Review all values prior to final submission.
        </p>

        {/* ── Modal: JSON Schema / AI Payload Inspector ── */}
        {showJsonModal && (
          <div className="json-modal-backdrop" onClick={() => setShowJsonModal(false)}>
            <div className="json-modal-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
              <div className="json-modal-header">
                <div>
                  <h3 id="modal-title">
                    {hasExtractedData ? "AI Extracted Payload" : `${selectedForm.name} Schema Definition`}
                  </h3>
                  <p>
                    {hasExtractedData
                      ? "Structured JSON output generated from your natural language description."
                      : "Client-side JSON schema driving validation and dynamic field rendering."}
                  </p>
                </div>
                <button
                  type="button"
                  className="json-modal-close"
                  onClick={() => setShowJsonModal(false)}
                  aria-label="Close dialog"
                >
                  <IconClose />
                </button>
              </div>
              <div className="json-modal-body">
                <pre tabIndex={0}>
                  <code>{JSON.stringify(hasExtractedData ? prefillData : schema, null, 2)}</code>
                </pre>
              </div>
              <div className="json-modal-footer">
                <button
                  type="button"
                  className="ui-btn ui-btn-primary ui-btn-sm"
                  onClick={handleCopyJson}
                >
                  {copiedJson ? (
                    <>
                      <IconCheck /> Copied!
                    </>
                  ) : (
                    "Copy JSON"
                  )}
                </button>
                <button
                  type="button"
                  className="ui-btn ui-btn-ghost ui-btn-sm"
                  onClick={() => setShowJsonModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
      <Toast type={toast.type} message={toast.message} visible={toast.visible} onClose={hideToast} duration={5000} />
    </PageLayout>
  );
}

export default FormPage;
