function TextareaField({ field, register }) {
  return (
    <div className="form-field">
      <label htmlFor={field.name}>
        {field.label}
        {field.required && <span> *</span>}
      </label>

      <textarea
        id={field.name}
        rows="5"
        placeholder={field.placeholder || ""}
        {...register(field.name, {
          required: field.required
            ? `${field.label} is required`
            : false
        })}
      />
    </div>
  );
}

export default TextareaField;