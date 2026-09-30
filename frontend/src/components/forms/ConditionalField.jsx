function ConditionalField({ field, values, children }) {
  const condition = field.condition;

  // If there is no condition, always show the field
  if (!condition) {
    return children;
  }

  const currentValue = values[condition.field];

  switch (condition.operator) {
    case "equals":
      return currentValue === condition.value ? children : null;

    case "notEquals":
      return currentValue !== condition.value ? children : null;

    case "contains":
      return Array.isArray(currentValue) &&
        currentValue.includes(condition.value)
        ? children
        : null;

    case "exists":
      return currentValue !== undefined &&
        currentValue !== null &&
        currentValue !== ""
        ? children
        : null;

    default:
      return null;
  }
}

export default ConditionalField;