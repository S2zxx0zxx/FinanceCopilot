"use client";

import * as React from "react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { AppShell } from "@/components/shell/app-shell";
import { useRouter, usePathname } from "next/navigation";

const CLERK_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_aGVhbHRoeS1hYXJkdmFyay02Nzg3LmNsZXJrLmFjY291bnRzLmRldiQ";

// Public routes that don't need auth guard
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];

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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkTokenSync />
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
    </ClerkProvider>
  );
}
