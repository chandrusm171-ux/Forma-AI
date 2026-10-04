import { useState } from "react";
import DynamicForm from "../components/forms/DynamicForm";
import MagicInput from "../components/ai/MagicInput";
import PageLayout from "../components/layout/PageLayout";
import { insuranceClaimSchema } from "../schemas/formSchema";
import { extractFormData } from "../services/aiService";

function FormPage() {
  const [prefillData, setPrefillData] = useState({});

  const handleAnalyze = async (story) => {
    console.log("AI input:", story);

    const extractedData = await extractFormData(story);

    console.log("Extracted data:", extractedData);

    setPrefillData(extractedData);
  };

  return (
    <PageLayout>
      <div className="form-page-layout">
        <MagicInput onAnalyze={handleAnalyze} />

        <DynamicForm
          schema={insuranceClaimSchema}
          initialValues={prefillData}
        />
      </div>
    </PageLayout>
  );
}

export default FormPage;
