import Navbar from "./Navbar";
function PageLayout({ children, maxWidth = "900px" }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content" style={{ maxWidth }}>
        {children}
      </main>
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Forma AI Engine • Reusable Component Architecture</p>
      </footer>
    </div>
  );
}

export default PageLayout;
