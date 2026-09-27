import DynamicForm from "../components/forms/DynamicForm";
import { insuranceClaimSchema } from "../schemas/formSchema";

function FormPage() {
  return (
    <main>
      <DynamicForm schema={insuranceClaimSchema} />
    </main>
  );
}

export default FormPage;