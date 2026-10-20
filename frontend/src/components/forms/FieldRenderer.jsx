import TextField from "./TextField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";
import TextareaField from "./TextareaField";

function FieldRenderer({ field, register, error, isAiPrefilled }) {
  switch (field.type) {
    case "text":
    case "email":
    case "number":
      return <TextField field={field} register={register} error={error} isAiPrefilled={isAiPrefilled} />;
    case "select":
      return <SelectField field={field} register={register} error={error} isAiPrefilled={isAiPrefilled} />;
    case "textarea":
      return <TextareaField field={field} register={register} error={error} isAiPrefilled={isAiPrefilled} />;
    case "checkbox":
      return <CheckboxField field={field} register={register} error={error} isAiPrefilled={isAiPrefilled} />;
    default:
      return (
        <p role="alert">
          Unsupported field type: <strong>{field.type}</strong>
        </p>
      );
  }
}

export default FieldRenderer;
