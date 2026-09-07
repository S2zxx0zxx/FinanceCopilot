"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { formatPaise, formatDate, categoryIcon } from "@/lib/format";
import { api } from "@/lib/api";

export default function TransactionsPage() {
  const [filter, setFilter] = React.useState("");
  const [txs, setTxs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    api.getTransactions()
      .then((res: any) => {
        if (!mounted) return;
        setTxs(res.transactions || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load transactions");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const filtered = txs.filter((t: any) => 
    t.merchant_name.toLowerCase().includes(filter.toLowerCase()) || 
    t.category.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-(--accent)" /></div>;
  }
  if (error) {
    return <div className="min-h-[50vh] flex items-center justify-center text-(--danger)">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Transactions</h1>
        <p className="text-[14px] text-(--text-secondary) mt-1">{filtered.length} transactions</p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-tertiary)" />
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search transactions..." className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] text-[14px] focus:border-[var(--accent)] outline-none transition-colors" />
      </div>
      <div className="premium-card overflow-hidden">
        {filtered.length === 0 && <div className="p-8 text-center text-(--text-tertiary)">No transactions found.</div>}
        {filtered.map((tx, i) => { 
          const isIncome = tx.direction === "credit"; 
          return (
            <Link key={tx.transaction_id} href={`/transactions/${tx.transaction_id}`} className={`flex items-center gap-3 p-4 hover:bg-(--surface-subtle) transition-colors ${i < filtered.length - 1 ? "border-b border-(--border-subtle)" : ""}`}>
              <div className="w-10 h-10 rounded-[10px] bg-[var(--surface-subtle)] flex items-center justify-center text-[16px] shrink-0">{categoryIcon(tx.category)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium truncate">{tx.merchant_name}</p>
                <p className="text-[12px] text-(--text-tertiary) capitalize">{tx.category} · {formatDate(tx.date || tx.observed_at)}{tx.pending && <span className="ml-1.5 text-(--warning)">· Pending</span>}</p>
              </div>
              <span className={`text-[14px] font-semibold tabular-nums shrink-0 ${isIncome ? "text-(--positive)" : ""}`}>{isIncome ? "+" : ""}{formatPaise(tx.amount_paise)}</span>
            </Link>
          ); 
        })}
      </div>
    </div>
  );
}
