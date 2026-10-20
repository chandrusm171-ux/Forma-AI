import Input from "../ui/Input";
import AiBadge from "../ui/AiBadge";
import { buildValidationRules } from "./validation";

function TextField({ field, register, error, isAiPrefilled }) {
  const rules = buildValidationRules(field);

  return (
    <Input
      id={field.name}
      label={field.label}
      type={field.type === "email" ? "email" : field.type === "number" ? "number" : "text"}
      placeholder={field.placeholder || ""}
      required={field.required}
      disabled={field.disabled}
      helperText={field.helperText || field.description}
      error={error}
      badge={isAiPrefilled ? <AiBadge /> : null}
      className={`form-field ${isAiPrefilled ? "is-ai-prefilled" : ""}`}
      {...register(field.name, rules)}
    />
  );
}

export default TextField;
