"use client";
import { BalanceCard } from "@/components/shared/balance-card";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Flame, TrendingUp } from "lucide-react";
import { CountUp, Badge, SectionHeader } from "@/components/shared";
import { getMerchantStyle } from "@/lib/merchant-data";
import { formatPaise, timeAgo } from "@/lib/format";
import { api } from "@/lib/api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";
import { object, rows, amount, label } from "@/lib/response";
const dashboardSources = {
 home: api.getHomeState, transactions: () => api.getTransactions({limit:"5"}),
 insights: api.getAIHomeFeed, spending: api.getSpendingStory,
 game: api.getGamification, user: api.getMe, money: api.getMoneyState, income: api.getIncome,
};
async function loadDashboard() {
 const entries = Object.entries(dashboardSources);
 const results = await Promise.allSettled(entries.map(([,load]) => load()));
 const data: Record<string, any> = {};
 const failures: string[] = [];
 results.forEach((result,index) => {
   const key=entries[index][0];
   if(result.status==='fulfilled') data[key]=object(result.value);
   else { data[key]={}; failures.push(key); }
 });
 return {data,failures};
}
function MoneyValue({value,className}:{value:unknown;className?:string}) {
 const parsed=amount(value);
 return parsed===null ? <span className={className}>Unavailable</span> : <CountUp value={parsed} format={v=>formatPaise(Math.round(v))} className={className}/>;
}

function MerchantAvatar({ merchantName, size = 40 }: Readonly<{ merchantName: string; size?: number }>) {
  const style = getMerchantStyle(merchantName);
  return (
    <div className="rounded-[12px] flex items-center justify-center shrink-0 font-bold"
      style={{ width: size, height: size, background: style.bg, color: style.color, fontSize: size > 36 ? 14 : 12 }}>
      <span style={{ fontSize: size * 0.45 }}>{style.glyph}</span>
    </div>
  );
}

