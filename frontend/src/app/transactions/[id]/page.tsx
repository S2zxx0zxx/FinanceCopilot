"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api, ApiError } from "@/lib/api";

import { formatPaise, formatDate, categoryIcon } from "@/lib/format";
import { Badge, EmptyState } from "@/components/shared";
import type { Transaction } from "@/lib/data";

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [tx, setTx] = React.useState<Transaction | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .getTransactionDetail(id)
      .then((res: any) => {
        if (!mounted) return;
        const t: Transaction = res?.transaction || res?.data || res;
        setTx(t ?? null);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        setError(err instanceof ApiError ? err.message : "Transaction not found");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/transactions" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Transaction</h1>
        </div>
        <div className="premium-card p-6 flex items-center justify-center">
          <span className="w-6 h-6 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!tx || error) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/transactions" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Transaction</h1>
        </div>
        <EmptyState
          icon={<ArrowLeft className="w-8 h-8" strokeWidth={1.5} />}
          title="Not found"
          description={error || "We couldn't find this transaction."}
          action={
            <Link href="/transactions" className="mt-2 px-4 py-2 rounded-[10px] bg-accent text-accent-foreground text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors">
              Back to transactions
            </Link>
          }
        />
      </div>
    );
  }

  const isIncome = tx.direction === "credit";

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/transactions" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Transaction</h1>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-(--surface-subtle) flex items-center justify-center text-[32px]">{categoryIcon(tx.category)}</div>
        <p className="text-[18px] font-semibold">{tx.merchant_name}</p>
        <p className={`font-display font-bold text-[36px] tabular-nums ${isIncome ? "text-(--positive)" : ""}`}>{isIncome ? "+" : ""}{formatPaise(tx.amount_paise)}</p>
        <div className="flex items-center gap-2"><Badge label={tx.category} variant="neutral" />{tx.pending && <Badge label="Pending" variant="warning" />}</div>
      </motion.div>
      <div className="premium-card p-5 flex flex-col gap-3">
        <div className="flex justify-between"><span className="text-[13px] text-(--text-tertiary)">Date</span><span className="text-[13px] font-medium">{formatDate(tx.date, { style: "long" })}</span></div>
        <div className="flex justify-between"><span className="text-[13px] text-(--text-tertiary)">Category</span><span className="text-[13px] font-medium capitalize">{tx.category}</span></div>
        <div className="flex justify-between"><span className="text-[13px] text-(--text-tertiary)">Direction</span><span className="text-[13px] font-medium capitalize">{tx.direction}</span></div>
        <div className="flex justify-between"><span className="text-[13px] text-(--text-tertiary)">Source</span><span className="text-[13px] font-medium capitalize">{tx.source.replace("_", " ")}</span></div>
        {tx.notes && <div className="flex justify-between"><span className="text-[13px] text-(--text-tertiary)">Notes</span><span className="text-[13px] font-medium text-(--warning)">{tx.notes}</span></div>}
      </div>
    </div>
  );
}
