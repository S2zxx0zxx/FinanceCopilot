import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fincopilot.ai"),
  title: "FinCopilot — The AI co-pilot for your money",
  description:
    "FinCopilot tracks your spending, builds smart budgets, forecasts cash flow, and answers your money questions — all in one beautiful place.",
  keywords: [
    "FinCopilot",
    "AI finance",
    "personal finance",
    "budgeting app",
    "net worth tracker",
    "AI financial advisor",
    "money copilot",
  ],
  authors: [{ name: "FinCopilot, Inc." }],
  creator: "FinCopilot, Inc.",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "FinCopilot — The AI co-pilot for your money",
    description:
      "Track spending, budget smarter, forecast cash flow, and chat with your money — all in one beautiful place.",
    url: "https://fincopilot.ai",
    siteName: "FinCopilot",
    type: "website",
    images: ["/og-cover.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "FinCopilot — The AI co-pilot for your money",
    description:
      "Track spending, budget smarter, forecast cash flow, and chat with your money — all in one beautiful place.",
    images: ["/og-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FinCopilot",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "AI-powered personal finance copilot. Track spending, build smart budgets, forecast cash flow, and chat with your money.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "250000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} antialiased bg-[var(--bg)] text-[var(--text)]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
