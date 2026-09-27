function TextField({ field, register }) {
  return (
    <div className="form-field">
      <label htmlFor={field.name}>
        {field.label}
        {field.required && <span> *</span>}
      </label>

      <input
        id={field.name}
        type="text"
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

export default TextField;