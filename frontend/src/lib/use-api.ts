"use client";

import * as React from "react";
import { api, ApiError } from "@/lib/api";

// ── useApi: Generic data fetching hook ───────────────────────────────────────
// Replaces hardcoded data.ts imports with real API calls.
// Handles loading, error, and refetch states automatically.

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: any[] = []
): UseApiState<T> {
  const [state, setState] = React.useState<Omit<UseApiState<T>, "refetch">>({
    data: null,
    loading: true,
    error: null,
  });
  const [refetchCount, setRefetchCount] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;

    fetcher()
      .then((data) => {
        if (mounted) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (mounted) {
          const msg = err instanceof ApiError ? err.message : "Failed to load data";
          setState({ data: null, loading: false, error: msg });
        }
      });

    return () => { mounted = false; };
    }, [...deps, refetchCount]);

  return {
    ...state,
    refetch: () => setRefetchCount((c) => c + 1),
  };
}

// ── useMultipleApi: Fetch multiple endpoints in parallel ──────────────────────
// For pages that need data from multiple endpoints simultaneously.

interface UseMultipleApiState {
  data: Record<string, any>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMultipleApi(
  fetchers: Record<string, () => Promise<any>>,
  deps: any[] = []
): UseMultipleApiState {
  const [state, setState] = React.useState<Omit<UseMultipleApiState, "refetch">>({
    data: {},
    loading: true,
    error: null,
  });
  const [refetchCount, setRefetchCount] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;

    const entries = Object.entries(fetchers);
    Promise.all(entries.map(([key, fn]) => fn().then((v) => [key, v])))
      .then((results) => {
        if (mounted) {
          const data: Record<string, any> = {};
          results.forEach(([key, val]: any) => { data[key] = val; });
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (mounted) {
          const msg = err instanceof ApiError ? err.message : "Failed to load data";
          setState({ data: {}, loading: false, error: msg });
        }
      });

    return () => { mounted = false; };
    }, [...deps, refetchCount]);

  return {
    ...state,
    refetch: () => setRefetchCount((c) => c + 1),
  };
}
