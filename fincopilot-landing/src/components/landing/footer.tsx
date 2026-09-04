import { footerColumns } from "@/lib/landing-data";
import { Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)] pt-14 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* top row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* brand col */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex w-7 h-7 rounded-[8px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] items-center justify-center">
                <span className="font-display font-bold text-[14px] text-[#0A0F0D]">₵</span>
              </span>
              <span className="font-display font-bold text-[17px] tracking-[-0.01em]">FinCopilot</span>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6] max-w-[220px]">
              The AI co-pilot for your money.
            </p>
            <div className="flex items-center gap-2 mt-1">
              {/* Social links — external, open in new tab. Replace with real handles when available. */}
              {[
                { Icon: Twitter, href: "https://twitter.com/fincopilot", label: "Twitter / X" },
                { Icon: Linkedin, href: "https://www.linkedin.com/company/fincopilot", label: "LinkedIn" },
                { Icon: Github, href: "https://github.com/fincopilot", label: "GitHub" },
              ].map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* link cols — each link is now a { label, href } object */}
          {footerColumns.map((col, i) => (
            <div key={i} className="flex flex-col gap-2.5">
              <span className="text-[12px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{col.title}</span>
              {col.links.map((link, j) => {
                const isExternal = link.href.startsWith("http") || link.href.startsWith("/api/");
                return (
                  <a
                    key={j}
                    href={link.href}
                    {...(isExternal && link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors w-fit"
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          ))}
        </div>

        {/* badges strip — honest claims only (no fake ISO/SOC certs). */}
        <div className="mt-10 pt-8 border-t border-[var(--border)] flex flex-wrap items-center justify-center gap-6 opacity-50">
          {["256-bit AES", "Read-only by design", "Setu AA framework"].map((b, i) => (
            <span key={i} className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              {b}
            </span>
          ))}
        </div>

        {/* bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 text-[12px] text-[var(--text-muted)]">
          <span>© 2025 FinCopilot, Inc. All rights reserved.</span>
          <span>Made with care · Not a bank · Not financial advice</span>
        </div>
      </div>
    </footer>
  );
}
