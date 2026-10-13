function SelectField({ field, register }) {
  return (
    <div className="form-field">
      <label htmlFor={field.name}>
        {field.label}
        {field.required && (
          <span style={{ color: "var(--color-danger)", marginLeft: "2px" }}
                aria-hidden="true"> *</span>
        )}
      </label>

      <select
        id={field.name}
        {...register(field.name, {
          required: field.required
            ? `${field.label} is required`
            : false,
        })}
      >
        <option value="">— Select an option —</option>

        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;