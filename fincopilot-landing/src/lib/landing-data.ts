// ============================================================================
// FinCopilot Landing — Mock Data
// All money is in ₹ INR, formatted in Indian number system (lakhs notation).
// Indian context: Setu Account Aggregator (not Plaid), Indian banks, Indian stocks.
// Currency values are realistic for an Indian personal-finance user.
// ============================================================================

// ── Type exports (consumed by bits/insight-card.tsx + bits/chat-demo.tsx) ──

export type InsightCardType = "insight" | "forecast" | "action" | "alert";

export interface ChatCard {
  type: InsightCardType;
  metric?: string;
  delta?: string;
  chart?: "mini-bar" | "forecast" | "list" | "alert";
  action?: string;
  list?: { emoji: string; name: string; price: string }[];
  confidence?: number;
}

export interface InsightCardData {
  type: InsightCardType;
  title: string;
  metric: string;
  delta?: string;
  chart: "mini-bar" | "forecast" | "list" | "alert";
  action: string;
  list?: { emoji: string; name: string; price: string }[];
  confidence?: number;
}

export const chatExamples = [
  {
    q: "How much did I spend on dining out last month?",
    a: "₹8,450 across 23 transactions. That's 22% above your 3-month average of ₹6,900.",
    card: { type: "insight", metric: "₹8,450", delta: "+22%", chart: "mini-bar", action: "Set a ₹7,000 budget" },
  },
  {
    q: "Can I afford a ₹40,000 vacation in August?",
    a: "Yes — with 92% confidence. At your current saving rate, you'll have ₹42,800 by Aug 1, leaving ₹2,800 buffer.",
    card: { type: "forecast", metric: "Aug 14", chart: "forecast-spark", confidence: 92, action: "Create vacation goal" },
  },
  {
    q: "What subscriptions am I paying for that I don't use?",
    a: "I found 3 subscriptions with no activity in 90 days — totaling ₹2,400/month.",
    card: { type: "action", list: [
      { emoji: "🎬", name: "Streamly", price: "₹649" },
      { emoji: "💪", name: "FitForge", price: "₹1,199" },
      { emoji: "🍔", name: "BiteClub", price: "₹552" },
    ], action: "Cancel all" },
  },
  {
    q: "Find me ₹5,000 I can save this month.",
    a: "Three opportunities: raise dining budget adherence (₹2,100), pause unused subs (₹2,400), switch phone plan (₹500). Total potential: ₹5,000.",
    card: { type: "insight", metric: "₹5,000", chart: "mini-bar", action: "Apply all" },
  },
];

export const chatPlaceholders = [
  "Ask anything… Try: How much did I spend on dining out last month?",
  "Ask anything… Try: Can I afford a ₹40,000 vacation in August?",
  "Ask anything… Try: When will I hit my ₹10 lakh savings goal?",
  "Ask anything… Try: Why did my net worth drop this week?",
];

// Indian stocks (NSE tickers) for the dashboard sidebar ticker.
export const tickerItems = [
  { symbol: "RELIANCE", change: "+1.91%", up: true },
  { symbol: "TCS", change: "+1.64%", up: true },
  { symbol: "INFY", change: "-1.52%", up: false },
  { symbol: "HDFCBANK", change: "+1.47%", up: true },
  { symbol: "ICICIBANK", change: "+0.82%", up: true },
  { symbol: "SBIN", change: "+3.14%", up: true },
  { symbol: "BHARTIARTL", change: "-0.74%", up: false },
  { symbol: "WIPRO", change: "+0.55%", up: true },
];

export const dashboardKpis = [
  { iconKey: "TrendingUp", label: "Net worth", value: "₹40,21,700", delta: "+3.2%", up: true },
  { iconKey: "Wallet", label: "This month cash", value: "+₹1,00,240", delta: "", up: true },
  { iconKey: "PieChart", label: "Investments", value: "₹16,40,000", delta: "+1.4%", up: true },
  { iconKey: "Target", label: "Savings goal", value: "64%", delta: "", up: true },
];

