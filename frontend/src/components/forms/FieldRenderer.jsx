import TextField from "./TextField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";
import TextareaField from "./TextareaField";

function FieldRenderer({ field, register, error }) {
  switch (field.type) {
    case "text":
    case "email":
    case "number":
      return <TextField field={field} register={register} error={error} />;
    case "select":
      return <SelectField field={field} register={register} error={error} />;
    case "textarea":
      return <TextareaField field={field} register={register} error={error} />;
    case "checkbox":
      return <CheckboxField field={field} register={register} error={error} />;
    default:
      return (
        <p role="alert">
          Unsupported field type: <strong>{field.type}</strong>
        </p>
      );
  }
}

export default FieldRenderer;
