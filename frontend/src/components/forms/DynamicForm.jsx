import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";
import ConditionalField from "./ConditionalField";
import { Button } from "../ui";
import { formService } from "../../services";

/**
 * DynamicForm – Renders a form from a JSON schema.
 *
 * Day 6 enhancements:
 * - Submission shows a loading spinner on the submit button via isSubmitting.
 * - A success banner appears after submission for user feedback.
 * - All fields are disabled during submission to prevent double-submit.
 */
function DynamicForm({ schema, initialValues = {}, onReset }) {
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
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onSubmit = async (data) => {
    setSubmitStatus(null);
    setSubmitMessage("");

    try {
      const result = await formService.submitSubmission({
        formId: schema.id,
        formTitle: schema.title,
        data,
      });
      setSubmitStatus("success");
      setSubmitMessage(
        result?.id
          ? `Your response was saved. Reference ID: ${result.id}`
          : "Your response was saved successfully."
      );
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitStatus("error");
      setSubmitMessage(
        error.response?.data?.message || error.message ||
        "Submission failed. Please try again."
      );
    }
  };

  const handleReset = () => {
    reset({});
    setSubmitStatus(null);
    setSubmitMessage("");
    onReset?.();
  };

  const dismissStatus = () => {
    setSubmitStatus(null);
    setSubmitMessage("");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-header">
        <div className="form-header-title-row">
          <div>
            <h2>{schema.title}</h2>
            {schema.description && <p>{schema.description}</p>}
          </div>
          <div className="form-header-badge-group">
            <span className="form-completion-pill" title="Form completion status">
              <span className="completion-dot" />
              {schema.fields.filter((f) => {
                const val = values?.[f.name];
                return val !== undefined && val !== "" && val !== false;
              }).length}{" "}
              of {schema.fields.length} filled
            </span>
          </div>
        </div>
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
          <p>{submitMessage}</p>
          <button
            type="button"
            className="form-submit-status-dismiss"
            onClick={dismissStatus}
            aria-label="Dismiss message"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      <fieldset disabled={isSubmitting} className="form-fieldset">
        {schema.fields.map((field) => {
          const isPrefilled =
            initialValues &&
            initialValues[field.name] !== undefined &&
            initialValues[field.name] !== "";

          return (
            <ConditionalField key={field.name} field={field} values={values}>
              <div className="form-field-wrapper">
                <FieldRenderer
                  field={field}
                  register={register}
                  error={errors[field.name]}
                  isAiPrefilled={isPrefilled}
                />
              </div>
            </ConditionalField>
          );
        })}
      </fieldset>

      <div className="form-submit-actions">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          rightIcon={
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          }
        >
          {isSubmitting ? "Saving…" : "Submit Form"}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="md"
          disabled={isSubmitting}
          onClick={handleReset}
        >
          Reset Form
        </Button>
      </div>
    </form>
  );
}

export default DynamicForm;