export default function HomePage() {
  const state=useResource(loadDashboard);
  if(!state.data) return <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>;

  const {data,failures}=state.data;
  const {home:rawHome, spending:rawSpending, game, user:rawUser, money, income}=data;
  const home:Record<string,unknown>={...object(money.net_position??{}),...object(rawHome.safe_to_spend??{}),
    this_month_spending_paise:object(rawSpending.spending??{}).effective_spending_paise,
    this_month_income_paise:object(income.income??{}).total_income_paise};
  const transactions=rows(data.transactions.transactions || []);
  const insights=rows(data.insights.feed || []);
  const spending={categories:rows(rawSpending.categories || [])};
  const user=Object.keys(object(rawUser.user??{})).length?object(rawUser.user??{}):rawUser;
  const firstName=label(user.display_name||user.email,'Your workspace').split(' ')[0];
  const sts=amount(home.safe_to_spend_paise);
  const stsColor=sts===null?'var(--text-secondary)':sts>0?'var(--accent)':'var(--warning)';
  const recentDebits=transactions.filter(tx=>tx.direction==='debit' && amount(tx.amount_paise)!==null);
  const peak=Math.max(1,...recentDebits.map(tx=>amount(tx.amount_paise)??0));

  return (
    <div className="flex flex-col gap-5 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center justify-between mb-1">
        <div>
          <h1 className="font-display font-bold text-[26px] tracking-[-0.02em] text-(--text)">Today at a glance</h1>
          <p className="text-[13px] text-(--text-secondary) mt-0.5">Manage your money, track spending, and plan ahead.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent to-(--gold) flex items-center justify-center text-accent-foreground font-bold text-[14px]">{firstName.charAt(0)}</div>
      </motion.div>

      {failures.length>0 && <div role="status" className="premium-card p-4 flex flex-wrap items-center justify-between gap-3 text-sm"><p>Some panels could not load: {failures.join(', ')}. Available records remain visible.</p><button onClick={state.reload} className="min-h-11 px-4 rounded-xl bg-(--surface-subtle) text-accent">Retry panels</button></div>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[{href:'/transactions',title:'Import a statement',description:'Bring your latest activity in'},{href:'/budgets',title:'Set a spending limit',description:'Give each category a plan'},{href:'/goals',title:'Build a milestone',description:'Save towards something meaningful'},{href:'/ai/chat',title:'Ask your copilot',description:'Explore your financial questions'}].map(action=><Link key={action.href} href={action.href} className="premium-card p-4 min-h-24 hover:border-accent transition-colors"><p className="font-semibold text-sm">{action.title}</p><p className="text-xs text-(--text-secondary) mt-2">{action.description}</p></Link>)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-2 bg-(--surface) border border-border rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="mb-5"><BalanceCard institution="Your money overview" amountPaise={amount(home.available_balance_paise)} accountType="All recorded accounts" href="/money" note="Based on imported records; opening balances are not included." /></div>
          <Link href="/data-coverage" className="inline-flex min-h-11 text-xs text-accent mb-2 items-center">Review data coverage</Link>
          <div className="flex gap-3 mb-5">
            <Link href="/transactions" className="px-4 py-2.5 rounded-[12px] bg-(--surface-subtle) border border-border text-[13px] font-semibold text-(--text-secondary) hover:bg-(--surface-hover) transition-colors">Import activity</Link>
            <Link href="/accounts" className="px-4 py-2.5 rounded-[12px] bg-linear-to-r from-accent to-(--accent-bright) text-accent-foreground text-[13px] font-semibold hover:shadow-[0_4px_20px_-4px_var(--accent-glow)] transition-shadow">Explore accounts</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-(--surface) border border-border rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col">
          <div className="flex items-center justify-between mb-3"><h3 className="text-[15px] font-semibold text-(--text)">Spending</h3><span className="text-[11px] text-(--text-muted) font-mono">This Month</span></div>
          <MoneyValue value={home.this_month_spending_paise} className="font-display font-bold text-[28px] tabular-nums tracking-[-0.02em] text-(--text)" />
          <p className="text-xs text-(--text-secondary) mt-2">Recorded spending after refunds and reversals.</p>
          <div className="mt-4 flex items-end gap-2 h-16" aria-label="Amounts of debit entries within your five most recent transactions">
            {recentDebits.length===0 && <p className="text-xs text-(--text-tertiary)">No recent debit entries to chart.</p>}
            {recentDebits.map((tx,i)=><div key={label(tx.transaction_id,String(i))} title={`${label(tx.merchant_name)}: ${formatPaise(amount(tx.amount_paise)??0)}`} className="flex-1 rounded-t-lg bg-linear-to-t from-accent to-(--accent-bright)" style={{height:`${Math.max(2,((amount(tx.amount_paise)??0)/peak)*100)}%`}}/>)}
          </div><p className="text-[10px] text-(--text-tertiary) mt-2">Debit entries in your latest five transactions</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="relative overflow-hidden rounded-[20px] p-5" style={{ background: `linear-gradient(135deg, ${stsColor} 0%, var(--surface-elevated) 60%, var(--gold) 100%)` }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <div className="relative">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} /><span className="text-[11px] font-mono uppercase tracking-[0.12em] text-white/70">Safe to Spend</span></div>
            <MoneyValue value={sts} className="font-display font-bold text-[36px] leading-none text-white tabular-nums tracking-[-0.03em] mt-2 block" />
            <p className="text-[12px] text-white/50 font-mono mt-1">Model estimate; review your forecast before deciding</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="bg-(--surface) border border-border rounded-[20px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-muted)">Income (mo)</span><div className="w-8 h-8 rounded-[10px] bg-(--success-light,rgba(5,150,105,0.12)) flex items-center justify-center"><TrendingUp className="w-4 h-4 text-(--success)" /></div></div>
          <MoneyValue value={home.this_month_income_paise} className="font-display font-bold text-[24px] tabular-nums tracking-[-0.02em] text-(--text)" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-linear-to-br from-(--accent-dim) to-(--gold-light) border border-border rounded-[20px] p-5">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-muted)">Your Streak</span><div className="w-8 h-8 rounded-[10px] bg-linear-to-br from-accent to-(--gold) flex items-center justify-center"><Flame className="w-4 h-4 text-accent-foreground" /></div></div>
          <p className="font-display font-bold text-[24px] tabular-nums tracking-[-0.02em] text-(--text)">{amount(game.tracking_streak_days)??"Unavailable"} days</p>
          <p className="text-[12px] text-(--text-secondary) mt-1">Level {amount(game.level)??"Unavailable"}: {label(game.level_name, "")}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }} className="lg:col-span-2">
          <SectionHeader title="Recent Transactions" action={<Link href="/transactions" className="text-[12px] font-medium text-accent hover:text-(--accent-bright)">View All →</Link>} />
          <div className="bg-(--surface) border border-border rounded-[20px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            {transactions.length === 0 && <div className="p-4 text-sm text-(--text-tertiary)">No recent transactions.</div>}
            {transactions.map((tx: any, i: number) => (
              <Link key={tx.transaction_id || i} href={`/transactions/${tx.transaction_id}`} className={`flex items-center gap-3 p-4 hover:bg-(--surface-subtle) transition-colors ${i !== transactions.length - 1 ? "border-b border-border" : ""}`}>
                <MerchantAvatar merchantName={label(tx.merchant_name)} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="text-[14px] font-semibold truncate text-(--text)">{label(tx.merchant_name)}</span>{tx.pending && <Badge label="Pending" variant="warning" />}</div>
                  <span className="text-[12px] text-(--text-secondary)">{label(tx.category)} · {timeAgo(label(tx.date || tx.observed_at,""))}</span>
                </div>
                <span className={`font-mono font-bold text-[14px] tabular-nums ${tx.direction === "credit" ? "text-(--success)" : "text-(--text)"}`}>{tx.direction === "credit" ? "+" : "−"}{formatPaise(amount(tx.amount_paise)??0, { style: "compact" })}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <SectionHeader title="AI Insight" />
          <div className="bg-(--surface) border border-border rounded-[20px] p-5 relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-(--accent-glow) opacity-20 blur-2xl pointer-events-none" />
            <div className="flex items-start gap-3 relative">
              <div className="w-10 h-10 rounded-[12px] bg-linear-to-br from-accent to-(--gold) flex items-center justify-center shrink-0"><Sparkles className="w-5 h-5 text-accent-foreground" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1"><h3 className="font-semibold text-[14px] text-(--text)">{label(insights[0]?.title,"Your next insight")}</h3></div>
                <p className="text-[13px] text-(--text-secondary) leading-normal">{label(insights[0]?.summary,failures.includes("insights")?"Insights could not load. Check AI consent in Privacy choices or retry.":"No insight is available yet. Explore your records with Copilot.")}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
        <SectionHeader title="Spending by Category" action={<Link href="/spending-story" className="text-[12px] font-medium text-accent">See All →</Link>} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {(spending.categories || []).length === 0 && <div className="text-sm text-(--text-tertiary)">Category breakdown is not available yet.</div>}
          {(spending.categories || []).slice(0, 8).map((cat: any, i: number) => (
            <motion.div key={cat.category || i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.6 + i * 0.05 }} className="bg-(--surface) border border-border rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex items-center gap-2 mb-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color || "var(--accent)" }} /><span className="text-[13px] font-medium text-(--text) truncate">{cat.category}</span></div>
              <p className="font-mono font-bold text-[16px] tabular-nums text-(--text)">{amount(cat.amount_paise)===null?"Unavailable":formatPaise(amount(cat.amount_paise)!)}</p>
              <span className="text-[11px] text-(--text-secondary)">{label(cat.record_count)} records</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
