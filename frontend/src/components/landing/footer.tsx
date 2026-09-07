import { ShieldCheck } from "lucide-react";
import { footerColumns } from "@/lib/landing-data";

// lucide-react removed the brand social icons (Twitter, Linkedin, Github) in
// recent versions. Inline SVGs keep the footer self-contained and license-safe.
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const socialIcons = [XIcon, LinkedinIcon, GithubIcon];
// Only claims we can actually substantiate — no SOC 2 / ISO 27001 until audited.
const badges = ["DPDP Act 2023", "AES-256", "Tokenized access", "Setu AA"];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)] pt-14 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="flex flex-col gap-3">
            <a href="#top" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center">
                <span className="font-display font-bold text-[14px] text-accent-foreground">₵</span>
              </div>
              <span className="font-display font-bold text-[17px]">FinCopilot</span>
            </a>
            <p className="text-[13px] text-[var(--text-secondary)] max-w-xs leading-[1.55]">
              The AI co-pilot for your money.
            </p>
            <div className="flex items-center gap-2 mt-1">
              {socialIcons.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social link"
                  className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h4 className="font-display font-semibold text-[14px] mb-1">
                {col.title}
              </h4>
              <div className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Badges strip */}
        <div className="mt-10 pt-8 border-t border-[var(--border)] flex flex-wrap items-center justify-center gap-4 opacity-50">
          {badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-secondary)]"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {badge}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[var(--text-muted)]">
          <span>© 2025 FinCopilot, Inc. All rights reserved.</span>
          <span>Made with care · Not a bank · Not financial advice</span>
        </div>
      </div>
    </footer>
  );
}
