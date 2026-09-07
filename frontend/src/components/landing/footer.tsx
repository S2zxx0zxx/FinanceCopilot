import { Twitter, Linkedin, Github, ShieldCheck } from "lucide-react";
import { footerColumns } from "@/lib/landing-data";

const socialIcons = [Twitter, Linkedin, Github];
const badges = ["SOC 2 Type II", "ISO 27001", "AES-256", "Setu AA"];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)] pt-14 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="flex flex-col gap-3">
            <a href="#top" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center">
                <span className="font-display font-bold text-[14px] text-[#0A0F0D]">₵</span>
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
