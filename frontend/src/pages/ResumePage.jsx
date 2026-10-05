import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import PageLayout from "../components/layout/PageLayout";

function ResumePage() {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : "");
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
          <label className="resume-upload-area" htmlFor="resume-file">
            <span className="resume-upload-icon" aria-hidden="true">
              ↑
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
          />

          <div className="resume-actions">
            <Button type="button" variant="primary" size="md" disabled={!fileName}>
              Parse Resume
            </Button>
            <Link to="/form" className="resume-back-link">
              Open Dynamic Form
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default ResumePage;
