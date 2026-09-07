"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/landing-data";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--bg)]/85 backdrop-blur-xl border-b border-[var(--border)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center shadow-[0_0_20px_-4px_var(--accent-glow)]">
            <span className="font-display font-bold text-[14px] text-[#0A0F0D]">₵</span>
          </div>
          <span className="font-display font-bold text-[17px] tracking-[-0.01em]">
            FinCopilot
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Desktop CTAs */}
          <a
            href="#top"
            className="hidden sm:inline-flex items-center px-3 py-2 text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
          >
            Log in
          </a>
          <a
            href="#top"
            className="hidden sm:inline-flex items-center bg-[var(--text)] text-[var(--bg)] rounded-full px-4 py-2 text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            Start free
          </a>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="lg:hidden w-9 h-9 rounded-[10px] flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-[var(--surface)] border-l border-[var(--border)] p-5 flex flex-col gap-4">
              <SheetTitle className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center">
                  <span className="font-display font-bold text-[14px] text-[#0A0F0D]">₵</span>
                </div>
                <span className="font-display font-bold text-[16px]">FinCopilot</span>
              </SheetTitle>
              <nav className="flex flex-col gap-1 mt-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-[10px] text-[14px] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2">
                <a
                  href="#top"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-[10px] text-[13px] font-medium text-center text-[var(--text)] border border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  Log in
                </a>
                <a
                  href="#top"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-[10px] text-[13px] font-semibold text-center bg-[var(--accent)] text-[#0A0F0D] hover:bg-[var(--accent-bright)] transition-colors"
                >
                  Start free
                </a>
              </div>
              <SheetClose className="sr-only">Close</SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
