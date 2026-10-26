import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { formService } from "../services";
import { getAuthToken } from "../services/authService";

const PAGE_SIZE = 10;

function formatDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function readableValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? value.map(String).join(", ") : "—";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function SubmissionHistory() {
  const isSignedIn = Boolean(getAuthToken());
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState("");
  const [detailById, setDetailById] = useState({});
  const [loadingDetailId, setLoadingDetailId] = useState("");

  const loadSubmissions = useCallback(async (page = 1, searchTerm = search) => {
    setLoading(true);
    setError("");
    try {
      const result = await formService.listSubmissions({ page, limit: PAGE_SIZE, search: searchTerm });
      setSubmissions(Array.isArray(result?.data) ? result.data : []);
      setPagination(result?.pagination || { page, limit: PAGE_SIZE, total: 0, totalPages: 1 });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
        (requestError?.response?.status === 503
          ? "The database is not available right now. Check the backend and MongoDB connection."
          : requestError?.response?.status === 401
            ? "Your session has expired. Please sign in again."
            : "We couldn't load your saved submissions. Please try again.")
      );
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (isSignedIn) loadSubmissions(1, search);
    else setLoading(false);
  }, [isSignedIn, loadSubmissions, search]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const toggleDetails = async (submission) => {
    if (expandedId === submission.id) {
      setExpandedId("");
      return;
    }
    setExpandedId(submission.id);
    if (detailById[submission.id]) return;

    setLoadingDetailId(submission.id);
    try {
      const detail = await formService.getSubmission(submission.id);
      setDetailById((current) => ({ ...current, [submission.id]: detail }));
    } catch (requestError) {
      setDetailById((current) => ({
        ...current,
        [submission.id]: {
          _loadError: requestError?.response?.data?.message || "Could not load submission details.",
        },
      }));
    } finally {
      setLoadingDetailId("");
    }
  };

  if (!isSignedIn) {
    return (
      <PageLayout maxWidth="960px">
        <section className="submission-page">
          <div className="submission-hero">
            <span className="submission-eyebrow">YOUR WORKSPACE</span>
            <h1>My submissions</h1>
            <p>Sign in to see the forms you've submitted and review their saved answers.</p>
          </div>
          <div className="submission-empty-state">
            <div className="submission-empty-icon" aria-hidden="true">↗</div>
            <h2>Your submissions, in one place</h2>
            <p>Sign in with the account you used when submitting forms. Anonymous submissions are not linked to an account.</p>
            <Link className="submission-primary-link" to="/auth">Sign in to continue <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="1080px">
      <section className="submission-page" aria-labelledby="submission-page-title">
        <div className="submission-hero">
          <span className="submission-eyebrow">YOUR WORKSPACE</span>
          <h1 id="submission-page-title">My submissions<span>.</span></h1>
          <p>Review saved responses, revisit details, and keep track of your submitted workflows.</p>
          <div className="submission-stat-row">
            <div className="submission-stat">
              <strong>{pagination.total}</strong>
              <span>{pagination.total === 1 ? "Saved submission" : "Saved submissions"}</span>
            </div>
            <div className="submission-stat-divider" />
            <div className="submission-stat">
              <strong>{pagination.page}/{pagination.totalPages}</strong>
              <span>Current page</span>
            </div>
          </div>
        </div>

        <div className="submission-toolbar">
          <form className="submission-search" onSubmit={handleSearch}>
            <span aria-hidden="true">⌕</span>
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by workflow name…"
              aria-label="Search submissions by workflow name"
              maxLength={100}
            />
            {searchInput && <button type="button" onClick={() => { setSearchInput(""); setSearch(""); }} aria-label="Clear search">×</button>}
            <button className="submission-search-submit" type="submit">Search</button>
          </form>
          <button className="submission-refresh" type="button" onClick={() => loadSubmissions(pagination.page, search)} disabled={loading}>
            {loading ? "Refreshing…" : "↻ Refresh"}
          </button>
        </div>

        {error && (
          <div className="submission-alert" role="alert">
            <span>{error}</span>
            {error.toLowerCase().includes("sign in") && <Link to="/auth">Sign in again</Link>}
            <button type="button" onClick={() => loadSubmissions(pagination.page, search)}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="submission-loading" role="status"><span className="submission-spinner" />Loading your saved submissions…</div>
        ) : submissions.length === 0 ? (
          <div className="submission-empty-state">
            <div className="submission-empty-icon" aria-hidden="true">▤</div>
            <h2>{search ? "No matching submissions" : "No saved submissions yet"}</h2>
            <p>{search ? "Try a different workflow name or clear your search." : "When you submit a form while signed in, it will appear here. Submissions made while signed out cannot be attached to your account automatically."}</p>
            {search ? (
              <button className="submission-primary-link" type="button" onClick={() => { setSearchInput(""); setSearch(""); }}>Clear search</button>
            ) : (
              <Link className="submission-primary-link" to="/form">Start a form <span aria-hidden="true">→</span></Link>
            )}
          </div>
        ) : (
          <>
            <div className="submission-list-heading">
              <div>
                <h2>Saved responses</h2>
                <p>Newest submissions appear first.</p>
              </div>
              <span>{pagination.total} total</span>
            </div>
            <div className="submission-list">
              {submissions.map((submission) => {
                const detail = detailById[submission.id];
                const values = detail?.data && typeof detail.data === "object" ? detail.data : {};
                return (
                  <article className={`submission-card${expandedId === submission.id ? " is-expanded" : ""}`} key={submission.id}>
                    <div className="submission-card-main">
                      <div className="submission-card-icon" aria-hidden="true">▤</div>
                      <div className="submission-card-copy">
                        <h3>{submission.formTitle || "Untitled workflow"}</h3>
                        <p>{submission.formId}</p>
                        <span className="submission-date">Submitted {formatDate(submission.createdAt)}</span>
                      </div>
                      <button
                        className="submission-details-button"
                        type="button"
                        onClick={() => toggleDetails(submission)}
                        aria-expanded={expandedId === submission.id}
                      >
                        {expandedId === submission.id ? "Hide details" : "View details"}
                        <span aria-hidden="true">{expandedId === submission.id ? "−" : "＋"}</span>
                      </button>
                    </div>
                    {expandedId === submission.id && (
                      <div className="submission-detail-panel">
                        {loadingDetailId === submission.id ? (
                          <div className="submission-loading compact"><span className="submission-spinner" />Loading response details…</div>
                        ) : detail?._loadError ? (
                          <div className="submission-alert" role="alert">{detail._loadError}</div>
                        ) : (
                          <>
                            <div className="submission-detail-meta">
                              <span>Reference ID</span>
                              <code>{submission.id}</code>
                            </div>
                            <div className="submission-values-grid">
                              {Object.entries(values).length ? Object.entries(values).map(([key, value]) => (
                                <div className="submission-value" key={key}>
                                  <span>{key.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").replace(/^./, (letter) => letter.toUpperCase())}</span>
                                  <strong>{readableValue(value)}</strong>
                                </div>
                              )) : <p className="submission-no-values">This submission contains no displayable fields.</p>}
                            </div>
                            <p className="submission-detail-note">These are the values saved when the form was submitted.</p>
                          </>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <div className="submission-pagination">
              <span>Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</span>
              <div>
                <button type="button" disabled={loading || pagination.page <= 1} onClick={() => loadSubmissions(pagination.page - 1, search)}>Previous</button>
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <button type="button" disabled={loading || pagination.page >= pagination.totalPages} onClick={() => loadSubmissions(pagination.page + 1, search)}>Next</button>
              </div>
            </div>
          </>
        )}
      </section>
    </PageLayout>
  );
}

export default SubmissionHistory;
