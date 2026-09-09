"use client";

import Link from "next/link";
import { CheckCircle2, RefreshCw } from "lucide-react";

export default function AccountAggregatorCallbackPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 pb-12">
      <section className="premium-card flex flex-col items-center gap-4 p-7 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--positive-light)]">
          <CheckCircle2 className="h-6 w-6 text-(--positive)" />
        </div>
        <div>
          <h1 className="font-display text-[22px] font-bold">Consent journey completed</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-(--text-secondary)">
            FinCopilot will update your connection after Setu sends the consent status notification. If you approved data access, eligible account data will appear after the Account Aggregator fetch completes.
          </p>
        </div>
        <Link
          href="/you/connections"
          className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-[11px] bg-accent px-4 text-[14px] font-semibold text-accent-foreground"
        >
          <RefreshCw className="h-4 w-4" />
          View connections
        </Link>
      </section>
    </div>
  );
}
