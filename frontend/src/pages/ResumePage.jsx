import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Loading,
  Toast,
  ProgressBar,
  PageLayout,
  ErrorState,
} from "../components";
import { parseResume } from "../services/aiService";

/**
 * ResumePage – Resume parsing interface with loading states.
 *
 * Day 12 enhancements:
 * - Added inline ErrorState with retry functionality when backend parsing endpoint is unavailable or fails.
 * - Added Clear File action for resetting selection.
 * - Improved responsive interaction and error persistence.
 */
const sampleResumes = [
  {
    fileName: "priya_sharma_senior_engineer.pdf",
    data: {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      role: "Lead Frontend Engineer",
      experience: "5+ Years",
      education: "B.Tech Computer Science, 2021",
      skills: ["React 19", "TypeScript", "Next.js", "Zustand", "Tailwind CSS", "Node.js", "Jest"],
      summary: "Specialized in scalable component architecture, performance optimization, and dynamic form engines.",
    },
  },
  {
    fileName: "marcus_vance_product_manager.pdf",
    data: {
      name: "Marcus Vance",
      email: "m.vance@example.com",
      role: "Senior Technical Product Manager",
      experience: "6 Years",
      education: "M.S. Information Systems, 2020",
      skills: ["AI Workflows", "Product Discovery", "System Design", "Agile/Scrum", "Data Analytics", "Roadmapping"],
      summary: "Experienced PM leading cross-functional teams building enterprise AI and workflow automation tools.",
    },
  },
];

