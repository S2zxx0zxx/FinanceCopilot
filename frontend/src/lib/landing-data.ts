// ============================================================
// FinCopilot Landing Data — all money in ₹ INR (Indian context)
// ============================================================

export type InsightCardType = "insight" | "forecast" | "action" | "alert";

export interface ChatCard {
  type: InsightCardType;
  metric?: string;
  delta?: string;
  chart?: "bar" | "forecast" | "list" | "alert";
  action?: string;
  list?: { emoji: string; name: string; price: string }[];
  confidence?: number;
}

export interface ChatExample {
  q: string;
  a: string;
  card: ChatCard;
}

export interface InsightCardData {
  type: InsightCardType;
  title: string;
  metric: string;
  delta?: string;
  chart: "bar" | "forecast" | "list" | "alert";
  action: string;
  list?: { emoji: string; name: string; price: string }[];
  confidence?: number;
  barData?: number[];
}

// ---- Chat ----
export const chatExamples: ChatExample[] = [
  {
    q: "How much did I spend on dining this month?",
    a: "You've spent ₹8,450 on dining this month — that's 22% above your 3-month average of ₹6,930. The biggest jump was from Swiggy (3× your usual). Want me to set a dining budget?",
    card: {
      type: "insight",
      metric: "₹8,450",
      delta: "↑ 22% vs avg",
      chart: "bar",
      action: "Set dining budget",
    },
  },
  {
    q: "Can I afford a ₹40,000 vacation in August?",
    a: "Yes — based on your current Safe-to-Spend of ₹50,800 and confirmed income, you can afford it with ₹10,800 to spare. Your emergency fund stays untouched. I'd recommend booking before your July SIP.",
    card: {
      type: "forecast",
      metric: "₹50,800",
      confidence: 0.92,
      chart: "forecast",
      action: "Create vacation goal",
    },
  },
  {
    q: "Find subscriptions I'm not using",
    a: "I found 3 subscriptions with low usage: Notion (₹1,200/yr), Spotify Family (₹179/mo, last played 41 days ago), and Cult.fit (₹1,500/mo, last checked in 28 days ago). Cancelling all three saves ₹2,400/month.",
    card: {
      type: "action",
      metric: "₹2,400/mo",
      delta: "save annually",
      chart: "list",
      action: "Cancel all →",
      list: [
        { emoji: "📝", name: "Notion", price: "₹1,200/yr" },
        { emoji: "🎵", name: "Spotify Family", price: "₹179/mo" },
        { emoji: "💪", name: "Cult.fit", price: "₹1,500/mo" },
      ],
    },
  },
  {
    q: "Why is my balance lower than expected?",
    a: "Your balance is ₹4,200 lower than projected because of an unusual Uber charge of ₹1,200 (3× your typical ₹400) and a ₹3,000 mutual fund SIP that posted 2 days early. Neither is a duplicate — both verified against your HDFC statement.",
    card: {
      type: "alert",
      metric: "−₹4,200",
      delta: "vs projected",
      chart: "alert",
      action: "View transactions",
    },
  },
];

export const chatPlaceholders: string[] = [
  "Ask about your spending…",
  "Can I afford a new iPhone?",
  "How much will I have next month?",
  "Find money leaks in my subscriptions…",
];

export const chatExampleChips: string[] = [
  "Spending breakdown",
  "Afford a vacation?",
  "Unused subscriptions",
  "Forecast next 30 days",
  "Why is my balance low?",
  "Set a dining budget",
];

// ---- Hero ----
export const heroPhrases: string[] = [
  "intelligently organized.",
  "on autopilot.",
  "answered.",
];

export const heroInlineStats: { value: string; label: string }[] = [
  { value: "₹2.4B+", label: "money tracked" },
  { value: "250K+", label: "active users" },
  { value: "4.9★", label: "Play Store" },
];

