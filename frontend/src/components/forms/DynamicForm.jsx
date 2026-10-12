import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";
import ConditionalField from "./ConditionalField";
import Button from "../ui/Button";

/**
 * DynamicForm – Renders a form from a JSON schema.
 *
 * Day 6 enhancements:
 * - Submission shows a loading spinner on the submit button via isSubmitting.
 * - A success banner appears after submission for user feedback.
 * - All fields are disabled during submission to prevent double-submit.
 */
function DynamicForm({ schema, initialValues = {} }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    shouldUnregister: true,
  });

  const values = useWatch({ control });
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'

  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onSubmit = async (data) => {
    setSubmitStatus(null);
    try {
      // Simulate async form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", data);
      setSubmitStatus("success");
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitStatus("error");
    }
  };

  const dismissStatus = () => setSubmitStatus(null);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-header">
        <h2>{schema.title}</h2>

        {schema.description && <p>{schema.description}</p>}
      </div>

      {/* ── Submit feedback banner ── */}
      {submitStatus && (
        <div
          className={`form-submit-status form-submit-${submitStatus}`}
          role="alert"
        >
          <span className="form-submit-status-icon" aria-hidden="true">
            {submitStatus === "success" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </span>
          <p>
            {submitStatus === "success"
              ? "Claim submitted successfully!"
              : "Submission failed. Please try again."}
          </p>
          <button
            type="button"
            className="form-submit-status-dismiss"
            onClick={dismissStatus}
            aria-label="Dismiss message"
          >
            ✕
          </button>
        </div>
      )}

      <fieldset disabled={isSubmitting} className="form-fieldset">
        {schema.fields.map((field) => (
          <ConditionalField key={field.name} field={field} values={values}>
            <div>
              <FieldRenderer
                field={field}
                register={register}
                error={errors[field.name]}
              />

              {field.type !== "text" && errors[field.name] && (
                <p className="error-message">{errors[field.name].message}</p>
              )}
            </div>
          </ConditionalField>
        ))}
      </fieldset>

      <div style={{ marginTop: "24px" }}>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
        >
          {isSubmitting ? "Submitting…" : "Submit Claim"}
        </Button>
      </div>
    </form>
  );
}

export default DynamicForm;
