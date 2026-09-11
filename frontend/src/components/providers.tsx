"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { AppShell } from "@/components/shell/app-shell";

import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <AppShell>{children}</AppShell>
        <Toaster />
      </ThemeProvider>
    </ClerkProvider>
  );
}