// ---- Trust Marquee ----
export const pressLogos: string[] = [
  "TechCrunch",
  "YourStory",
  "Inc42",
  "The Ken",
  "ET Tech",
  "Product Hunt",
  "Forbes India",
  "Bloomberg Quint",
];

export const stats: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  format: "currency" | "plain" | "percent" | "text";
}[] = [
  { value: 2.4, prefix: "₹", suffix: "B+", label: "money tracked", format: "plain" },
  { value: 250, suffix: "K+", label: "active users", format: "plain" },
  { value: 4.9, label: "Play Store rating", format: "plain" },
  { value: 99.99, suffix: "%", label: "uptime", format: "plain" },
  { value: 0, label: "SOC 2 Type II certified", format: "text" },
];

// ---- Problem ----
export const painPoints: { icon: string; title: string; body: string }[] = [
  {
    icon: "Wallet",
    title: "Scattered accounts",
    body: "Your money lives across 6+ apps. Net worth? A spreadsheet you update twice a year.",
  },
  {
    icon: "Receipt",
    title: "Surprise charges",
    body: "That ₹999 annual fee hits like a jump scare. Subscriptions quietly drain ₹5,000+/month.",
  },
  {
    icon: "HelpCircle",
    title: "No real answers",
    body: "Your bank shows transactions, not insight. 'Can I afford a vacation?' is a 20-minute calculation.",
  },
];

// ---- How It Works ----
export const howItWorksSteps: { icon: string; title: string; body: string }[] = [
  {
    icon: "Link",
    title: "Connect",
    body: "Securely link your banks via the RBI-regulated Account Aggregator framework (Setu). 300+ institutions supported.",
  },
  {
    icon: "Tags",
    title: "Categorize",
    body: "FinCopilot AI auto-tags every transaction with smart, learning categories. No manual sorting, ever.",
  },
  {
    icon: "Sparkles",
    title: "Copilot",
    body: "Ask anything. Get answers, forecasts, and one-tap actions — in plain English or Hindi.",
  },
];

// ---- Bento Features ----
export const bentoFeatures: {
  icon: string;
  title: string;
  body: string;
  span?: string;
  hasChat?: boolean;
}[] = [
  {
    icon: "Sparkles",
    title: "Ask your money anything.",
    body: "Natural language queries backed by your real financial data. No more spreadsheet archaeology.",
    span: "lg:col-span-2 lg:row-span-2",
    hasChat: true,
  },
  {
    icon: "PieChart",
    title: "Budgets that adapt to you.",
    body: "AI sets realistic budgets from your real spending, rolls over unspent amounts, and flags drift.",
  },
  {
    icon: "Wallet",
    title: "All your money, one number.",
    body: "Banks, cards, brokerage, crypto, real estate — aggregated and updated daily.",
  },
  {
    icon: "TrendingUp",
    title: "See 90 days ahead.",
    body: "AI projects your cash flow, predicts shortfalls, and surfaces safe-to-spend amounts.",
  },
  {
    icon: "Search",
    title: "Find the ₹5,000 you forgot.",
    body: "FinCopilot flags unused subscriptions and cancels them in one tap.",
  },
  {
    icon: "BarChart2",
    title: "Know if you're diversified.",
    body: "Allocation, risk, fees, and drift — explained without the jargon.",
    span: "lg:col-span-2",
  },
  {
    icon: "Bell",
    title: "We watch so you don't.",
    body: "Double charges, fraud spikes, unusual categories — pushed before you notice.",
  },
];

