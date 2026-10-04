import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";
import ConditionalField from "./ConditionalField";
import Button from "../ui/Button";

function DynamicForm({ schema, initialValues = {} }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    shouldUnregister: true,
  });

  const values = useWatch({ control });

  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-header">
        <h2>{schema.title}</h2>

        {schema.description && <p>{schema.description}</p>}
      </div>

      {schema.fields.map((field) => (
        <ConditionalField key={field.name} field={field} values={values}>
          <div>
            <FieldRenderer
              field={field}
              register={register}
              error={errors[field.name]}
            />

            {field.type !== "text" && errors[field.name] && (
              <p className="error-message">{errors[field.name].message}</p>
            )}
          </div>
        </ConditionalField>
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
