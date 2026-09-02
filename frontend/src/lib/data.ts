// ============================================================================
// FinCopilot — Real Data Layer
// All money is integer paise (₹1 = 100 paise). Currency: INR.
// Indian context throughout. NOT fake — realistic mock data for development.
// ============================================================================

// ── Types ──────────────────────────────────────────────────────────────────

export type Paise = number; // branded number — money in paise

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  phone?: string;
  createdAt: string;
}

export interface Account {
  account_id: string;
  account_type: "savings" | "current" | "credit_card" | "loan" | "investment";
  institution_name: string;
  account_number_last4: string;
  balances: {
    available_balance_paise: number;
    posted_balance_paise: number;
    pending_balance_paise: number;
  };
  currency: "INR";
  is_active: boolean;
  last_synced_at: string;
}

export interface Transaction {
  transaction_id: string;
  account_id: string;
  merchant_name: string;
  category: string;
  subcategory?: string;
  amount_paise: number;       // negative = expense, positive = income
  direction: "debit" | "credit";
  date: string;               // ISO
  pending: boolean;
  source: "imported" | "manual" | "ai_inferred";
  confidence?: number;        // 0-1 for AI-inferred
  notes?: string;
}

export interface Goal {
  goal_id: string;
  name: string;
  goal_type: "emergency_fund" | "vacation" | "debt_payoff" | "save_home" | "retirement" | "custom";
  status: "in_progress" | "completed" | "paused";
  current_amount_paise: number;
  target_amount_paise: number;
  target_date: string;
  monthly_contribution_paise: number;
  pace: {
    progress_pct: number;
    status: "on_track" | "behind" | "completed" | "deadline_passed";
    remaining_days: number;
  };
}

export interface RecurringSeries {
  series_id: string;
  merchant_name: string;
  category: string;
  amount_paise: number;
  direction: "debit" | "credit";
  frequency: "weekly" | "monthly" | "quarterly" | "yearly";
  next_date: string;
  confidence: number;        // 0-1
  evidence_state: "USER_CONFIRMED" | "OBSERVED" | "INFERRED";
  status: "active" | "paused" | "ended" | "candidate";
  occurrences_count: number;
}

export interface AIInsight {
  insight_id: string;
  title: string;
  summary: string;
  tags: string[];
  confidence: number;        // 0-100
  generated_at: string;
  evidence: string;
  actions: { type: "link"; label: string; href: string }[];
}

export interface FinancialHealth {
  cash_buffer_months: number | null;
  cash_buffer_status: string;
  commitment_load_ratio: number | null;
  commitment_load_status: string;
  savings_rate_pct: number | null;
  savings_rate_status: string;
  emergency_fund_months: number | null;
  emergency_fund_status: string;
  drivers: Record<string, { reason: string }>;
}

// ── Current user ────────────────────────────────────────────────────────────

export const currentUser: User = {
  id: "usr_2k8f9a3",
  email: "arjun.sharma@fincopilot.in",
  displayName: "Arjun Sharma",
  photoURL: null,
  phone: "+91 98765 43210",
  createdAt: "2026-01-15T10:00:00Z",
};

// ── Helper: now and timestamps ───────────────────────────────────────────────

const now = new Date("2026-09-01T12:00:00Z");
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(now.getTime() + d * 86400000).toISOString();

// ── Accounts (4 accounts) ─────────────────────────────────────────────────────

export const accounts: Account[] = [
  {
    account_id: "acc_hdfc_sav",
    account_type: "savings",
    institution_name: "HDFC Bank",
    account_number_last4: "1234",
    balances: {
      available_balance_paise: 1845000,
      posted_balance_paise: 1850000,
      pending_balance_paise: -5000,
    },
    currency: "INR",
    is_active: true,
    last_synced_at: daysAgo(0),
  },
  {
    account_id: "acc_icici_cur",
    account_type: "current",
    institution_name: "ICICI Bank",
    account_number_last4: "5678",
    balances: {
      available_balance_paise: 652000,
      posted_balance_paise: 652000,
      pending_balance_paise: 0,
    },
    currency: "INR",
    is_active: true,
    last_synced_at: daysAgo(1),
  },
  {
    account_id: "acc_axis_cc",
    account_type: "credit_card",
    institution_name: "Axis Bank",
    account_number_last4: "9012",
    balances: {
      available_balance_paise: -45000,   // negative = owed
      posted_balance_paise: -45000,
      pending_balance_paise: 0,
    },
    currency: "INR",
    is_active: true,
    last_synced_at: daysAgo(2),
  },
  {
    account_id: "acc_zerodha_inv",
    account_type: "investment",
    institution_name: "Zerodha",
    account_number_last4: "3456",
    balances: {
      available_balance_paise: 1240000,
      posted_balance_paise: 1240000,
      pending_balance_paise: 0,
    },
    currency: "INR",
    is_active: true,
    last_synced_at: daysAgo(0),
  },
];