function ResumePage() {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: "info", message: "" });

  const showToast = (type, message) => {
    setToast({ visible: true, type, message });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      setFile(selectedFile);
      setParsedData(null);
      setErrorMessage("");
      showToast("info", `File "${selectedFile.name}" selected.`);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFileName(droppedFile.name);
      setFile(droppedFile);
      setParsedData(null);
      setErrorMessage("");
      showToast("info", `Loaded "${droppedFile.name}" via drag and drop.`);
    }
  };

  const handleLoadSample = (sample) => {
    setFileName(sample.fileName);
    setFile({ name: sample.fileName, size: 245000 });
    setParsedData(sample.data);
    setErrorMessage("");
    showToast("success", `Loaded sample "${sample.fileName}"!`);
  };

  const handleClearFile = () => {
    setFileName("");
    setFile(null);
    setParsedData(null);
    setErrorMessage("");
    const fileInput = document.getElementById("resume-file");
    if (fileInput) fileInput.value = "";
  };

  const handleParse = async () => {
    if (!file) return;

    setIsParsing(true);
    setParsedData(null);
    setErrorMessage("");

    try {
      const result = await parseResume(file);
      setParsedData(result);
      showToast("success", `Resume "${file.name}" parsed successfully.`);
    } catch (error) {
      console.error("Resume parsing failed:", error);
      const msg = error?.message || "Failed to parse resume. Please try again.";
      setErrorMessage(msg);
      showToast("error", msg);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <PageLayout maxWidth="960px">
      <section className="resume-page" aria-labelledby="resume-title">
        <div className="resume-header">
          <span className="home-eyebrow">
            <span className="sparkle-dot">✦</span> DOCUMENT EXTRACTION · PHASE 5 ROADMAP
          </span>
          <h1 id="resume-title">Resume & Document Parser</h1>
          <p>
            Experience our planned document-to-schema extraction interface. Upload candidate resumes or explore interactive sample profiles below.
          </p>
        </div>

        {/* ── Status Banner ── */}
        <div className="resume-coming-soon" role="status">
          <span aria-hidden="true">✦</span>
          <div>
            <strong>Phase 5 Architecture Preview</strong>
            <p>
              Backend OCR & PDF text extraction endpoints are planned for Phase 5. The reactive upload container, validation states, and parsed schema visualizer below are fully interactive.
            </p>
          </div>
        </div>

        {/* ── Sample Resume Chips ── */}
        <div className="resume-samples-strip">
          <span className="samples-strip-label">Test with interactive sample resumes:</span>
          <div className="samples-strip-buttons">
            {sampleResumes.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                className="sample-resume-btn"
                onClick={() => handleLoadSample(sample)}
              >
                <span className="sample-btn-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </span>
                <span>{sample.data.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Upload Card ── */}
        <div className="resume-upload-card">
          {isParsing && (
            <Loading overlay size="lg" text="Parsing candidate document…" />
          )}

          <label
            className={`resume-upload-area ${isDragOver ? "is-drag-over" : ""} ${fileName ? "has-file" : ""}`}
            htmlFor="resume-file"
            aria-label="Resume upload area — drop your file here or click to browse"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <span className="resume-upload-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </span>
            <strong>{fileName || "Choose a resume or drop it here"}</strong>
            <span>
              {fileName
                ? "File attached. Ready for document parser."
                : "Supports PDF, DOC, DOCX up to 10MB."}
            </span>
            <div className="upload-badge-row">
              <span className="upload-pill">PDF</span>
              <span className="upload-pill">DOCX</span>
              <span className="upload-pill">Client-Safe</span>
            </div>
          </label>

          <input
            id="resume-file"
            className="resume-file-input"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={isParsing}
          />

          {isParsing && (
            <div className="resume-progress">
              <ProgressBar label="Extracting entities and work experience…" />
            </div>
          )}

          <div className="resume-actions">
            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={!file}
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
              {isParsing ? "Parsing…" : "Parse Document"}
            </Button>

            {Boolean(fileName) && !isParsing && (
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleClearFile}
              >
                Clear File
              </Button>
            )}

            <Link to="/form?schema=job-application" className="resume-back-link">
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
                Open Job Application Form
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Error state when parsing fails ── */}
        {Boolean(errorMessage) && !isParsing && (
          <ErrorState
            title="Resume Parsing Endpoint (Phase 5)"
            description={errorMessage}
            retryLabel="Retry Parsing"
            onRetry={handleParse}
          />
        )}

        {/* ── Parsed results card ── */}
        {parsedData && (
          <div className="resume-results-card" role="region" aria-label="Parsed resume results">
            <div className="resume-results-header">
              <div>
                <h2>Parsed Candidate Profile</h2>
                <p>Structured schema extracted from document content.</p>
              </div>
              <span className="resume-results-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Schema Verified
              </span>
            </div>

            <div className="resume-results-grid">
              <div className="resume-result-item">
                <span className="resume-result-label">Candidate Name</span>
                <span className="resume-result-value">{parsedData.name || "—"}</span>
              </div>
              <div className="resume-result-item">
                <span className="resume-result-label">Email Address</span>
                <span className="resume-result-value">{parsedData.email || "—"}</span>
              </div>
              <div className="resume-result-item">
                <span className="resume-result-label">Target Role</span>
                <span className="resume-result-value">{parsedData.role || "Software Engineer"}</span>
              </div>
              <div className="resume-result-item">
                <span className="resume-result-label">Total Experience</span>
                <span className="resume-result-value">{parsedData.experience || "—"}</span>
              </div>
              {parsedData.education && (
                <div className="resume-result-item">
                  <span className="resume-result-label">Education</span>
                  <span className="resume-result-value">{parsedData.education}</span>
                </div>
              )}
              {parsedData.summary && (
                <div className="resume-result-item resume-result-full">
                  <span className="resume-result-label">Professional Summary</span>
                  <span className="resume-result-value summary-text">{parsedData.summary}</span>
                </div>
              )}
              <div className="resume-result-item resume-result-skills resume-result-full">
                <span className="resume-result-label">Identified Skills</span>
                <div className="resume-skills-list">
                  {(parsedData.skills || []).map((skill) => (
                    <span key={skill} className="resume-skill-tag">
                      <span className="tag-dot">✦</span> {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="resume-results-footer">
              <Link to="/form?schema=job-application">
                <Button type="button" variant="primary" size="sm">
                  Prefill Job Application Form with this Profile →
                </Button>
              </Link>
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

