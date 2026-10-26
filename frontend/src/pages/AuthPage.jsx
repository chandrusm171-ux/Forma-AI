import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { loginAccount, registerAccount } from "../services/authService";

function AuthPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState(params.get("mode") === "register" ? "register" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "register") await registerAccount({ name, email, password });
      else await loginAccount({ email, password });
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Authentication failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-orb auth-orb-one" aria-hidden="true" />
      <div className="auth-orb auth-orb-two" aria-hidden="true" />
      <section className="auth-card" aria-labelledby="auth-title">
        <Link to="/" className="auth-brand"><span className="brand-badge">AI</span><span>Forma AI</span></Link>
        <div className="auth-eyebrow">YOUR WORKSPACE, SECURED</div>
        <h1 id="auth-title">{mode === "register" ? "Create your account" : "Welcome back"}</h1>
        <p className="auth-subtitle">{mode === "register" ? "Create an account to manage forms and access your saved submissions." : "Sign in to manage your Forma AI workspace."}</p>

        <div className="auth-mode-switch" role="tablist" aria-label="Account action">
          <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(""); }}>Sign in</button>
          <button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setError(""); }}>Create account</button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === "register" && (
            <label>Full name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={80} required placeholder="Your name" /></label>
          )}
          <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} required placeholder="you@example.com" /></label>
          <label>Password<input type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={mode === "register" ? 10 : 1} maxLength={128} required placeholder={mode === "register" ? "At least 10 characters" : "Enter your password"} /></label>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button className="auth-submit" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}<span aria-hidden="true">↗</span></button>
        </form>
        <p className="auth-footnote">Use a strong, unique password. Public sign-up creates a standard user account; it cannot grant admin privileges.</p>
      </section>
    </main>
  );
}

export default AuthPage;
