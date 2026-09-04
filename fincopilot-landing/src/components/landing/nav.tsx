"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, Moon, Sun, X, ShieldCheck } from "lucide-react";
import { navLinks } from "@/lib/landing-data";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Nav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const { isLoaded, userId } = useAuth();

  React.useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 80);
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-[var(--bg)]/85 backdrop-blur-xl border-b border-[var(--border)] shadow-[0_1px_0_var(--border)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="#top" className="flex items-center gap-2 group" aria-label="FinCopilot home">
          <span className="relative inline-flex w-7 h-7 rounded-[8px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] items-center justify-center overflow-hidden">
            <span className="font-display font-bold text-[14px] text-[#0A0F0D]">₵</span>
          </span>
          <span className="font-display font-bold text-[17px] tracking-[-0.01em] text-[var(--text)]">
            FinCopilot
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
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
          <button
            onClick={() => mounted && setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <div className="hidden sm:inline-flex items-center gap-2">
            {(!isLoaded || !userId) ? (
              <>
                <SignInButton mode="modal">
                  <button className="text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text)] px-3 py-2 transition-colors">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="relative inline-flex h-9 items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--text)] px-4 text-[13px] font-medium text-[var(--bg)] transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    Start free
                  </button>
                </SignUpButton>
              </>
            ) : (
              <UserButton />
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="lg:hidden w-9 h-9 rounded-[10px] flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-[var(--bg)] border-[var(--border)] p-0">
              <SheetHeader className="px-5 pt-5 pb-3 border-b border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <SheetTitle className="font-display font-bold text-[16px]">Menu</SheetTitle>
                  <SheetClose asChild>
                    <button aria-label="Close menu" className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-[var(--surface-2)]">
                      <X className="w-4 h-4" />
                    </button>
                  </SheetClose>
                </div>
              </SheetHeader>
              <nav className="flex flex-col p-3" aria-label="Mobile">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 text-[15px] text-[var(--text)] hover:bg-[var(--surface-2)] rounded-[10px] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                {(!isLoaded || !userId) ? (
                  <>
                    <SignInButton mode="modal">
                      <button
                        onClick={() => setOpen(false)}
                        className="px-3 py-3 text-[15px] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] rounded-[10px] transition-colors text-left"
                      >
                        Log in
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button
                        onClick={() => setOpen(false)}
                        className="mt-2 inline-flex items-center justify-center gap-2 rounded-[10px] bg-[var(--accent)] text-[#0A0F0D] px-4 py-2.5 text-[14px] font-semibold hover:bg-[var(--accent-bright)] transition-colors w-full"
                      >
                        Start free
                      </button>
                    </SignUpButton>
                  </>
                ) : (
                  <div className="px-3 py-3 mt-2 flex items-center justify-between bg-[var(--surface-2)] rounded-[10px]">
                    <span className="text-[14px] text-[var(--text)] font-medium">Account</span>
                    <UserButton />
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop microcopy strip (subtle, only when scrolled) */}
      {scrolled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="hidden lg:block border-t border-[var(--border)] bg-[var(--bg)]/60"
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 h-7 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3 h-3 text-[var(--accent)]" />
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              No credit card · 256-bit AES · 256-bit AES
            </span>
          </div>
        </motion.div>
      )}
    </header>
  );
}