// ── Financial State: Home ─────────────────────────────────────────────────────

export const financialStateHome = {
  available_balance_paise: 2497000,    // ₹24,970 (sum of liquid accounts)
  currency: "INR",
  total_accounts: 4,
  synced_accounts: 3,
  this_month_spending_paise: 3420000,  // ₹34,200
  this_month_income_paise: 8500000,    // ₹85,000
  safe_to_spend_paise: 5080000,        // ₹50,800
  safe_to_spend_horizon: "this month",
  safe_to_spend_status: "safe",        // safe | moderate | tight
  safe_to_spend_freshness: "live",
  spending_change_pct: -8,             // 8% less than last month (positive direction)
  balance_change_pct: 3.2,
  recent_transactions: [] as Transaction[],
  top_categories: [
    { category: "Rent", amount_paise: 450000, pct_of_total: 26.3 },
    { category: "Groceries", amount_paise: 160000, pct_of_total: 9.4 },
    { category: "Dining", amount_paise: 84500, pct_of_total: 4.9 },
    { category: "Transport", amount_paise: 77500, pct_of_total: 4.5 },
    { category: "Shopping", amount_paise: 72000, pct_of_total: 4.2 },
  ],
  upcoming_commitments_count: 3,
  needs_attention: [
    {
      id: "att_1",
      type: "unusual_charge",
      title: "Unusual charge detected",
      description: "₹1,200 at Uber — 3× your typical ride cost.",
      severity: "warning",
      action_href: "/transactions",
      action_label: "Review",
    },
    {
      id: "att_2",
      type: "bill_due",
      title: "Axis credit card due in 3 days",
      description: "₹45,000 outstanding. Minimum due ₹2,250.",
      severity: "warning",
      action_href: "/liabilities",
      action_label: "View",
    },
  ],
  ai_insights: [] as AIInsight[],
};

// ── Financial State: Money ────────────────────────────────────────────────────

export const financialStateMoney = {
  net_position: {
    available_balance_paise: 2497000,
    posted_balance_paise: 2502000,
    pending_balance_paise: -5000,
    currency: "INR",
  },
  coverage: {
    total_accounts: 4,
    synced_accounts: 3,
  },
};

// ── Recent transactions (12) ───────────────────────────────────────────────────

export const recentTransactions: Transaction[] = [
  { transaction_id: "tx_001", account_id: "acc_hdfc_sav", merchant_name: "BigBasket", category: "Groceries", amount_paise: -3450, direction: "debit", date: daysAgo(0), pending: false, source: "imported" },
  { transaction_id: "tx_002", account_id: "acc_hdfc_sav", merchant_name: "Uber", category: "Transport", amount_paise: -1200, direction: "debit", date: daysAgo(0), pending: false, source: "imported", notes: "Unusual: 3× typical" },
  { transaction_id: "tx_003", account_id: "acc_icici_cur", merchant_name: "Salary — TechCorp", category: "Salary", amount_paise: 8500000, direction: "credit", date: daysAgo(1), pending: false, source: "imported" },
  { transaction_id: "tx_004", account_id: "acc_hdfc_sav", merchant_name: "Swiggy", category: "Dining", amount_paise: -680, direction: "debit", date: daysAgo(1), pending: false, source: "imported" },
  { transaction_id: "tx_005", account_id: "acc_axis_cc", merchant_name: "Netflix", category: "Subscriptions", amount_paise: -649, direction: "debit", date: daysAgo(2), pending: false, source: "imported" },
  { transaction_id: "tx_006", account_id: "acc_hdfc_sav", merchant_name: "Amazon Pay", category: "Shopping", amount_paise: -2400, direction: "debit", date: daysAgo(2), pending: false, source: "imported" },
  { transaction_id: "tx_007", account_id: "acc_hdfc_sav", merchant_name: "Rent — Landlord", category: "Rent", amount_paise: -450000, direction: "debit", date: daysAgo(3), pending: false, source: "imported" },
  { transaction_id: "tx_008", account_id: "acc_icici_cur", merchant_name: "Zomato", category: "Dining", amount_paise: -850, direction: "debit", date: daysAgo(3), pending: true, source: "imported" },
  { transaction_id: "tx_009", account_id: "acc_zerodha_inv", merchant_name: "Mutual Fund — SIP", category: "Investments", amount_paise: -100000, direction: "debit", date: daysAgo(4), pending: false, source: "imported" },
  { transaction_id: "tx_010", account_id: "acc_hdfc_sav", merchant_name: "Jio Recharge", category: "Utilities", amount_paise: -399, direction: "debit", date: daysAgo(4), pending: false, source: "imported" },
  { transaction_id: "tx_011", account_id: "acc_hdfc_sav", merchant_name: "BookMyShow", category: "Entertainment", amount_paise: -1200, direction: "debit", date: daysAgo(5), pending: false, source: "imported" },
  { transaction_id: "tx_012", account_id: "acc_icici_cur", merchant_name: "Cult.fit", category: "Subscriptions", amount_paise: -1199, direction: "debit", date: daysAgo(6), pending: false, source: "imported" },
];