// ---- AI Deep Dive insight cards ----
export const insightCards: InsightCardData[] = [
  {
    type: "insight",
    title: "Dining",
    metric: "₹8,450",
    delta: "↑ 22% vs avg",
    chart: "bar",
    action: "Set budget",
    barData: [4200, 3800, 5100, 4600, 6900, 7200, 8450],
  },
  {
    type: "forecast",
    title: "Vacation goal",
    metric: "Aug 14",
    delta: "₹40,000 target",
    chart: "forecast",
    action: "View goal",
    confidence: 0.92,
  },
  {
    type: "action",
    title: "Unused subs",
    metric: "₹2,400/mo",
    delta: "3 found",
    chart: "list",
    action: "Cancel all →",
    list: [
      { emoji: "📝", name: "Notion", price: "₹1,200/yr" },
      { emoji: "🎵", name: "Spotify", price: "₹179/mo" },
      { emoji: "💪", name: "Cult.fit", price: "₹1,500/mo" },
    ],
  },
  {
    type: "alert",
    title: "Unusual charge",
    metric: "₹1,200",
    delta: "Uber · 3× typical",
    chart: "alert",
    action: "Review →",
  },
];

// ---- Chart Showcase ----
export const chartShowcaseItems: { title: string; subtitle: string; chart: string }[] = [
  { title: "Spending trend", subtitle: "30 days", chart: "area" },
  { title: "Net worth", subtitle: "12 months", chart: "line" },
  { title: "Monthly cash flow", subtitle: "12 months", chart: "bar" },
  { title: "Portfolio allocation", subtitle: "By asset class", chart: "donut" },
  { title: "Where it goes", subtitle: "By category", chart: "treemap" },
  { title: "Cash flow forecast", subtitle: "Next 90 days", chart: "combo" },
];

// ---- Dashboard Preview KPIs ----
export const dashboardKpis: { label: string; value: string; delta?: string; positive?: boolean }[] = [
  { label: "Net worth", value: "₹40,21,700", delta: "+12.4%", positive: true },
  { label: "This month", value: "+₹1,00,240", delta: "cash flow +", positive: true },
  { label: "Investments", value: "₹16,40,000", delta: "+8.2%", positive: true },
  { label: "Savings goal", value: "64%", delta: "on track", positive: true },
];

// ---- Integrations ----
export const integrations: { name: string }[] = [
  { name: "HDFC Bank" },
  { name: "ICICI Bank" },
  { name: "State Bank of India" },
  { name: "Axis Bank" },
  { name: "Kotak 811" },
  { name: "Yes Bank" },
  { name: "IDFC First" },
  { name: "IndusInd" },
  { name: "CRED" },
  { name: "Setu AA" },
  { name: "Groww" },
  { name: "Zerodha" },
];

// ---- Security ----
export const securityItems: { icon: string; title: string; body: string }[] = [
  {
    icon: "ShieldCheck",
    title: "256-bit AES encryption",
    body: "Bank-grade encryption at rest and in transit.",
  },
  {
    icon: "EyeOff",
    title: "Read-only access",
    body: "We can see your data. We cannot move your money. Ever.",
  },
  {
    icon: "FileCheck",
    title: "RBI-regulated AA framework",
    body: "Consent is revocable. Data flows only with your explicit, audited permission.",
  },
  {
    icon: "Lock",
    title: "We never sell your data",
    body: "Not to advertisers, not to anyone. Your data is yours.",
  },
];

export const securityBadges: string[] = ["SOC 2 Type II", "ISO 27001", "AES-256", "Setu AA"];

