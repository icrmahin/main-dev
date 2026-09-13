import Link from "next/link";

/* ---------------------------------------------------------------------------
   Content
   --------------------------------------------------------------------------- */

const FOOTER = {
  copyright: "© 2026 Abdulla Al Mahin",
  location: "Dhaka · Bangladesh",
} as const;

const LINKS = [
  { label: "Email", href: "mailto:mahin@example.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
] as const;

/* ---------------------------------------------------------------------------
   Component
   --------------------------------------------------------------------------- */

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)]">
      <div className="container-center flex items-center justify-between py-6 max-md:flex-col max-md:gap-3 max-md:text-center">
        {/* left */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-[var(--color-ink-muted)]">
            {FOOTER.copyright}
          </span>
          <span className="text-[var(--color-ink-muted)]">·</span>
          <span className="text-[11px] font-medium text-[var(--color-ink-muted)]">
            {FOOTER.location}
          </span>
        </div>

        {/* right */}
        <div className="flex items-center gap-3">
          {LINKS.map((link, i) => (
            <span key={link.label} className="flex items-center gap-3">
              {i > 0 && (
                <span className="text-[var(--color-ink-muted)]">·</span>
              )}
              <Link
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="text-[11px] font-medium text-[var(--color-ink-muted)] transition-colors duration-200 hover:text-[var(--color-ink-secondary)]"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