financialStateHome.recent_transactions = recentTransactions.slice(0, 5);

// ── AI Insights ─────────────────────────────────────────────────────────────────

export const aiInsights: AIInsight[] = [
  {
    insight_id: "ins_001",
    title: "Subscription spend rising",
    summary: "Your subscription spend increased 22% this month, driven by 3 new recurring services.",
    tags: ["warning", "subscriptions"],
    confidence: 92,
    generated_at: daysAgo(0),
    evidence: "Found 3 new recurring payments totaling ₹2,400/month: Netflix ₹649, Cult.fit ₹1,199, Notion ₹552.",
    actions: [
      { type: "link", label: "Review Subscriptions", href: "/recurring" },
    ],
  },
  {
    insight_id: "ins_002",
    title: "Dining above your average",
    summary: "You spent ₹8,450 on dining this month — 22% above your 3-month average of ₹6,900.",
    tags: ["info", "dining"],
    confidence: 88,
    generated_at: daysAgo(1),
    evidence: "23 transactions across Swiggy, Zomato, and 4 restaurants. Largest: ₹1,850 at Theobroma.",
    actions: [
      { type: "link", label: "Set a ₹7,000 budget", href: "/plan" },
    ],
  },
];

financialStateHome.ai_insights = aiInsights.slice(0, 1);

// ── AI Home Feed ──────────────────────────────────────────────────────────────────

export const aiHomeFeed = {
  suggestions: [
    "How am I doing this month?",
    "Any money leaks I should know about?",
    "Can I afford a new phone?",
    "What if I save ₹5,000 more each month?",
  ],
  insights: aiInsights,
};

// ── Goals ────────────────────────────────────────────────────────────────────────

export const goals: Goal[] = [
  {
    goal_id: "goal_001",
    name: "Emergency Fund",
    goal_type: "emergency_fund",
    status: "in_progress",
    current_amount_paise: 5000000,     // ₹50,000
    target_amount_paise: 1500000,      // ₹1,50,000 (6 months expenses)
    target_date: "2026-12-31T00:00:00Z",
    monthly_contribution_paise: 50000,  // ₹500/month
    pace: { progress_pct: 33, status: "on_track", remaining_days: 120 },
  },
  {
    goal_id: "goal_002",
    name: "Goa Vacation",
    goal_type: "vacation",
    status: "in_progress",
    current_amount_paise: 2800000,      // ₹28,000
    target_amount_paise: 4000000,      // ₹40,000
    target_date: "2026-10-15T00:00:00Z",
    monthly_contribution_paise: 30000,  // ₹300/month
    pace: { progress_pct: 70, status: "on_track", remaining_days: 45 },
  },
  {
    goal_id: "goal_003",
    name: "New Laptop",
    goal_type: "custom",
    status: "in_progress",
    current_amount_paise: 750000,      // ₹7,500
    target_amount_paise: 1200000,      // ₹12,000
    target_date: "2026-11-30T00:00:00Z",
    monthly_contribution_paise: 20000,
    pace: { progress_pct: 62, status: "on_track", remaining_days: 90 },
  },
];

// ── Recurring series ─────────────────────────────────────────────────────────────

