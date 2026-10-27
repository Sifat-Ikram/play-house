export default function StaticPage({ eyebrow, title, updated, children }) {
  return (
    <main className="min-h-screen bg-[var(--ph-bg)]">
      <section style={{ backgroundColor: "#FCD98C" }}>
        <div className="ph-container py-8 sm:py-10">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.16em] sm:text-xs"
            style={{
              color: "var(--ph-primary-dark)",
              fontFamily: "var(--font-body)",
            }}
          >
            {eyebrow}
          </p>
          <h1
            className="text-2xl font-semibold text-[#1E2B2B] sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h1>
          {updated && (
            <p
              className="mt-1 text-xs text-[#1E2B2B]/60"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Last updated: {updated}
            </p>
          )}
        </div>
      </section>
      <div className="mx-auto w-11/12 max-w-3xl py-8 sm:py-12">
        <div
          className="space-y-6 rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-5 text-sm leading-relaxed text-[var(--ph-text-soft)] sm:p-8"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {children}
        </div>
      </div>
    </main>
  );
}

export const H = ({ children }) => (
  <h2
    className="mb-1.5 text-base font-semibold text-[var(--ph-text)]"
    style={{ fontFamily: "var(--font-display)" }}
  >
    {children}
  </h2>
);
