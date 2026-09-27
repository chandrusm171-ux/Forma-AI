import TextField from "./TextField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";
import TextareaField from "./TextareaField";

function FieldRenderer({ field, register }) {
  switch (field.type) {
    case "text":
      return <TextField field={field} register={register} />;

    case "select":
      return <SelectField field={field} register={register} />;

    case "textarea":
      return <TextareaField field={field} register={register} />;

    case "checkbox":
      return <CheckboxField field={field} register={register} />;

    default:
      return (
        <p>
          Unsupported field type: <strong>{field.type}</strong>
        </p>
      );
  }
}

export default FieldRenderer;