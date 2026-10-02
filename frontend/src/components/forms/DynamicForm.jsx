import { useForm } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";
import Button from "../ui/Button";

function DynamicForm({ schema }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-header">
        <h2>{schema.title}</h2>

        {schema.description && (
          <p>{schema.description}</p>
        )}
      </div>

      {schema.fields.map((field) => (
        <div key={field.name}>
          <FieldRenderer
            field={field}
            register={register}
            error={errors[field.name]}
          />

          {field.type !== "text" && errors[field.name] && (
            <p className="error-message">
              {errors[field.name].message}
            </p>
          )}
        </div>
      ))}

      <div style={{ marginTop: "24px" }}>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
        >
          Submit Claim
        </Button>
      </div>
    </form>
  );
}

export default DynamicForm;