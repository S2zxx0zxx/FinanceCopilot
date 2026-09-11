"use client";

import { BalanceCard } from "@/components/shared/balance-card";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";
import { object, rows, amount, label } from "@/lib/response";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared";
import { Sparkline } from "@/components/charts/sparkline";
import { formatPaise } from "@/lib/format";

// ── Helpers ───────────────────────────────────────────────────────────────────

function CurrencyNoteCard({ netWorth, posted, pending }: { netWorth: number | null; posted: number | null; pending: number | null; coverage: unknown }) {
  return <section><BalanceCard institution="Your financial overview" amountPaise={netWorth} accountType="All recorded accounts" href="/accounts"/><div className="grid grid-cols-2 gap-3 mt-4">{[{label:'Posted net activity',value:posted},{label:'Pending net activity',value:pending}].map(item=><div key={item.label} className="premium-card p-4"><p className="text-xs text-(--text-secondary)">{item.label}</p><p className="font-display text-lg sm:text-xl tabular-nums font-semibold mt-2 break-words">{item.value===null?'Unavailable':formatPaise(item.value)}</p></div>)}</div></section>;
}

function BankCard3D({ account }: { account: Record<string,unknown> }) {
  return <BalanceCard institution={label(account.institution_name)} amountPaise={amount(object(account.balances??{}).available_balance_paise)} lastFour={label(account.account_number_last4,'')} accountType={label(account.account_type)} href={`/accounts/${encodeURIComponent(label(account.account_id))}`} tone={account.account_type==='credit_card'?'plum':'midnight'}/>;
}
async function loadMoney() {
  const results = await Promise.allSettled([api.getMoneyState(),api.getAccounts(),api.getNetWorthHistory()]);
  const errors: string[]=[];
  const read=(index:number,name:string)=>{const result=results[index];if(result.status==='fulfilled')return object(result.value);errors.push(name);return {};};
  const money=read(0,'Money summary'); const accounts=read(1,'Accounts'); const history=read(2,'History');
  return {money,accounts:rows(accounts.accounts??[]),netWorthHistory:rows(history.history??[]),errors};
}

export default function MoneyPage() {
  const state=useResource(loadMoney);
  if(!state.data)return <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>;
  const data=state.data;
  const net=object(data.money.net_position??{});
  const coverage=data.money.coverage;
  const accounts=data.accounts;
  const nwHistory=data.netWorthHistory.filter(row=>amount(row.value)!==null);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Money</h1>
        <p className="text-[14px] text-(--text-secondary) mt-1">Your complete financial picture</p>
      </motion.header>

      {data.errors.length>0&&<div role="alert" className="premium-card p-4 text-sm"><p>Could not load: {data.errors.join(', ')}.</p><button onClick={state.reload} className="min-h-11 text-accent">Retry panels</button></div>}
      {/* 3D Currency Note Card */}
      <CurrencyNoteCard netWorth={amount(net.available_balance_paise)} posted={amount(net.posted_balance_paise)} pending={amount(net.pending_balance_paise)} coverage={coverage} />

      {/* Net Worth Trend mini chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="premium-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Net Worth Trend · 12 months</span>
          
        </div>
        <div className="h-20">
          {nwHistory.length>0?<Sparkline data={nwHistory.map(row=>amount(row.value)!/100)} color="var(--accent)" fill height={80}/>:<p className="text-sm text-(--text-secondary) py-4">No recorded history available yet.</p>}
        </div>
      </motion.div>

      {nwHistory.length>0&&<details className="premium-card p-4"><summary className="cursor-pointer min-h-11 text-sm font-medium">View chart values</summary><ul className="grid sm:grid-cols-2 gap-3 mt-3">{nwHistory.map((row,index)=><li key={index} className="flex justify-between gap-3 text-xs"><span>{label(row.month)}</span><span className="font-mono">{formatPaise(amount(row.value)!)}</span></li>)}</ul></details>}
      {/* Connected Accounts — 3 per row with 3D bank cards */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <SectionHeader title="Connected Accounts" action={<Link href="/accounts" className="text-[12px] font-medium text-accent hover:text-(--accent-hover) flex items-center gap-1 transition-colors">View All <ArrowRight className="w-3.5 h-3.5" /></Link>} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {accounts.length === 0 && <div className="text-sm text-(--text-tertiary) p-2">No connected accounts.</div>}
          {accounts.map((acc: any) => <BankCard3D key={acc.account_id} account={acc} />)}
        </div>
      </motion.section>

      {/* Quick Links — compact grid */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Income", href: "/income", icon: "💰", desc: "Sources & trends" },
          { label: "Liabilities", href: "/liabilities", icon: "📋", desc: "What you owe" },
          { label: "Spending Story", href: "/spending-story", icon: "📊", desc: "By category" },
          { label: "Transactions", href: "/transactions", icon: "🔍", desc: "All activity" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="premium-card p-4 flex flex-col gap-1.5 group hover:border-accent transition-colors">
            <span className="text-[22px]">{item.icon}</span>
            <span className="text-[13px] font-semibold">{item.label}</span>
            <span className="text-[11px] text-(--text-tertiary)">{item.desc}</span>
          </Link>
        ))}
      </motion.section>
    </div>
  );
}
