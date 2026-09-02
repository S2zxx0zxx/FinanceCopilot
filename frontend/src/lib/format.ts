// Currency + date formatting helpers
// All money is integer paise (₹1 = 100 paise). Indian number system (lakhs).

export function formatPaise(paise: number | null | undefined, opts?: { style?: "full" | "compact" | "signed" }): string {
  if (paise == null || Number.isNaN(Number(paise))) return "—";
  const rupees = Number(paise) / 100;
  const sign = rupees < 0 ? "−" : opts?.style === "signed" && rupees > 0 ? "+" : "";
  const abs = Math.abs(rupees);
  if (opts?.style === "compact") {
    if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
    if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`;
    if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`;
    return `${sign}₹${abs.toFixed(0)}`;
  }
  return `${sign}₹${abs.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function formatDate(iso: string | null | undefined, opts?: { style?: "short" | "long" | "relative" }): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (opts?.style === "relative") return timeAgo(iso);
  if (opts?.style === "long") return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export function formatPct(value: number | null | undefined, opts?: { decimals?: number }): string {
  if (value == null) return "—";
  const pct = typeof value === "number" && value < 1 ? value * 100 : value;
  return `${pct.toFixed(opts?.decimals ?? 0)}%`;
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

export function categoryIcon(category: string): string {
  const icons: Record<string, string> = {
    "Rent": "🏠",
    "Groceries": "🛒",
    "Dining": "🍽️",
    "Transport": "🚗",
    "Shopping": "🛍️",
    "Subscriptions": "📺",
    "Entertainment": "🎬",
    "Utilities": "💡",
    "Investments": "📈",
    "Salary": "💰",
    "Health": "🏥",
    "Education": "📚",
    "Travel": "✈️",
    "Insurance": "🛡️",
    "Credit Card": "💳",
    "Refunds": "↩️",
  };
  return icons[category] || "💸";
}