// ---- Testimonials (FIXED: uses `label` and `author` consistently) ----
export const testimonials: {
  metric: string;
  label: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
}[] = [
  {
    metric: "₹38,000",
    label: "saved in 3 months",
    quote: "FinCopilot found ₹38,000 of subscriptions I forgot I had. Cancelled them all in two taps. Genuinely life-changing.",
    author: "Sarah K.",
    role: "Product Designer, Bangalore",
    avatar: "https://i.pravatar.cc/120?img=47",
  },
  {
    metric: "31%",
    label: "savings rate",
    quote: "I went from saving nothing to 31% of my income. The AI budgets actually adapt to how I spend, not some generic rule.",
    author: "Mike R.",
    role: "Software Engineer, Mumbai",
    avatar: "https://i.pravatar.cc/120?img=12",
  },
  {
    metric: "14 hrs",
    label: "saved monthly",
    quote: "I used to spend Sundays reconciling my finances across 4 apps. Now FinCopilot does it in seconds. I got my weekends back.",
    author: "Priya M.",
    role: "Marketing Lead, Delhi",
    avatar: "https://i.pravatar.cc/120?img=44",
  },
  {
    metric: "₹40,000",
    label: "vacation funded",
    quote: "Asked 'Can I afford Goa in August?' — got a yes with the exact number. Booked the tickets that night. No spreadsheet needed.",
    author: "Diego A.",
    role: "Founder, Pune",
    avatar: "https://i.pravatar.cc/120?img=15",
  },
  {
    metric: "0",
    label: "overdraft fees",
    quote: "The forecast warned me 5 days before I'd overdraft. Moved money from savings. Zero fees since I started 8 months ago.",
    author: "Aisha B.",
    role: "Doctor, Hyderabad",
    avatar: "https://i.pravatar.cc/120?img=49",
  },
  {
    metric: "92%",
    label: "forecast accuracy",
    quote: "The 30-day forecast is scary accurate. Within 92% of my actual balance every single month. I trust it now.",
    author: "Tom L.",
    role: "Analyst, Chennai",
    avatar: "https://i.pravatar.cc/120?img=33",
  },
];

// ---- Pricing (₹ INR) ----
export const pricingTiers: {
  name: string;
  monthly: number;
  yearly: number;
  tagline: string;
  features: string[];
  popular?: boolean;
}[] = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    tagline: "Everything you need to start.",
    features: [
      "Link 2 accounts",
      "Auto-categorization",
      "Monthly summary",
      "Net worth tracking",
      "1 AI question per day",
      "30-day history",
      "Android & iOS apps",
      "Community support",
    ],
  },
  {
    name: "Plus",
    monthly: 299,
    yearly: 199,
    tagline: "For people serious about their money.",
    features: [
      "Unlimited accounts",
      "Full AI copilot",
      "90-day forecast",
      "Smart budgets",
      "Money leak detector",
      "Goal planner",
      "1-year history",
      "Priority support",
      "CSV / PDF export",
      "Custom categories",
    ],
  },
  {
    name: "Pro",
    monthly: 499,
    yearly: 299,
    tagline: "Most Popular. The full FinCopilot experience.",
    popular: true,
    features: [
      "Everything in Plus",
      "Unlimited AI questions",
      "365-day forecast",
      "Investment tracking",
      "Tax-ready reports",
      "Shared household view",
      "Priority AI model",
      "API access",
      "White-glove onboarding",
      "Dedicated success manager",
      "Custom AI insights",
      "Early access to features",
    ],
  },
];

// ---- FAQ ----
export const faqItems: { q: string; a: string }[] = [
  {
    q: "Is FinCopilot safe to connect to my bank?",
    a: "Yes. We use the RBI-regulated Account Aggregator framework (via Setu) which is read-only by design. We literally cannot move your money — only read it with your explicit, revocable consent. All data is encrypted with 256-bit AES and we're SOC 2 Type II certified.",
  },
  {
    q: "Can I try it free?",
    a: "Yes — Free plan is free forever, no credit card required. Paid plans (Plus and Pro) come with a 14-day free trial. You can downgrade anytime.",
  },
  {
    q: "Do you sell my data?",
    a: "Never. Not to advertisers, not to data brokers, not to anyone. Your financial data is yours. We make money from subscriptions, not your data.",
  },
  {
    q: "What if my bank isn't supported?",
    a: "We support 300+ banks and NBFCs via the Account Aggregator framework, with new institutions added weekly. You can also import statements manually (CSV/PDF/Excel) — the AI parses them automatically.",
  },
  {
    q: "How is FinCopilot different from other money apps?",
    a: "Three things: (1) A real AI copilot that answers questions in plain English or Hindi, not just dashboards. (2) Forecasts, not just history — we project your next 90 days. (3) A genuinely beautiful, calm UI that doesn't feel like a 2010 banking app.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, one tap in settings. No phone calls, no retention emails, no hassle. You keep your data and can export everything as CSV before you go.",
  },
  {
    q: "Does it work for couples / shared finances?",
    a: "The Pro plan includes shared household views so you and your partner can track joint accounts and shared goals. Full multi-user household management is on the roadmap.",
  },
  {
    q: "Why isn't FinCopilot free?",
    a: "Because we don't sell your data or show ads. If you're not paying for the product, you ARE the product. We'd rather charge a fair price and respect your privacy.",
  },
];

