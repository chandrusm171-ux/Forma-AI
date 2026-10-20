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

function FormPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSchemaId = searchParams.get("schema");
  const selectedSchemaId = formSchemas.some((item) => item.id === requestedSchemaId)
    ? requestedSchemaId
    : insuranceClaimSchema.id;
  const [prefillData, setPrefillData] = useState({});
  const [isExtracting, setIsExtracting] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: "info", message: "" });
  const selectedForm = formSchemas.find((item) => item.id === selectedSchemaId) || formSchemas[0];

  const schema = selectedForm.schema;

  const showToast = (type, message) => setToast({ visible: true, type, message });
  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }));

  const handleSchemaChange = (event) => {
    setSearchParams({ schema: event.target.value });
    setPrefillData({});
    showToast("info", "Form type changed. Start a new description for this form.");
  };

  const handleAnalyze = async (story) => {
    setIsExtracting(true);
    try {
      const extractedData = await extractFormData(story, selectedSchemaId);
      setPrefillData(extractedData);
      showToast("success", "AI suggestions are ready. Review every field before submitting.");
    } catch (error) {
      showToast("error", error?.message || "Failed to extract data. Please try again.");
      throw error;
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <PageLayout maxWidth="1120px">
      <section className="form-page modern-form-page" aria-labelledby="form-page-title">
        <div className="form-page-header reveal-up">
          <span className="home-eyebrow"><span className="eyebrow-sparkle">✦</span> SMART WORKFLOWS · AI-ASSISTED</span>
          <h1 id="form-page-title">From your words to <span className="gradient-text">work-ready data.</span></h1>
          <p>Choose a workflow, describe the details naturally, and let Forma AI prepare a structured draft for your review.</p>
        </div>

        <div className="schema-picker-card reveal-up">
          <div className="schema-picker-copy">
            <span className="schema-picker-icon" aria-hidden="true">✦</span>
            <div>
              <label htmlFor="schema-picker">Choose a workflow</label>
              <p>Select the form that best matches your task.</p>
            </div>
          </div>
          <select id="schema-picker" className="schema-picker-select" value={selectedSchemaId} onChange={handleSchemaChange}>
            {formSchemas.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <span className="schema-picker-count">{schema.fields.length} fields</span>
        </div>

        <div className="form-page-layout">
          <MagicInput
            key={selectedSchemaId}
            title={`Describe your ${selectedForm.name.toLowerCase()}`}
            description={`Write naturally. AI will suggest values for ${selectedForm.name.toLowerCase()} fields, and you remain in control of the final submission.`}
            placeholder={`Start with the important details for ${selectedForm.name.toLowerCase()}…`}
            onAnalyze={handleAnalyze}
          />

          <div className="form-section-wrapper">
            {isExtracting && <Loading overlay size="lg" text="Preparing your structured draft…" />}
            <DynamicForm
              key={selectedSchemaId}
              schema={schema}
              initialValues={prefillData}
              onReset={() => setPrefillData({})}
            />
          </div>
        </div>

        <p className="form-privacy-note"><span aria-hidden="true">◈</span> AI-generated values are suggestions, not verified facts. Review all fields before submitting.</p>
      </section>
      <Toast type={toast.type} message={toast.message} visible={toast.visible} onClose={hideToast} duration={5000} />
    </PageLayout>
  );
}

export default FormPage;
