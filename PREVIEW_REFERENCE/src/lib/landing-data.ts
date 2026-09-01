// ============================================================
// FinCopilot landing page — all mock data in one typed place
// ============================================================

import {
  Sparkles, Wallet, TrendingUp, LineChart, Repeat, PieChart, ShieldAlert,
  CreditCard, Bell, Brain, Link2, Tags, ArrowRight, type LucideIcon,
} from "lucide-react";

// ---------- Nav ----------
export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
  { label: "Security", href: "#security" },
] as const;

// ---------- Press logos ----------
export const pressLogos = [
  "TechCrunch", "Forbes", "The Verge", "Bloomberg", "Wired", "Product Hunt",
  "Fast Company", "The Wall Street Journal",
] as const;

// ---------- Stats ----------
export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  format: "currency" | "plain" | "percent" | "text";
}

export const stats: Stat[] = [
  { value: 2.4, prefix: "$", suffix: "B+", label: "money tracked", format: "currency" },
  { value: 250, suffix: "K+", label: "active users", format: "plain" },
  { value: 4.9, suffix: "★", label: "App Store rating", format: "plain" },
  { value: 99.99, suffix: "%", label: "uptime", format: "percent" },
  { value: 0, label: "SOC 2 Type II certified", format: "text", prefix: "" },
];

// The last stat is text "SOC 2" not a count-up; handle in component.

// ---------- Hero inline stats ----------
export const heroInlineStats: { value: string; label: string }[] = [
  { value: "$2.4B+", label: "tracked" },
  { value: "250K+", label: "users" },
  { value: "4.9★", label: "App Store" },
];

// ---------- Hero rotating phrases ----------
export const heroPhrases = [
  "intelligently organized.",
  "on autopilot.",
  "answered.",
] as const;

// ---------- Pain points ----------
export interface PainPoint {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const painPoints: PainPoint[] = [
  {
    icon: CreditCard,
    title: "Scattered accounts",
    body: "Your money lives across 6+ apps. Net worth? A spreadsheet you update twice a year.",
  },
  {
    icon: Bell,
    title: "Surprise charges",
    body: "That $89 annual fee hits like a jump scare. Subscriptions quietly drain $200+/month.",
  },
  {
    icon: Brain,
    title: "No real answers",
    body: "Your bank shows transactions, not insight. 'Can I afford a vacation?' is a 20-minute calculation.",
  },
];

// ---------- How it works ----------
export interface HowItWorksStep {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    icon: Link2,
    title: "Connect",
    body: "Securely link your banks, cards, brokerages, and wallets via read-only Plaid. 12,000+ institutions supported.",
  },
  {
    icon: Tags,
    title: "Categorize",
    body: "FinCopilot AI auto-tags every transaction with smart, learning categories. No manual sorting, ever.",
  },
  {
    icon: Sparkles,
    title: "Copilot",
    body: "Ask anything. Get answers, forecasts, and one-tap actions — in plain English.",
  },
];

// ---------- Bento features ----------
export interface BentoFeature {
  icon: LucideIcon;
  title: string;
  body: string;
  cta: string;
  span?: string;
  hasChat?: boolean;
}

export const bentoFeatures: BentoFeature[] = [
  {
    icon: Sparkles,
    title: "Ask your money anything.",
    body: "FinCopilot AI answers in plain English — with charts, forecasts, and one-tap actions.",
    cta: "Try a question",
    span: "lg:col-span-2 lg:row-span-2",
    hasChat: true,
  },
  {
    icon: Wallet,
    title: "Budgets that adapt to you.",
    body: "AI sets realistic budgets from your real spending, rolls over unspent amounts, and flags drift.",
    cta: "Track my spending",
  },
  {
    icon: TrendingUp,
    title: "All your money, one number.",
    body: "Banks, cards, brokerage, crypto, real estate — aggregated and updated daily.",
    cta: "See my net worth",
  },
  {
    icon: LineChart,
    title: "See 90 days ahead.",
    body: "AI projects your cash flow, predicts shortfalls, and surfaces safe-to-spend amounts.",
    cta: "Forecast my cash",
  },
  {
    icon: Repeat,
    title: "Find the $200 you forgot.",
    body: "FinCopilot flags unused subscriptions and cancels them in one tap.",
    cta: "Manage my subscriptions",
  },
  {
    icon: PieChart,
    title: "Know if you're diversified.",
    body: "Allocation, risk, fees, and drift — explained without the jargon.",
    cta: "Analyze my portfolio",
    span: "lg:col-span-2",
  },
  {
    icon: ShieldAlert,
    title: "We watch so you don't.",
    body: "Double charges, fraud spikes, unusual categories — pushed before you notice.",
    cta: "Set my alerts",
  },
];