export const testimonials = [
  { metric: "₹38,000", label: "saved in 3 months", quote: "FinCopilot found three subscriptions I forgot I had. That alone paid for a decade.", author: "Sarah K.", role: "Product Designer, Mumbai", avatar: "/founder-avatar-1.jpg" },
  { metric: "31%", label: "net worth growth in a year", quote: "I finally see everything in one place. No more spreadsheet Sundays.", author: "Mike R.", role: "Software Engineer, Bengaluru", avatar: "/founder-avatar-2.jpg" },
  { metric: "14 hours", label: "saved per month", quote: "It answers the questions I used to spend an hour calculating.", author: "Priya M.", role: "Marketing Lead, Delhi", avatar: "/founder-avatar-3.jpg" },
  { metric: "₹40,000", label: "vacation funded on autopilot", quote: "The rollover budgets made saving painless. I didn't even notice.", author: "Diego A.", role: "Teacher, Pune", avatar: "/founder-avatar-4.jpg" },
  { metric: "0", label: "surprise charges since joining", quote: "Anomaly alerts caught a duplicate charge within an hour.", author: "Aisha B.", role: "Founder, Hyderabad", avatar: "/founder-avatar-5.jpg" },
  { metric: "92%", label: "of goals hit on time", quote: "The forecasts are weirdly accurate. It just gets how I spend.", author: "Tom L.", role: "Analyst, Chennai", avatar: "/founder-avatar-6.jpg" },
];

// Indian banks + financial institutions + Account Aggregator ecosystem.
export const integrations = [
  { name: "HDFC Bank", logo: "/integration-logo-1.svg" },
  { name: "ICICI Bank", logo: "/integration-logo-2.svg" },
  { name: "State Bank of India", logo: "/integration-logo-3.svg" },
  { name: "Axis Bank", logo: "/integration-logo-4.svg" },
  { name: "Kotak 811", logo: "/integration-logo-5.svg" },
  { name: "Yes Bank", logo: "/integration-logo-6.svg" },
  { name: "IDFC First", logo: "/integration-logo-7.svg" },
  { name: "IndusInd", logo: "/integration-logo-8.svg" },
  { name: "CRED", logo: "/integration-logo-9.svg" },
  { name: "Setu AA", logo: "/integration-logo-10.svg" },
  { name: "Groww", logo: "/integration-logo-11.svg" },
  { name: "Zerodha", logo: "/integration-logo-12.svg" },
];

export const faqItems = [
  { q: "Is FinCopilot safe to connect to my bank?", a: "Yes. We connect via the RBI-regulated Account Aggregator framework (Setu) — read-only, revocable consent. We can see your data; we cannot move your money. Connections are 256-bit AES encrypted and we're SOC 2 Type II audited." },
  { q: "Can I try it free?", a: "Yes. The Free plan is free forever, no card needed. Paid plans have a 14-day free trial — cancel anytime, keep your data." },
  { q: "Do you sell my data?", a: "Never. Not to advertisers, not to data brokers, not to anyone. Our only revenue is your subscription. Read our privacy promise →" },
  { q: "What if my bank isn't supported?", a: "We support 300+ banks and NBFCs across India via the Account Aggregator framework. If yours isn't listed yet, search on signup — we add new connections every week as AA adoption grows." },
  { q: "How is FinCopilot different from other money apps?", a: "Three things: (1) the AI copilot — ask any money question in plain English (Hindi + English); (2) forecasts, not just history; (3) an interface that doesn't feel like a 2010 banking app." },
  { q: "Can I cancel anytime?", a: "Yes. One tap in settings. You keep your historical data and can export it as CSV." },
  { q: "Does it work for couples / shared finances?", a: "Pro plan includes shared household views. Multi-user with granular permissions is on the roadmap." },
  { q: "Why isn't FinCopilot free?", a: "Because we don't sell your data or show ads. Your subscription is our only revenue — which means our incentives stay aligned with yours. Read the full reasoning →" },
];

