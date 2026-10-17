import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Loading,
  Toast,
  ProgressBar,
  PageLayout,
} from "../components";
import { parseResume } from "../services/aiService";

/**
 * ResumePage – Resume parsing interface with loading states.
 *
 * Day 6 enhancements:
 * - Parsing button shows a spinner via isLoading while the resume is being processed.
 * - An indeterminate progress bar appears during parsing for visual feedback.
 * - A Loading overlay covers the upload card while processing.
 * - Parsed results are displayed in a structured card.
 * - Toast notifications provide success/error feedback.
 */
function ResumePage() {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [toast, setToast] = useState({ visible: false, type: "info", message: "" });

  const showToast = (type, message) => {
    setToast({ visible: true, type, message });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    setFileName(selectedFile ? selectedFile.name : "");
    setFile(selectedFile || null);
    setParsedData(null); // clear previous results
  };

  const handleParse = async () => {
    if (!file) return;

    setIsParsing(true);
    setParsedData(null);

    try {
      const result = await parseResume(file);
      setParsedData(result);
      showToast("success", `Resume "${file.name}" parsed successfully.`);
    } catch (error) {
      console.error("Resume parsing failed:", error);
      showToast("error", error?.message || "Failed to parse resume. Please try again.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <PageLayout maxWidth="900px">
      <section className="resume-page" aria-labelledby="resume-title">
        <div className="resume-header">
          <span className="home-eyebrow">DOCUMENT EXTRACTION</span>
          <h1 id="resume-title">Resume Parser</h1>
          <p>
            Upload a resume to prepare it for structured extraction. The AI
            parsing service can be connected here when the backend extraction
            endpoint is available.
          </p>
        </div>

        <div className="resume-upload-card">
          {/* ── Loading overlay while parsing ── */}
          {isParsing && (
            <Loading
              overlay
              size="lg"
              text="Parsing your resume…"
            />
          )}

          <label className="resume-upload-area" htmlFor="resume-file">
            <span className="resume-upload-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </span>
            <strong>{fileName || "Choose a resume file"}</strong>
            <span>
              {fileName
                ? "File selected and ready for the next processing step."
                : "Select a PDF or document from your computer."}
            </span>
          </label>

          <input
            id="resume-file"
            className="resume-file-input"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={isParsing}
          />

          {/* ── Progress bar while parsing ── */}
          {isParsing && (
            <div className="resume-progress">
              <ProgressBar label="Processing document…" />
            </div>
          )}

          <div className="resume-actions">
            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={!fileName}
              isLoading={isParsing}
              onClick={handleParse}
              leftIcon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              }
            >
              {isParsing ? "Parsing…" : "Parse Resume"}
            </Button>
            <Link to="/form" className="resume-back-link">
              <Button
                type="button"
                variant="outline"
                size="md"
                rightIcon={
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                }
              >
                Open Dynamic Form
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Parsed results card ── */}
        {parsedData && (
          <div className="resume-results-card" role="region" aria-label="Parsed resume results">
            <div className="resume-results-header">
              <h2>Parsed Results</h2>
              <span className="resume-results-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Extracted
              </span>
            </div>
            <div className="resume-results-grid">
              <div className="resume-result-item">
                <span className="resume-result-label">Name</span>
                <span className="resume-result-value">{parsedData.name}</span>
              </div>
              <div className="resume-result-item">
                <span className="resume-result-label">Email</span>
                <span className="resume-result-value">{parsedData.email}</span>
              </div>
              <div className="resume-result-item">
                <span className="resume-result-label">Experience</span>
                <span className="resume-result-value">{parsedData.experience}</span>
              </div>
              <div className="resume-result-item resume-result-skills">
                <span className="resume-result-label">Skills</span>
                <div className="resume-skills-list">
                  {parsedData.skills.map((skill) => (
                    <span key={skill} className="resume-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Global toast feedback ── */}
      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onClose={hideToast}
        duration={5000}
      />
    </PageLayout>
  );
}

export default ResumePage;