// ---------- Chat examples ----------
export interface ChatCard {
  type: "insight" | "forecast" | "action" | "alert";
  metric?: string;
  delta?: string;
  chart?: "mini-bar" | "forecast-spark" | "none";
  confidence?: number;
  action?: string;
  list?: { emoji: string; name: string; price: string }[];
}

export interface ChatExample {
  q: string;
  a: string;
  card: ChatCard;
}

export const chatExamples: ChatExample[] = [
  {
    q: "How much did I spend on dining out last month?",
    a: "$487 across 23 transactions. That's 22% above your 3-month average of $399.",
    card: {
      type: "insight",
      metric: "$487",
      delta: "+22%",
      chart: "mini-bar",
      action: "Set a $400 budget",
    },
  },
  {
    q: "Can I afford a $2,000 vacation in August?",
    a: "Yes — with 92% confidence. At your current saving rate, you'll have $2,140 by Aug 1, leaving $140 buffer.",
    card: {
      type: "forecast",
      metric: "Aug 14",
      chart: "forecast-spark",
      confidence: 92,
      action: "Create vacation goal",
    },
  },
  {
    q: "What subscriptions am I paying for that I don't use?",
    a: "I found 3 subscriptions with no activity in 90 days — totaling $124.97/month.",
    card: {
      type: "action",
      list: [
        { emoji: "🎬", name: "Streamly", price: "$19.99" },
        { emoji: "💪", name: "FitForge", price: "$79.99" },
        { emoji: "🍔", name: "BiteClub", price: "$24.99" },
      ],
      action: "Cancel all",
    },
  },
  {
    q: "Find me $200 I can save this month.",
    a: "Three opportunities: raise dining budget adherence ($90), pause unused subs ($125), switch phone plan ($40). Total potential: $255.",
    card: {
      type: "insight",
      metric: "$255",
      chart: "mini-bar",
      action: "Apply all",
    },
  },
];

export const chatExampleChips = [
  "How much did I spend on dining out last month?",
  "Can I afford a $2,000 vacation in August?",
  "What subscriptions am I paying for that I don't use?",
  "Find me $200 I can save this month.",
];

// ---------- Chat demo placeholder rotation ----------
export const chatPlaceholders = [
  "Ask anything… Try: How much did I spend on coffee last month?",
  "Ask anything… Try: Can I afford a $2,000 vacation in August?",
  "Ask anything… Try: When will I hit my $10k savings goal?",
  "Ask anything… Try: Why did my net worth drop this week?",
];

// ---------- Insight cards (AI deepdive) ----------
export interface InsightCardData {
  type: "insight" | "forecast" | "action" | "alert";
  title: string;
  metric: string;
  delta?: string;
  chart: "bar" | "forecast" | "list" | "alert";
  action: string;
  list?: { emoji: string; name: string; price: string }[];
  confidence?: number;
}