// Pricing tiers — amounts in ₹ INR, realistic for the Indian market.
export const pricingTiers = [
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
      "Android & iOS apps",
      "Community support",
    ],
  },
  {
    name: "Plus",
    monthly: 299,
    yearly: 199,
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
    monthly: 499,
    yearly: 299,
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

// Chat example chips used in the AI deepdive section.
export const chatExampleChips = [
  "How much did I spend on dining out last month?",
  "Can I afford a ₹40,000 vacation in August?",
  "What subscriptions am I paying for that I don't use?",
  "Find me ₹5,000 I can save this month.",
];

// Press / awards strip in the trust marquee.
export const pressLogos = [
  "TechCrunch",
  "YourStory",
  "Inc42",
  "The Ken",
  "ET Tech",
  "Product Hunt",
  "Forbes India",
  "Bloomberg Quint",
];

// Hero inline stats.
export const heroInlineStats = [
  { value: "₹2.4B+", label: "tracked" },
  { value: "250K+", label: "users" },
  { value: "4.9★", label: "Play Store" },
];

// Hero rotating phrases.
export const heroPhrases = [
  "intelligently organized.",
  "on autopilot.",
  "answered.",
];

// Insight cards (4 types) used in the AI deepdive section.
export const insightCards = [
  { type: "insight", title: "Dining", metric: "₹8,450", delta: "22% above 3-mo avg", chart: "bar", action: "Set a ₹7,000 budget" },
  { type: "forecast", title: "Vacation goal", metric: "Aug 14", delta: "At your current rate", chart: "forecast", action: "Create vacation goal", confidence: 92 },
  { type: "action", title: "Unused subscriptions", metric: "₹2,400/mo", chart: "list", action: "Cancel all",
    list: [
      { emoji: "🎬", name: "Streamly", price: "₹649" },
      { emoji: "💪", name: "FitForge", price: "₹1,199" },
      { emoji: "🍔", name: "BiteClub", price: "₹552" },
    ] },
  { type: "alert", title: "Unusual charge", metric: "₹1,200", delta: "3× your typical", chart: "alert", action: "Review" },
];

// Chart showcase items (6 chart types).
export const chartShowcaseItems = [
  { title: "Spending trend", subtitle: "30 days", chart: "area" as const },
  { title: "Net worth", subtitle: "12 months", chart: "line" as const },
  { title: "Monthly cash flow", subtitle: "12 months", chart: "bar" as const },
  { title: "Portfolio allocation", subtitle: "By asset class", chart: "donut" as const },
  { title: "Where it goes", subtitle: "By category", chart: "treemap" as const },
  { title: "Cash flow forecast", subtitle: "Next 90 days", chart: "combo" as const },
];

// Security items (4 trust pillars).
export const securityItems = [
  { iconKey: "ShieldCheck", title: "256-bit AES encryption", body: "Bank-grade encryption at rest and in transit." },
  { iconKey: "EyeOff", title: "Read-only access", body: "We can see your data. We cannot move your money. Ever." },
  { iconKey: "FileCheck", title: "RBI-regulated AA framework", body: "Consent is revocable. Data flows only with your explicit, audited permission." },
  { iconKey: "Lock", title: "We never sell your data", body: "Not to advertisers, not to anyone. Your data is yours." },
];

export const securityBadges = ["SOC 2 Type II", "ISO 27001", "AES-256", "Setu AA"];

// Stats for the trust marquee.
export const stats = [
  { value: 2.4, prefix: "₹", suffix: "B+", label: "money tracked", format: "currency" as const },
  { value: 250, suffix: "K+", label: "active users", format: "plain" as const },
  { value: 4.9, suffix: "★", label: "Play Store rating", format: "plain" as const },
  { value: 99.99, suffix: "%", label: "uptime", format: "percent" as const },
  { value: 0, label: "SOC 2 Type II certified", format: "text" as const, prefix: "" },
];

// Pain points (3 cards in the problem section).
export const painPoints = [
  { iconKey: "Wallet", title: "Scattered accounts", body: "Your money lives across 6+ apps. Net worth? A spreadsheet you update twice a year." },
  { iconKey: "Receipt", title: "Surprise charges", body: "That ₹999 annual fee hits like a jump scare. Subscriptions quietly drain ₹5,000+/month." },
  { iconKey: "HelpCircle", title: "No real answers", body: "Your bank shows transactions, not insight. 'Can I afford a vacation?' is a 20-minute calculation." },
];

// How it works (3 steps).
export const howItWorksSteps = [
  { iconKey: "Link", title: "Connect", body: "Securely link your banks via the RBI-regulated Account Aggregator framework (Setu). 300+ institutions supported." },
  { iconKey: "Tags", title: "Categorize", body: "FinCopilot AI auto-tags every transaction with smart, learning categories. No manual sorting, ever." },
  { iconKey: "Sparkles", title: "Copilot", body: "Ask anything. Get answers, forecasts, and one-tap actions — in plain English or Hindi." },
];

// Bento features (7 tiles).
export const bentoFeatures = [
  { iconKey: "Sparkles", title: "Ask your money anything.", body: "FinCopilot AI answers in plain English — with charts, forecasts, and one-tap actions.", cta: "Try a question", span: "lg:col-span-2 lg:row-span-2", hasChat: true },
  { iconKey: "PieChart", title: "Budgets that adapt to you.", body: "AI sets realistic budgets from your real spending, rolls over unspent amounts, and flags drift.", cta: "Track my spending" },
  { iconKey: "Wallet", title: "All your money, one number.", body: "Banks, cards, brokerage, crypto, real estate — aggregated and updated daily.", cta: "See my net worth" },
  { iconKey: "TrendingUp", title: "See 90 days ahead.", body: "AI projects your cash flow, predicts shortfalls, and surfaces safe-to-spend amounts.", cta: "Forecast my cash" },
  { iconKey: "Search", title: "Find the ₹5,000 you forgot.", body: "FinCopilot flags unused subscriptions and cancels them in one tap.", cta: "Manage my subscriptions" },
  { iconKey: "BarChart2", title: "Know if you're diversified.", body: "Allocation, risk, fees, and drift — explained without the jargon.", cta: "Analyze my portfolio", span: "lg:col-span-2" },
  { iconKey: "Bell", title: "We watch so you don't.", body: "Double charges, fraud spikes, unusual categories — pushed before you notice.", cta: "Set my alerts" },
];

// Footer columns.
export const footerColumns = [
  { title: "Product", links: ["Features", "Pricing", "Security", "Integrations", "Changelog"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Press", "Contact"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies", "Security overview", "Data promise"] },
];

// Nav links.
export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
  { label: "Security", href: "#security" },
];

