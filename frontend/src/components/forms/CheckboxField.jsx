function CheckboxField({ field, register }) {
  return (
    <div className="form-field checkbox-field">
      <label>
        <input
          type="checkbox"
          {...register(field.name)}
        />

        <span>{field.label}</span>
      </label>
    </div>
  );
}

export default CheckboxField;