export const insightCards: InsightCardData[] = [
  {
    type: "insight",
    title: "Dining",
    metric: "$487",
    delta: "22% above 3-mo avg",
    chart: "bar",
    action: "Set a $400 budget",
  },
  {
    type: "forecast",
    title: "Vacation goal",
    metric: "Aug 14",
    delta: "At your current rate",
    chart: "forecast",
    action: "Create vacation goal",
    confidence: 92,
  },
  {
    type: "action",
    title: "Unused subscriptions",
    metric: "$124.97/mo",
    chart: "list",
    action: "Cancel all",
    list: [
      { emoji: "🎬", name: "Streamly", price: "$19.99" },
      { emoji: "💪", name: "FitForge", price: "$79.99" },
      { emoji: "🍔", name: "BiteClub", price: "$24.99" },
    ],
  },
  {
    type: "alert",
    title: "Unusual charge",
    metric: "Uber $48",
    delta: "3× your typical",
    chart: "alert",
    action: "Review",
  },
];

// ---------- Chart showcase items ----------
export const chartShowcaseItems = [
  { title: "Spending trend", subtitle: "30 days", chart: "area" as const },
  { title: "Net worth", subtitle: "12 months", chart: "line" as const },
  { title: "Monthly cash flow", subtitle: "12 months", chart: "bar" as const },
  { title: "Portfolio allocation", subtitle: "By asset class", chart: "donut" as const },
  { title: "Where it goes", subtitle: "By category", chart: "treemap" as const },
  { title: "Cash flow forecast", subtitle: "Next 90 days", chart: "combo" as const },
];

// ---------- Dashboard KPIs ----------
export interface DashboardKpi {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: LucideIcon;
}

export const dashboardKpis: DashboardKpi[] = [
  { label: "Net worth", value: "$48,217", delta: "+3.2%", positive: true, icon: TrendingUp },
  { label: "This month", value: "+$1,240", delta: "cash", positive: true, icon: Wallet },
  { label: "Investments", value: "$19,840", delta: "+1.4%", positive: true, icon: PieChart },
  { label: "Savings goal", value: "64%", delta: "of $50k", positive: true, icon: LineChart },
];

// ---------- Integrations ----------
export const integrations = [
  "Chase", "Bank of America", "Fidelity", "Vanguard", "Robinhood", "Coinbase",
  "Wise", "Apple Card", "Amex", "Schwab", "Capital One", "SoFi",
] as const;

// ---------- Security items ----------
export interface SecurityItem {
  icon: LucideIcon;
  title: string;
  body: string;
}

import { Lock, EyeOff, FileCheck, HandCoins } from "lucide-react";

export const securityItems: SecurityItem[] = [
  {
    icon: Lock,
    title: "256-bit AES encryption",
    body: "Bank-grade encryption at rest and in transit.",
  },
  {
    icon: EyeOff,
    title: "Read-only access",
    body: "We can see your data. We cannot move your money. Ever.",
  },
  {
    icon: FileCheck,
    title: "SOC 2 Type II",
    body: "Independently audited annually. Report available on request.",
  },
  {
    icon: HandCoins,
    title: "We never sell your data",
    body: "Not to advertisers, not to anyone. Your data is yours.",
  },
];

export const securityBadges = [
  "SOC 2 Type II",
  "ISO 27001",
  "AES-256",
  "Plaid",
] as const;

