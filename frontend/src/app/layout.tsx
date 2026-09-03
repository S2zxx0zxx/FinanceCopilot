import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinCopilot — AI Financial Life Manager",
  description: "Your AI co-pilot for money. Track spending, budget smarter, forecast cash flow, and chat with your finances — all in one beautiful place.",
  keywords: ["personal finance", "AI financial advisor", "budget tracker", "net worth", "Indian finance"],
  authors: [{ name: "FinCopilot, Inc." }],
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
  openGraph: {
    title: "FinCopilot — AI Financial Life Manager",
    description: "Your AI co-pilot for money.",
    type: "website",
    locale: "en_IN",
    siteName: "FinCopilot",
    images: [{ url: "/og-cover.png", width: 1344, height: 768, alt: "FinCopilot" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FinCopilot — AI Financial Life Manager",
    description: "Your AI co-pilot for money.",
    images: ["/og-cover.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} antialiased bg-background text-foreground`}
      >
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
