import { useForm } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";

function DynamicForm({ schema }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-header">
        <h1>{schema.title}</h1>

        {schema.description && (
          <p>{schema.description}</p>
        )}
      </div>

      {schema.fields.map((field) => (
        <div key={field.name}>
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
      ))}

      <button type="submit">
        Submit
      </button>
    </form>
  );
}

export default DynamicForm;