import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-center flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
        404 — Not found
      </p>
      <h1 className="mt-3 max-w-xl text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)]">
        This page does not exist.
      </h1>
      <p className="mt-3 max-w-md text-[14px] leading-[1.6] text-[var(--color-ink-secondary)]">
        The page you are looking for was moved or never existed. Return to the
        portfolio or explore selected work.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          Back to home
        </Link>
        <Link
          href="/#work"
          className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-[13px] font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          View work
        </Link>
      </div>
    </main>
  );
}
