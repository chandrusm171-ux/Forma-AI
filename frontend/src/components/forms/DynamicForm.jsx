import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";
import ConditionalField from "./ConditionalField";

function DynamicForm({ schema, initialValues = {} }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
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
        <h1>{schema.title}</h1>

        {schema.description && <p>{schema.description}</p>}
      </div>

      {schema.fields.map((field) => (
        <ConditionalField
          key={field.name}
          field={field}
          values={values}
        >
          <div>
            <FieldRenderer
              field={field}
              register={register}
            />

            {errors[field.name] && (
              <p className="error-message">
                {errors[field.name].message}
              </p>
            )}
          </div>
        </ConditionalField>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
}

export default DynamicForm;