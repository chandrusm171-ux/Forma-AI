import Input from "../ui/Input";
import { buildValidationRules } from "./validation";

function TextField({ field, register, error }) {
  const rules = buildValidationRules(field);

  return (
    <Input
      id={field.name}
      label={field.label}
      type={field.type === "email" ? "email" : "text"}
      placeholder={field.placeholder || ""}
      required={field.required}
      error={error}
      {...register(field.name, rules)}
    />
  );
}

export default TextField;