export const recurringSeries: RecurringSeries[] = [
  {
    series_id: "rec_001",
    merchant_name: "Netflix",
    category: "Subscriptions",
    amount_paise: 649,
    direction: "debit",
    frequency: "monthly",
    next_date: daysAhead(28),
    confidence: 0.98,
    evidence_state: "USER_CONFIRMED",
    status: "active",
    occurrences_count: 14,
  },
  {
    series_id: "rec_002",
    merchant_name: "Cult.fit",
    category: "Subscriptions",
    amount_paise: 1199,
    direction: "debit",
    frequency: "monthly",
    next_date: daysAhead(12),
    confidence: 0.95,
    evidence_state: "OBSERVED",
    status: "active",
    occurrences_count: 8,
  },
  {
    series_id: "rec_003",
    merchant_name: "Salary — TechCorp",
    category: "Salary",
    amount_paise: 8500000,
    direction: "credit",
    frequency: "monthly",
    next_date: daysAhead(29),
    confidence: 0.99,
    evidence_state: "USER_CONFIRMED",
    status: "active",
    occurrences_count: 18,
  },
  {
    series_id: "rec_004",
    merchant_name: "Rent — Landlord",
    category: "Rent",
    amount_paise: 450000,
    direction: "debit",
    frequency: "monthly",
    next_date: daysAhead(27),
    confidence: 0.97,
    evidence_state: "USER_CONFIRMED",
    status: "active",
    occurrences_count: 12,
  },
  {
    series_id: "rec_005",
    merchant_name: "Mutual Fund SIP",
    category: "Investments",
    amount_paise: 100000,
    direction: "debit",
    frequency: "monthly",
    next_date: daysAhead(5),
    confidence: 0.96,
    evidence_state: "USER_CONFIRMED",
    status: "active",
    occurrences_count: 11,
  },
  {
    series_id: "rec_006",
    merchant_name: "Jio Recharge",
    category: "Utilities",
    amount_paise: 399,
    direction: "debit",
    frequency: "monthly",
    next_date: daysAhead(20),
    confidence: 0.89,
    evidence_state: "OBSERVED",
    status: "active",
    occurrences_count: 6,
  },
];

// ── Upcoming commitments ────────────────────────────────────────────────────────

export const upcomingCommitments = [
  { id: "upc_1", merchant_name: "Mutual Fund SIP", amount_paise: 100000, due_date: daysAhead(5), category: "Investments" },
  { id: "upc_2", merchant_name: "Cult.fit", amount_paise: 1199, due_date: daysAhead(12), category: "Subscriptions" },
  { id: "upc_3", merchant_name: "Axis Credit Card", amount_paise: 45000, due_date: daysAhead(3), category: "Credit Card", severity: "high" },
];

// ── Financial Health ─────────────────────────────────────────────────────────────

export const financialHealth: FinancialHealth = {
  cash_buffer_months: 4.2,
  cash_buffer_status: "healthy",
  commitment_load_ratio: 0.28,
  commitment_load_status: "on_track",
  savings_rate_pct: 0.32,
  savings_rate_status: "healthy",
  emergency_fund_months: 3.5,
  emergency_fund_status: "on_track",
  drivers: {
    cash_buffer: { reason: "Your liquid savings cover 4.2 months of typical expenses." },
    commitment_load: { reason: "Fixed commitments are 28% of income — well within healthy range." },
    savings_rate: { reason: "You're saving 32% of income — above the 20% recommended minimum." },
    emergency_fund: { reason: "3.5 months of expenses saved — target is 6 months." },
  },
};

// ── Spending story (30-day breakdown by category) ──────────────────────────────

export const spendingStory = {
  period: "Last 30 days",
  total_spent_paise: 3420000,
  change_paise: -280000,   // ₹2,800 less than last month
  categories: [
    { category: "Rent", amount_paise: 450000, change_pct: 0, color: "var(--chart-2)" },
    { category: "Groceries", amount_paise: 160000, change_pct: 5, color: "var(--chart-1)" },
    { category: "Dining", amount_paise: 84500, change_pct: 22, color: "var(--chart-3)" },
    { category: "Transport", amount_paise: 77500, change_pct: -8, color: "var(--chart-4)" },
    { category: "Shopping", amount_paise: 72000, change_pct: 12, color: "var(--chart-5)" },
    { category: "Subscriptions", amount_paise: 31000, change_pct: 22, color: "var(--chart-1)" },
    { category: "Utilities", amount_paise: 45000, change_pct: -3, color: "var(--chart-3)" },
    { category: "Investments", amount_paise: 100000, change_pct: 0, color: "var(--chart-2)" },
  ],
};

