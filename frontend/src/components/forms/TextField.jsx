import Input from "../ui/Input";

function TextField({ field, register, error }) {
  return (
    <Input
      id={field.name}
      label={field.label}
      type="text"
      placeholder={field.placeholder || ""}
      required={field.required}
      error={error}
      {...register(field.name, {
        required: field.required
          ? `${field.label} is required`
          : false
      })}
    />
  );
}

export default TextField;