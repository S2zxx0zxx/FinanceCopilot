"use client";

import * as React from "react";
import {
  ClerkProvider,
  useAuth,
} from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { AppShell } from "@/components/shell/app-shell";
import { useRouter, usePathname } from "next/navigation";

const CLERK_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_aGVhbHRoeS1hYXJkdmFyay02Nzg3LmNsZXJrLmFjY291bnRzLmRldiQ";

if (!CLERK_PUBLISHABLE_KEY) {
  // Fail loudly in dev so the missing env var is noticed immediately.
  // In production the build/runtime will surface this as a configuration error.
  if (process.env.NODE_ENV !== "production") {
    console.error(
      "[FinCopilot] Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY. " +
      "Set it in .env.local before running the app.",
    );
  }
}

// Public routes that don't need auth guard
const PUBLIC_ROUTES = ["/sign-in", "/sign-up", "/onboarding"];

// ── Auth Guard: redirect to sign-in if not logged in ──────────────────────────
function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // If we're already on a public route, just render children — no redirect needed
  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  React.useEffect(() => {
    if (isLoaded && !isSignedIn && !isPublic) {
      window.location.href = "/sign-in";
    }
  }, [isLoaded, isSignedIn, isPublic, pathname, router]);

  // On public routes, always render (sign-in/sign-up pages themselves)
  if (isPublic) {
    return <>{children}</>;
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-[14px] text-[var(--text-secondary)]">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ── Clerk Token Sync: expose token to API client ─────────────────────────────
function ClerkTokenSync() {
  const { getToken } = useAuth();
  React.useEffect(() => {
    const syncToken = async () => {
      const token = await getToken();
      if (token && typeof window !== "undefined") {
        (window as any).__clerk_session_token = token;
      }
    };
    syncToken();
    const interval = setInterval(syncToken, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [getToken]);
  return null;
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache to prevent DB spam
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6">
        <div className="premium-card p-6 max-w-md text-center">
          <h1 className="font-display font-bold text-[20px] mb-2">Configuration error</h1>
          <p className="text-[13px] text-(--text-secondary)">
            <code className="font-mono">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> is
            not set. Please add it to your environment and restart the dev server.
          </p>
        </div>
      </div>
    );
  }
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkTokenSync />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthGate>
            <AppShell>{children}</AppShell>
          </AuthGate>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