// ---------- Testimonials ----------
export interface Testimonial {
  metric: string;
  metricLabel: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    metric: "$4,200",
    metricLabel: "saved in 3 months",
    quote: "FinCopilot found three subscriptions I forgot I had. That alone paid for a decade.",
    name: "Sarah K.",
    role: "Product Designer, Brooklyn",
    avatar: "/founder-avatar-1.jpg",
  },
  {
    metric: "31%",
    metricLabel: "net worth growth in a year",
    quote: "I finally see everything in one place. No more spreadsheet Sundays.",
    name: "Mike R.",
    role: "Software Engineer, Austin",
    avatar: "/founder-avatar-2.jpg",
  },
  {
    metric: "14 hrs",
    metricLabel: "saved per month",
    quote: "It answers the questions I used to spend an hour calculating.",
    name: "Priya M.",
    role: "Marketing Lead, Toronto",
    avatar: "/founder-avatar-3.jpg",
  },
  {
    metric: "$2,000",
    metricLabel: "vacation funded on autopilot",
    quote: "The rollover budgets made saving painless. I didn't even notice.",
    name: "Diego A.",
    role: "Teacher, Madrid",
    avatar: "/founder-avatar-4.jpg",
  },
  {
    metric: "0",
    metricLabel: "surprise charges since joining",
    quote: "Anomaly alerts caught a duplicate charge within an hour.",
    name: "Aisha B.",
    role: "Founder, Dubai",
    avatar: "/founder-avatar-5.jpg",
  },
  {
    metric: "92%",
    metricLabel: "of goals hit on time",
    quote: "The forecasts are weirdly accurate. It just gets how I spend.",
    name: "Tom L.",
    role: "Analyst, London",
    avatar: "/founder-avatar-6.jpg",
  },
];

// ---------- Pricing ----------
export interface PricingTier {
  name: string;
  monthly: number;
  yearly: number;
  pitch: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    pitch: "Everything you need to start.",
    cta: "Get started",
    features: [
      "Link up to 2 accounts",
      "Auto-categorization",
      "Monthly spending summary",
      "Net worth tracking",
      "1 AI question / day",
      "30-day history",
      "iOS & Android apps",
      "Community support",
    ],
  },
  {
    name: "Plus",
    monthly: 8,
    yearly: 5,
    pitch: "For people serious about their money.",
    cta: "Get started",
    features: [
      "Everything in Free, plus:",
      "Unlimited accounts",
      "Unlimited AI questions",
      "Cash flow forecasting",
      "Subscription management",
      "Rollover budgets",
      "Anomaly alerts",
      "90-day history",
      "Email + chat support",
      "Custom categories",
    ],
  },
  {
    name: "Pro",
    monthly: 13,
    yearly: 8,
    pitch: "Most Popular. The full FinCopilot experience.",
    cta: "Get started",
    popular: true,
    features: [
      "Everything in Plus, plus:",
      "Investment insights & drift alerts",
      "Real estate tracking",
      "Tax optimization hints",
      "Priority chat with AI",
      "Custom categories & rules",
      "Unlimited history",
      "Export & API access",
      "Shared household views",
      "Priority support",
      "Early access to new features",
      "Annual financial review",
    ],
  },
];

// ---------- FAQ ----------
export const faqItems: { q: string; a: string }[] = [
  {
    q: "Is FinCopilot safe to connect to my bank?",
    a: "Yes. We use Plaid (the same infrastructure trusted by Venmo, Robinhood, and Acorns) to connect read-only. We can see your data; we cannot move your money. Connections are 256-bit AES encrypted and we're SOC 2 Type II audited.",
  },
  {
    q: "Can I try it free?",
    a: "Yes. The Free plan is free forever, no credit card. Paid plans have a 14-day free trial — cancel anytime, keep your data.",
  },
  {
    q: "Do you sell my data?",
    a: "Never. Not to advertisers, not to data brokers, not to anyone. Our only revenue is your subscription. Your data is yours.",
  },
  {
    q: "What if my bank isn't supported?",
    a: "We support 12,000+ institutions across 20 countries via Plaid. If yours isn't listed, search on signup — we add new connections weekly.",
  },
  {
    q: "How is FinCopilot different from Mint / Copilot / YNAB?",
    a: "Three things: (1) the AI copilot — ask any money question in plain English; (2) forecasts, not just history; (3) an interface that doesn't feel like a 2010 banking app.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. One tap in settings. You keep your historical data and can export it.",
  },
  {
    q: "Does it work for couples / shared finances?",
    a: "Pro plan includes shared household views. Multi-user with granular permissions is on the roadmap.",
  },
  {
    q: "Why isn't FinCopilot free?",
    a: "Because we don't sell your data or show ads. Your subscription is our only revenue — which means our incentives stay aligned with yours.",
  },
];