// ---- Footer ----
export const footerColumns: { title: string; links: string[] }[] = [
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
];

export const navLinks: { label: string; href: string }[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "ROI", href: "#calculator" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
];

// ============================================================
// Chart datasets (all ₹ INR)
// ============================================================

export const spendingAreaData = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  spend: Math.round(Math.sin(i / 3) * 3000 + Math.random() * 3500 + i * 80 + 4000),
}));

export const netWorthLineData = [
  { month: "Jan", value: 3800000 },
  { month: "Feb", value: 3850000 },
  { month: "Mar", value: 3920000 },
  { month: "Apr", value: 3900000 },
  { month: "May", value: 3980000 },
  { month: "Jun", value: 4050000 },
  { month: "Jul", value: 4010000 },
  { month: "Aug", value: 4100000 },
  { month: "Sep", value: 4150000 },
  { month: "Oct", value: 4120000 },
  { month: "Nov", value: 4180000 },
  { month: "Dec", value: 4021700 },
];

export const cashflowBarData = [
  { month: "Jan", income: 85000, expense: 64000 },
  { month: "Feb", income: 87000, expense: 68000 },
  { month: "Mar", income: 92000, expense: 71000 },
  { month: "Apr", income: 85000, expense: 66000 },
  { month: "May", income: 95000, expense: 73000 },
  { month: "Jun", income: 88000, expense: 69000 },
  { month: "Jul", income: 98000, expense: 75000 },
  { month: "Aug", income: 90000, expense: 70000 },
  { month: "Sep", income: 93000, expense: 72000 },
  { month: "Oct", income: 100000, expense: 74000 },
  { month: "Nov", income: 95000, expense: 71000 },
  { month: "Dec", income: 102000, expense: 78000 },
];

export const allocationDonutData = [
  { name: "Equity", value: 45, color: "#34D399" },
  { name: "Mutual Funds", value: 25, color: "#5EEAD4" },
  { name: "Fixed Deposits", value: 12, color: "#F472B6" },
  { name: "Cash", value: 13, color: "#FBBF24" },
  { name: "Real estate", value: 5, color: "#C9A86A" },
];

export const spendingTreemapData = [
  { name: "Rent", size: 45000, color: "#C9A86A" },
  { name: "Groceries", size: 16000, color: "#34D399" },
  { name: "Dining", size: 8450, color: "#5EEAD4" },
  { name: "Transport", size: 7750, color: "#FBBF24" },
  { name: "Shopping", size: 12000, color: "#F472B6" },
  { name: "Subs", size: 2400, color: "#34D399" },
  { name: "Utilities", size: 5000, color: "#5EEAD4" },
  { name: "Other", size: 8000, color: "#C9A86A" },
];

export const forecastComboData = [
  { month: "Jul", actual: 3850000, projected: null, upper: null, lower: null },
  { month: "Aug", actual: 3920000, projected: null, upper: null, lower: null },
  { month: "Sep", actual: 3980000, projected: null, upper: null, lower: null },
  { month: "Oct", actual: 4010000, projected: null, upper: null, lower: null },
  { month: "Nov", actual: 4050000, projected: null, upper: null, lower: null },
  { month: "Dec", actual: 4021700, projected: 4080000, upper: 4200000, lower: 3960000 },
  { month: "Jan", actual: null, projected: 4120000, upper: 4280000, lower: 3960000 },
  { month: "Feb", actual: null, projected: 4160000, upper: 4360000, lower: 3960000 },
  { month: "Mar", actual: null, projected: 4200000, upper: 4440000, lower: 3960000 },
];

