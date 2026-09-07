"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// In the preview build Clerk isn't mounted, so this page renders a lightweight
// sign-up CTA that bounces new users to onboarding. In production, swap this for
// Clerk's <SignUp /> component once ClerkProvider is wired up in providers.tsx.
export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleStart = () => {
    toast({ title: "Account created", description: "Let's get your finances set up." });
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="premium-card p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-accent to-(--gold) flex items-center justify-center shadow-[var(--shadow-glow)]">
              <span className="font-display font-bold text-accent-foreground text-[26px]">F</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Create your FinCopilot account</h1>
              <p className="text-[13px] text-(--text-secondary) mt-1">
                Free to start. No credit card required. Cancel anytime.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart}
            className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-[12px] bg-accent text-accent-foreground text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-colors"
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[11px] text-(--text-tertiary) font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            Preview mode — your data stays local
          </div>

          <div className="flex items-center justify-between text-[12px] text-(--text-secondary) pt-3 border-t border-[var(--border-subtle)]">
            <Link href="/sign-in" className="text-accent hover:text-(--accent-hover) font-medium">
              Already have an account? Sign in
            </Link>
            <Link href="/" className="text-(--text-tertiary) hover:text-foreground">
              Explore as guest
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