// ---------- Footer ----------
export const footerColumns = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Security", "Integrations", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Press", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Cookies", "Security overview", "Data promise"],
  },
] as const;

// ---------- Ticker ----------
export const tickerItems: { symbol: string; change: number }[] = [
  { symbol: "AAPL", change: 1.91 },
  { symbol: "MSFT", change: 1.64 },
  { symbol: "RIVN", change: -1.52 },
  { symbol: "VTI", change: 1.47 },
  { symbol: "GOOGL", change: 0.82 },
  { symbol: "NVDA", change: 3.14 },
  { symbol: "TSLA", change: -0.74 },
  { symbol: "AMZN", change: 0.55 },
];

// ---------- Chart datasets ----------
export const spendingAreaData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  spend: Math.round(40 + Math.sin(i / 3) * 30 + Math.random() * 35 + i * 0.8),
}));

export const netWorthLineData = [
  { month: "Jan", value: 42000 },
  { month: "Feb", value: 42800 },
  { month: "Mar", value: 43500 },
  { month: "Apr", value: 44100 },
  { month: "May", value: 44900 },
  { month: "Jun", value: 45200 },
  { month: "Jul", value: 45800 },
  { month: "Aug", value: 46100 },
  { month: "Sep", value: 46900 },
  { month: "Oct", value: 47200 },
  { month: "Nov", value: 47600 },
  { month: "Dec", value: 48217 },
];

export const cashflowBarData = [
  { month: "Jan", income: 6100, expense: 4700 },
  { month: "Feb", income: 5900, expense: 4850 },
  { month: "Mar", income: 6200, expense: 4600 },
  { month: "Apr", income: 6100, expense: 4900 },
  { month: "May", income: 6400, expense: 5100 },
  { month: "Jun", income: 6000, expense: 4750 },
  { month: "Jul", income: 6300, expense: 4800 },
  { month: "Aug", income: 6100, expense: 4950 },
  { month: "Sep", income: 6500, expense: 4700 },
  { month: "Oct", income: 6200, expense: 4850 },
  { month: "Nov", income: 6400, expense: 4600 },
  { month: "Dec", income: 6600, expense: 4900 },
];

export const allocationDonutData = [
  { name: "Equity", value: 45, color: "#34D399" },
  { name: "ETF", value: 25, color: "#5EEAD4" },
  { name: "Crypto", value: 12, color: "#F472B6" },
  { name: "Cash", value: 13, color: "#FBBF24" },
  { name: "Real estate", value: 5, color: "#C9A86A" },
];

export const spendingTreemapData = [
  { name: "Rent", size: 1800, color: "#C9A86A" },
  { name: "Groceries", size: 640, color: "#34D399" },
  { name: "Dining", size: 487, color: "#5EEAD4" },
  { name: "Transport", size: 310, color: "#FBBF24" },
  { name: "Shopping", size: 290, color: "#F472B6" },
  { name: "Subs", size: 125, color: "#34D399" },
  { name: "Utilities", size: 180, color: "#5EEAD4" },
  { name: "Other", size: 210, color: "#C9A86A" },
];

export const forecastComboData = [
  { month: "Jul", actual: 45800, projected: null, lower: null, upper: null },
  { month: "Aug", actual: 46100, projected: null, lower: null, upper: null },
  { month: "Sep", actual: 46900, projected: null, lower: null, upper: null },
  { month: "Oct", actual: 47200, projected: null, lower: null, upper: null },
  { month: "Nov", actual: 47600, projected: null, lower: null, upper: null },
  { month: "Dec", actual: 48217, projected: 48217, lower: 48217, upper: 48217 },
  { month: "Jan", actual: null, projected: 48800, lower: 48400, upper: 49200 },
  { month: "Feb", actual: null, projected: 49300, lower: 48700, upper: 49900 },
  { month: "Mar", actual: null, projected: 49900, lower: 49100, upper: 50700 },
];

export { ArrowRight, LucideIcon };