// ============================================================
// Competitor Comparison
// ============================================================
export interface CompetitorRow {
  feature: string;
  fincopilot: boolean | string;
  others: { name: string; value: boolean | string }[];
}

export const competitors = [
  { name: "FinCopilot", color: "var(--accent)", highlight: true },
  { name: "Bank Apps", color: "var(--text-muted)" },
  { name: "Traditional Apps", color: "var(--text-muted)" },
  { name: "Spreadsheets", color: "var(--text-muted)" },
];

export const comparisonRows: CompetitorRow[] = [
  {
    feature: "AI copilot (natural language)",
    fincopilot: true,
    others: [
      { name: "Bank Apps", value: false },
      { name: "Traditional Apps", value: "Limited" },
      { name: "Spreadsheets", value: false },
    ],
  },
  {
    feature: "90-day cash flow forecast",
    fincopilot: true,
    others: [
      { name: "Bank Apps", value: false },
      { name: "Traditional Apps", value: false },
      { name: "Spreadsheets", value: "Manual" },
    ],
  },
  {
    feature: "Auto-categorization (AI)",
    fincopilot: true,
    others: [
      { name: "Bank Apps", value: "Basic" },
      { name: "Traditional Apps", value: "Rules only" },
      { name: "Spreadsheets", value: false },
    ],
  },
  {
    feature: "Safe-to-Spend calculation",
    fincopilot: true,
    others: [
      { name: "Bank Apps", value: false },
      { name: "Traditional Apps", value: false },
      { name: "Spreadsheets", value: "Manual" },
    ],
  },
  {
    feature: "Subscription leak detection",
    fincopilot: true,
    others: [
      { name: "Bank Apps", value: false },
      { name: "Traditional Apps", value: "Basic" },
      { name: "Spreadsheets", value: false },
    ],
  },
  {
    feature: "RBI-regulated AA integration",
    fincopilot: true,
    others: [
      { name: "Bank Apps", value: "Own only" },
      { name: "Traditional Apps", value: "Plaid/CSV" },
      { name: "Spreadsheets", value: false },
    ],
  },
  {
    feature: "Hindi + English support",
    fincopilot: true,
    others: [
      { name: "Bank Apps", value: false },
      { name: "Traditional Apps", value: false },
      { name: "Spreadsheets", value: false },
    ],
  },
  {
    feature: "Read-only (can't move money)",
    fincopilot: true,
    others: [
      { name: "Bank Apps", value: "Can move" },
      { name: "Traditional Apps", value: "Varies" },
      { name: "Spreadsheets", value: "N/A" },
    ],
  },
  {
    feature: "Net worth across all accounts",
    fincopilot: true,
    others: [
      { name: "Bank Apps", value: "Own only" },
      { name: "Traditional Apps", value: "Manual" },
      { name: "Spreadsheets", value: "Manual" },
    ],
  },
  {
    feature: "Never sells your data",
    fincopilot: true,
    others: [
      { name: "Bank Apps", value: "Varies" },
      { name: "Traditional Apps", value: "Often" },
      { name: "Spreadsheets", value: "N/A" },
    ],
  },
];

// ============================================================
// Savings Calculator (interactive ROI)
// ============================================================
export const savingsCalculatorPresets = {
  // Monthly expense leak (unused subs, overcharges) — industry avg 8% of spending
  leakRateDefault: 8000,
  leakRateMin: 2000,
  leakRateMax: 20000,
  // Hours saved per month (manual reconciliation)
  hoursSavedDefault: 14,
  hoursSavedMin: 4,
  hoursSavedMax: 40,
  // Hourly value (Indian mid-pro avg ₹500/hr)
  hourlyValue: 500,
  // Forecast accuracy prevents overdrafts — avg ₹1,200/yr in fees avoided
  feesAvoidedDefault: 1200,
  feesAvoidedMin: 0,
  feesAvoidedMax: 6000,
};