// ---------- Chart datasets ----------
export const spendingAreaData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  spend: Math.round(4000 + Math.sin(i / 3) * 3000 + Math.random() * 3500 + i * 80),
}));

export const netWorthLineData = [
  { month: "Jan", value: 3800000 },
  { month: "Feb", value: 3820000 },
  { month: "Mar", value: 3850000 },
  { month: "Apr", value: 3880000 },
  { month: "May", value: 3910000 },
  { month: "Jun", value: 3930000 },
  { month: "Jul", value: 3950000 },
  { month: "Aug", value: 3970000 },
  { month: "Sep", value: 3990000 },
  { month: "Oct", value: 4000000 },
  { month: "Nov", value: 4010000 },
  { month: "Dec", value: 4021700 },
];

export const cashflowBarData = [
  { month: "Jan", income: 85000, expense: 65000 },
  { month: "Feb", income: 85000, expense: 68000 },
  { month: "Mar", income: 90000, expense: 64000 },
  { month: "Apr", income: 85000, expense: 70000 },
  { month: "May", income: 85000, expense: 72000 },
  { month: "Jun", income: 85000, expense: 66000 },
  { month: "Jul", income: 92000, expense: 65000 },
  { month: "Aug", income: 85000, expense: 69000 },
  { month: "Sep", income: 85000, expense: 67000 },
  { month: "Oct", income: 95000, expense: 71000 },
  { month: "Nov", income: 85000, expense: 65000 },
  { month: "Dec", income: 100240, expense: 75000 },
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
  { month: "Jul", actual: 3950000, projected: null, lower: null, upper: null },
  { month: "Aug", actual: 3970000, projected: null, lower: null, upper: null },
  { month: "Sep", actual: 3990000, projected: null, lower: null, upper: null },
  { month: "Oct", actual: 4000000, projected: null, lower: null, upper: null },
  { month: "Nov", actual: 4010000, projected: null, lower: null, upper: null },
  { month: "Dec", actual: 4021700, projected: 4021700, lower: 4021700, upper: 4021700 },
  { month: "Jan", actual: null, projected: 4050000, lower: 4030000, upper: 4070000 },
  { month: "Feb", actual: null, projected: 4080000, lower: 4050000, upper: 4110000 },
  { month: "Mar", actual: null, projected: 4120000, lower: 4080000, upper: 4160000 },
];