// ── Income ────────────────────────────────────────────────────────────────────────

export const incomeData = {
  period: "This month",
  effective_income_paise: 8500000,
  month_over_month_change: 2.1,
  sources: [
    { source_name: "Salary — TechCorp", amount_paise: 8000000, is_recurring: true },
    { source_name: "Freelance — Design", amount_paise: 500000, is_recurring: false },
  ],
};

// ── Liabilities ──────────────────────────────────────────────────────────────────

export const liabilities = {
  total_paise: 45000,
  change_paise: 12000,    // increased
  accounts: [
    {
      account_id: "acc_axis_cc",
      type: "Credit Card",
      institution: "Axis Bank",
      balance_paise: 45000,
      min_due_paise: 2250,
      due_date: daysAhead(3),
      utilization_pct: 18,
    },
  ],
  upcoming: [
    { description: "Axis Credit Card minimum due", amount_paise: 2250, due_date: daysAhead(3) },
  ],
};

// ── Data coverage ─────────────────────────────────────────────────────────────────

export const dataCoverage = {
  coverage_pct: 0.85,
  total_accounts: 4,
  synced_accounts: 3,
  accounts: accounts.map(a => ({
    ...a,
    sync_status: a.last_synced_at.startsWith(daysAgo(0)) ? "LIVE" : a.last_synced_at.startsWith(daysAgo(1)) ? "RECENT" : "STALE",
  })),
};

// ── Privacy ──────────────────────────────────────────────────────────────────────

export const privacyData = {
  data_retention_days: 365,
  marketing_consent: false,
  analytics_consent: true,
  ai_sharing_consent: true,
  consent_history: [
    { id: "c_1", action: "Granted analytics consent", timestamp: daysAgo(230), type: "grant" },
    { id: "c_2", action: "Granted AI sharing consent", timestamp: daysAgo(225), type: "grant" },
    { id: "c_3", action: "Updated data retention to 365 days", timestamp: daysAgo(60), type: "update" },
  ],
  data_inventory: [
    { category: "Transaction data", description: "Your bank transactions, categorized", record_count: 1247 },
    { category: "Account balances", description: "Current and historical balances", record_count: 480 },
    { category: "AI insights", description: "Generated insights about your finances", record_count: 34 },
    { category: "Goals & budgets", description: "Your financial planning data", record_count: 3 },
  ],
};

// ── Security ─────────────────────────────────────────────────────────────────────

export const securityData = {
  security_score: 78,
  two_factor_enabled: true,
  active_sessions: [
    { id: "s_1", device: "iPhone 15 Pro", location: "Mumbai, IN", last_active: daysAgo(0), current: true },
    { id: "s_2", device: "MacBook Pro", location: "Mumbai, IN", last_active: daysAgo(2), current: false },
  ],
  recent_activity: [
    { type: "login", description: "Signed in on iPhone 15 Pro", timestamp: daysAgo(0) },
    { type: "password_change", description: "Password updated", timestamp: daysAgo(45) },
    { type: "login", description: "Signed in on MacBook Pro", timestamp: daysAgo(2) },
  ],
};

// ── Cashflow (12 months) ──────────────────────────────────────────────────────────

export const cashflowData = Array.from({ length: 12 }, (_, i) => {
  const monthDate = new Date(now);
  monthDate.setMonth(monthDate.getMonth() - (11 - i));
  return {
    month: monthDate.toLocaleString("en-IN", { month: "short" }),
    income: 80000 + Math.round(Math.random() * 10000) + (i === 11 ? 5000 : 0),
    expense: 30000 + Math.round(Math.random() * 8000),
  };
});

// ── Forecast (next 90 days) ───────────────────────────────────────────────────────

export const forecastData = {
  horizons: [
    { days: 7, label: "7 Days", projected_balance_paise: 2497000 + 50000, confidence: 0.94 },
    { days: 30, label: "30 Days", projected_balance_paise: 2497000 + 150000, confidence: 0.82 },
    { days: 90, label: "90 Days", projected_balance_paise: 2497000 + 420000, confidence: 0.68 },
  ],
  drivers: [
    { label: "Salary credit", impact_paise: 8500000, type: "positive" },
    { label: "Rent payment", impact_paise: -450000, type: "negative" },
    { label: "Subscription outflow", impact_paise: -31000, type: "negative" },
    { label: "SIP investment", impact_paise: -100000, type: "neutral" },
  ],
};
