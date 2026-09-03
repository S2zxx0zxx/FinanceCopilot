"use client";

import * as React from "react";
import { SkeletonCard, SkeletonText } from "@/components/shared";

// ── Loading State — shown while API is fetching ────────────────────────────────
export function LoadingState({ type = "page" }: { type?: "page" | "card" | "list" | "chart" }) {
  if (type === "card") {
    return <SkeletonCard className="h-30" />;
  }
  if (type === "list") {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="premium-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] skeleton" />
              <div className="flex-1">
                <SkeletonText width="60%" />
                <div className="mt-2"><SkeletonText width="40%" /></div>
              </div>
              <SkeletonText width="20%" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (type === "chart") {
    return (
      <div className="premium-card p-5">
        <SkeletonText width="30%" className="mb-4" />
        <div className="h-50 skeleton rounded-[12px]" />
      </div>
    );
  }
  // page
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <SkeletonText width="40%" className="h-7" />
        <div className="mt-2"><SkeletonText width="30%" /></div>
      </div>
      <SkeletonCard className="h-50" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} className="h-25" />)}
      </div>
      <SkeletonCard className="h-75" />
    </div>
  );
}

// ── Error State — shown when API call fails ────────────────────────────────────
export function ApiErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="premium-card p-8 flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-(--negative-light) flex items-center justify-center">
        <svg className="w-6 h-6 text-(--negative)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="font-display font-semibold text-[16px]">Couldn't load data</h3>
      <p className="text-[14px] text-(--text-secondary) max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 rounded-[10px] bg-accent text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ── AsyncBoundary — wraps any component with loading + error handling ────────
export function AsyncBoundary({
  loading,
  error,
  onRetry,
  loadingType = "page",
  children,
}: {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  loadingType?: "page" | "card" | "list" | "chart";
  children?: React.ReactNode;
}) {
  if (loading) return <LoadingState type={loadingType} />;
  if (error) return <ApiErrorState message={error} onRetry={onRetry} />;
  return <>{children}</>;
}
