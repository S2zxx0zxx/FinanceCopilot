"use client";

import * as React from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, HelpCircle, FileText, Settings, Loader2 } from "lucide-react";

export default function HelpPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handleSeedData = async () => {
    setLoading(true);
    try {
      await api.seedDemoData();
      toast({
        title: "Demo Data Seeded",
        description: "Successfully seeded 6 months of data to your account.",
      });
      // Refresh the page so the app re-fetches the new data
      setTimeout(() => window.location.assign("/"), 1500);
    } catch (err: any) {
      toast({
        title: "Error seeding data",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Help & guidance</h1>
        <p className="text-[14px] text-(--text-secondary) mt-1">Get help, manage your account, or contact support.</p>
      </div>

      <section className="premium-card p-5 sm:p-6"><h2 className="font-display text-xl font-semibold">A clear path through your workspace</h2><div className="mt-4 divide-y divide-(--border)">{[
        {title:'How do I add my financial history?',body:'Create an account in Account vault, select it in Activity journal and upload a CSV or PDF statement up to 10 MB. Uploading queues processing; it does not mean the records are ready.',href:'/transactions',action:'Open statement imports'},
        {title:'Why is my recorded amount different from my bank balance?',body:'Recorded net activity reflects imported transactions. Opening balances, missing statements and transactions awaiting review can affect what you see.',href:'/data-coverage',action:'Review data coverage'},
        {title:'How do I set a monthly spending limit?',body:'Open Spending guardrails, choose a category and enter its monthly limit in rupees. You can update an existing category limit with the same form.',href:'/budgets',action:'Manage spending limits'},
        {title:'Where can I manage my sign-in and privacy?',body:'Security center shows provider sessions and opens your account sign-in controls. Privacy choices lets you review and update processing consent.',href:'/you/security',action:'Open security center'}
      ].map(guide=><details key={guide.title} className="py-4"><summary className="min-h-11 cursor-pointer font-medium text-sm flex items-center">{guide.title}</summary><p className="text-sm text-(--text-secondary) leading-relaxed mt-2">{guide.body}</p><Link href={guide.href} className="text-accent inline-flex items-center min-h-11 mt-2 text-sm">{guide.action}</Link></details>)}</div></section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="premium-card p-6 flex flex-col gap-4">
          <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-subtle)] flex items-center justify-center text-[var(--accent)]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[16px]">Contact Support</h3>
            <p className="text-[13px] text-[var(--text-secondary)] mt-1">Need help with your account? Save a description of the issue to share with your support contact.</p>
          </div>
          <button onClick={async()=>{try{await navigator.clipboard.writeText('FinanceCopilot support request\nScreen: '+window.location.pathname+'\nWhat happened: \nWhat I expected: \nDo not include passwords, bank credentials or statement contents.');toast({title:'Issue template copied'});}catch{toast({title:'Clipboard unavailable',description:'Describe the screen, what happened and what you expected.',variant:'destructive'});}}} className="mt-2 px-4 py-2.5 rounded-[12px] bg-[var(--surface-subtle)] border border-[var(--border)] text-[13px] font-semibold hover:bg-[var(--surface-hover)] transition-colors self-start">
            Copy an issue template
          </button>
        </div>

        <div className="premium-card p-6 flex flex-col gap-4">
          <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-subtle)] flex items-center justify-center text-[var(--success)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[16px]">Privacy & Security</h3>
            <p className="text-[13px] text-[var(--text-secondary)] mt-1">Learn how we protect your data and manage your privacy preferences.</p>
          </div>
          <Link href="/you/privacy" className="mt-2 px-4 py-2.5 rounded-[12px] bg-[var(--surface-subtle)] border border-[var(--border)] text-[13px] font-semibold hover:bg-[var(--surface-hover)] transition-colors self-start">
            View Settings
          </Link>
        </div>
      </div>

      {process.env.NODE_ENV === "development" && <div className="mt-8 pt-8 border-t border-[var(--border-subtle)]">
        <h2 className="font-semibold text-[18px] mb-4 text-(--warning)">Developer Actions</h2>
        <div className="premium-card p-6 flex flex-col gap-4 border-(--warning)">
          <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-subtle)] flex items-center justify-center text-[var(--warning)]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[16px]">Demo Data Management</h3>
            <p className="text-[13px] text-[var(--text-secondary)] mt-1">
              Click this button to instantly seed 6 months of realistic transactions, accounts, and budgets into your current Clerk account.
            </p>
          </div>
          <button
            onClick={handleSeedData}
            disabled={loading}
            className="mt-2 px-4 py-2.5 rounded-[12px] bg-[var(--warning)] text-white text-[13px] font-semibold hover:brightness-110 transition-colors self-start flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Seed Test Data"}
          </button>
        </div>
      </div>}
    </div>
  );
}
