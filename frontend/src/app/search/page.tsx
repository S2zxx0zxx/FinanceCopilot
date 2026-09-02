"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ArrowLeft, X, TrendingUp, Wallet, Target,
  Clock, Sparkles, ArrowUpRight,
} from "lucide-react";
import { recentTransactions, accounts, goals } from "@/lib/data";
import { formatPaise, formatDate, timeAgo, categoryIcon } from "@/lib/format";
import { Badge, EmptyState } from "@/components/shared";

const SUGGESTED_SEARCHES = [
  "BigBasket",
  "Salary",
  "Netflix",
  "HDFC Bank",
  "Emergency Fund",
  "Zerodha",
  "Swiggy",
  "SIP",
];

export default function SearchPage() {
  const [query, setQuery] = React.useState("");
  const [recent, setRecent] = React.useState<string[]>([
    "Netflix",
    "HDFC Bank",
    "Emergency Fund",
  ]);
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Autofocus on mount
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const q = query.trim().toLowerCase();

  const results = React.useMemo(() => {
    if (!q) return { transactions: [], accounts: [], goals: [], total: 0 };

    const tx = recentTransactions.filter(
      (t) =>
        t.merchant_name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.subcategory?.toLowerCase().includes(q) ?? false) ||
        (t.notes?.toLowerCase().includes(q) ?? false),
    );

    const accts = accounts.filter(
      (a) =>
        a.institution_name.toLowerCase().includes(q) ||
        a.account_type.toLowerCase().includes(q) ||
        a.account_number_last4.includes(q),
    );

    const gls = goals.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.goal_type.toLowerCase().includes(q),
    );

    return {
      transactions: tx,
      accounts: accts,
      goals: gls,
      total: tx.length + accts.length + gls.length,
    };
  }, [q]);

  const hasQuery = q.length > 0;
  const noResults = hasQuery && results.total === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && !recent.includes(trimmed)) {
      setRecent((r) => [trimmed, ...r].slice(0, 6));
    }
    inputRef.current?.blur();
  };

  const quickSearch = (term: string) => {
    setQuery(term);
    if (!recent.includes(term)) {
      setRecent((r) => [term, ...r].slice(0, 6));
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* ── Header with back button ──────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <Link
          href="/"
          aria-label="Back home"
          className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-subtle)] transition-colors shrink-0"
        >
          <ArrowLeft className="w-[18px] h-[18px]" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Search</h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Transactions, accounts, and goals
          </p>
        </div>
      </motion.header>

      {/* ── Search bar ──────────────────────────────────────── */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className={`relative flex items-center gap-3 rounded-[16px] border bg-[var(--surface)] transition-all duration-300`}
        style={{
          borderColor: focused
            ? "var(--accent)"
            : "var(--border)",
          boxShadow: focused
            ? "0 0 0 4px var(--accent-glow), var(--shadow-sm)"
            : "var(--shadow-sm)",
        }}
      >
        <div className="pl-4 flex items-center justify-center text-[var(--text-tertiary)]">
          <Search className="w-[18px] h-[18px]" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search transactions, accounts, goals…"
          aria-label="Search"
          className="flex-1 bg-transparent border-0 outline-none text-[15px] font-medium py-3.5 placeholder:text-[var(--text-muted)]"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="mr-2 w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <kbd className="hidden sm:flex items-center mr-3 px-1.5 h-5 rounded-[6px] bg-[var(--surface-subtle)] text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
          ⌘K
        </kbd>
      </motion.form>

      {/* ── Body ──────────────────────────────────────────── */}
      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          {/* Empty query → suggested + recent */}
          {!hasQuery && (
            <motion.div
              key="suggested"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              {/* Recent searches */}
              {recent.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                    <h2 className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                      Recent searches
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((term, i) => (
                      <motion.button
                        key={term}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        onClick={() => quickSearch(term)}
                        className="premium-card px-3.5 py-2 text-[13px] font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors flex items-center gap-2"
                      >
                        <span className="text-[var(--text-tertiary)]">↺</span>
                        {term}
                      </motion.button>
                    ))}
                  </div>
                </section>
              )}

              {/* Suggested searches */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <h2 className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                    Try searching for
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_SEARCHES.map((term, i) => (
                    <motion.button
                      key={term}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
                      onClick={() => quickSearch(term)}
                      className="px-3.5 py-2 rounded-[10px] bg-[var(--accent-light)] text-[var(--accent)] text-[13px] font-medium hover:bg-[var(--accent)] hover:text-white transition-colors"
                    >
                      {term}
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* Quick links */}
              <section className="grid grid-cols-3 gap-3 mt-2">
                {[
                  { label: "Transactions", href: "/transactions", icon: TrendingUp },
                  { label: "Accounts", href: "/accounts", icon: Wallet },
                  { label: "Goals", href: "/goals", icon: Target },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                    >
                      <Link
                        href={item.href}
                        className="premium-card p-4 flex flex-col items-start gap-2 group hover:border-[var(--accent)] transition-colors h-full"
                      >
                        <div className="w-9 h-9 rounded-[10px] bg-[var(--surface-subtle)] flex items-center justify-center text-[var(--text-secondary)] group-hover:bg-[var(--accent-light)] group-hover:text-[var(--accent)] transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </section>
            </motion.div>
          )}

          {/* No results */}
          {noResults && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <EmptyState
                icon={<Search className="w-8 h-8" strokeWidth={1.5} />}
                title={`No results for "${query.trim()}"`}
                description="Try a different keyword or check spelling. You can search by merchant, category, account, or goal name."
              />
            </motion.div>
          )}

          {/* Results */}
          {hasQuery && results.total > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <p className="text-[12px] text-[var(--text-tertiary)] font-mono">
                {results.total} {results.total === 1 ? "result" : "results"} for
                <span className="text-[var(--foreground)] font-medium"> "{query.trim()}"</span>
              </p>

              {/* Transactions group */}
              {results.transactions.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                    <h2 className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                      Transactions
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
                      {results.transactions.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {results.transactions.map((tx, i) => {
                      const isIncome = tx.direction === "credit";
                      return (
                        <motion.div
                          key={tx.transaction_id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.04 }}
                        >
                          <Link
                            href={`/transactions/${tx.transaction_id}`}
                            className="premium-card p-3.5 flex items-center gap-3 group hover:border-[var(--accent)] transition-colors"
                          >
                            <div className="w-10 h-10 rounded-[10px] bg-[var(--surface-subtle)] flex items-center justify-center text-[16px] shrink-0">
                              {categoryIcon(tx.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-medium truncate">
                                {tx.merchant_name}
                              </p>
                              <p className="text-[12px] text-[var(--text-tertiary)] truncate">
                                {tx.category} · {formatDate(tx.date, { style: "relative" })}
                                {tx.pending && (
                                  <span className="text-[var(--warning)]"> · Pending</span>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`text-[14px] font-semibold tabular-nums ${
                                  isIncome ? "text-[var(--positive)]" : "text-[var(--foreground)]"
                                }`}
                              >
                                {isIncome ? "+" : ""}
                                {formatPaise(tx.amount_paise)}
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" />
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Accounts group */}
              {results.accounts.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                    <h2 className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                      Accounts
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
                      {results.accounts.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {results.accounts.map((acc, i) => (
                      <motion.div
                        key={acc.account_id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                      >
                        <Link
                          href={`/accounts/${acc.account_id}`}
                          className="premium-card p-3.5 flex items-center gap-3 group hover:border-[var(--accent)] transition-colors"
                        >
                          <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[var(--accent-light)] to-[var(--gold-light)] flex items-center justify-center shrink-0">
                            <Wallet className="w-[18px] h-[18px] text-[var(--accent)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium truncate">
                              {acc.institution_name}
                            </p>
                            <p className="text-[12px] text-[var(--text-tertiary)] truncate">
                              {acc.account_type.replace("_", " ")} ····{acc.account_number_last4}
                              <span className="ml-1.5">· synced {timeAgo(acc.last_synced_at)}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[14px] font-semibold tabular-nums">
                              {formatPaise(acc.balances.available_balance_paise, { style: "compact" })}
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Goals group */}
              {results.goals.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                    <h2 className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                      Goals
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
                      {results.goals.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {results.goals.map((goal, i) => (
                      <motion.div
                        key={goal.goal_id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                      >
                        <Link
                          href={`/goals/${goal.goal_id}`}
                          className="premium-card p-3.5 flex items-center gap-3 group hover:border-[var(--accent)] transition-colors"
                        >
                          <div className="w-10 h-10 rounded-[10px] bg-[var(--accent-light)] flex items-center justify-center shrink-0">
                            <Target className="w-[18px] h-[18px] text-[var(--accent)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-[14px] font-medium truncate">{goal.name}</p>
                              <Badge label={goal.goal_type.replace(/_/g, " ")} variant="neutral" />
                            </div>
                            <p className="text-[12px] text-[var(--text-tertiary)] truncate">
                              {formatPaise(goal.current_amount_paise)} of {formatPaise(goal.target_amount_paise)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[14px] font-semibold tabular-nums">
                              {goal.pace.progress_pct}%
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
