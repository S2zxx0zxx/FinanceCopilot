"use client";

import * as React from "react";
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
        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Help & Support</h1>
        <p className="text-[14px] text-(--text-secondary) mt-1">Get help, manage your account, or contact support.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="premium-card p-6 flex flex-col gap-4">
          <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-subtle)] flex items-center justify-center text-[var(--accent)]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[16px]">Contact Support</h3>
            <p className="text-[13px] text-[var(--text-secondary)] mt-1">Need help with your account? Our support team is here to help.</p>
          </div>
          <button className="mt-2 px-4 py-2.5 rounded-[12px] bg-[var(--surface-subtle)] border border-[var(--border)] text-[13px] font-semibold hover:bg-[var(--surface-hover)] transition-colors self-start">
            Email Support
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
          <button className="mt-2 px-4 py-2.5 rounded-[12px] bg-[var(--surface-subtle)] border border-[var(--border)] text-[13px] font-semibold hover:bg-[var(--surface-hover)] transition-colors self-start">
            View Settings
          </button>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-[var(--border-subtle)]">
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
      </div>
    </div>
  );
}
