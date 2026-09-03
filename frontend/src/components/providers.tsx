"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { AppShell } from "@/components/shell/app-shell";

// No-auth preview build: skips Clerk entirely so the dashboard renders without login.
export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <AppShell>{children}</AppShell>
      <Toaster />
    </ThemeProvider>
  );
}
