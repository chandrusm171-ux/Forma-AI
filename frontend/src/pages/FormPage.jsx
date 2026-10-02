import DynamicForm from "../components/forms/DynamicForm";
import PageLayout from "../components/layout/PageLayout";
import { insuranceClaimSchema } from "../schemas/formSchema";

function FormPage() {
  return (
    <PageLayout>
      <DynamicForm schema={insuranceClaimSchema} />
    </PageLayout>
  );
}

export default FormPage;