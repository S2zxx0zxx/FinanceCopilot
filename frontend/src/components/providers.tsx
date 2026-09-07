"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { AppShell } from "@/components/shell/app-shell";

// PREVIEW MODE: No auth — dashboard renders without login
// To enable real auth, replace with the Clerk version from providers.tsx.bak
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AppShell>{children}</AppShell>
      <Toaster />
    </ThemeProvider>
  );
}
