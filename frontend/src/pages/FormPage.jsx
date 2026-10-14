import { useState } from "react";
import {
  DynamicForm,
  MagicInput,
  PageLayout,
  Loading,
  Toast,
} from "../components";
import { insuranceClaimSchema } from "../schemas/formSchema";
import { extractFormData } from "../services";

/**
 * FormPage – Main dynamic form page with AI-assisted prefill.
 *
 * Loading states:
 * - While AI extraction is in progress, a blurred overlay with a spinner
 *   is displayed over the form section so users know the form is being populated.
 * - A Toast notification confirms success or reports errors after extraction.
 */
function FormPage() {
  const [prefillData, setPrefillData] = useState({});
  const [isExtracting, setIsExtracting] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: "info", message: "" });

  const showToast = (type, message) => {
    setToast({ visible: true, type, message });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const handleAnalyze = async (story) => {
    console.log("AI input:", story);

    setIsExtracting(true);

    try {
      const extractedData = await extractFormData(story);
      console.log("Extracted data:", extractedData);
      setPrefillData(extractedData);
      showToast("success", "Form fields have been populated with extracted data.");
    } catch (error) {
      console.error("Extraction failed:", error);
      showToast("error", error?.message || "Failed to extract data. Please try again.");
      throw error; // re-throw so MagicInput can also show its own status
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <PageLayout maxWidth="960px">
      <section className="form-page" aria-labelledby="form-page-title">
        <div className="form-page-header">
          <span className="home-eyebrow">DYNAMIC FORM ENGINE</span>
          <h1 id="form-page-title">Insurance Claim Form</h1>
          <p>
            Describe your incident in natural language to let AI prefill the
            details, or fill out and verify the structured form below.
          </p>
        </div>

        <div className="form-page-layout">
          <MagicInput onAnalyze={handleAnalyze} />

          {/* ── Form section with loading overlay ── */}
          <div className="form-section-wrapper">
            {isExtracting && (
              <Loading
                overlay
                size="lg"
                text="Extracting form data from your description…"
              />
            )}

            <DynamicForm
              schema={insuranceClaimSchema}
              initialValues={prefillData}
            />
          </div>
        </div>
      </section>

      {/* ── Global toast feedback ── */}
      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onClose={hideToast}
        duration={5000}
      />
    </PageLayout>
  );
}

export default FormPage;
