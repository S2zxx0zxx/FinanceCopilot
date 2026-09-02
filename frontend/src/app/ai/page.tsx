"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, MessageCircle, AlertTriangle, Wallet, TrendingUp } from "lucide-react";
import { SectionHeader, Badge } from "@/components/shared";
import { aiHomeFeed, aiInsights } from "@/lib/data";
import { timeAgo } from "@/lib/format";

export default function AIPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">AI</h1>
            <p className="text-[14px] text-[var(--text-secondary)]">Your financial intelligence hub</p>
          </div>
        </div>
      </motion.header>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Ask AI", href: "/ai/chat", icon: MessageCircle, desc: "Chat about your money" },
          { label: "Money Leaks", href: "/ai/leaks", icon: AlertTriangle, desc: "Find wasted spend" },
          { label: "Can I Afford", href: "/ai/afford", icon: Wallet, desc: "Check a purchase" },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className="premium-card p-5 flex flex-col gap-3 group hover:border-[var(--accent)] transition-colors">
              <div className="w-10 h-10 rounded-[12px] bg-[var(--accent-light)] flex items-center justify-center">
                <Icon className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold">{action.label}</h3>
                <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">{action.desc}</p>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* Suggested Questions */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <SectionHeader title="Try Asking" />
        <div className="flex flex-wrap gap-2">
          {aiHomeFeed.suggestions.map((suggestion, i) => (
            <Link key={i} href={`/ai/chat?q=${encodeURIComponent(suggestion)}`} className="px-4 py-2.5 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] text-[13px] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] transition-all">
              {suggestion}
            </Link>
          ))}
        </div>
      </motion.section>

      {/* AI Insights Feed */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <SectionHeader title="AI Insights" />
        <div className="flex flex-col gap-3">
          {aiInsights.map((insight, i) => (
            <Link key={insight.insight_id} href={`/ai/insight/${insight.insight_id}`} className="premium-card p-5 group hover:border-[var(--accent)]/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-semibold">{insight.title}</h3>
                    <Badge label={`${insight.confidence}%`} variant="ai" />
                  </div>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-[1.5] mb-2">{insight.summary}</p>
                  <div className="flex items-center gap-2">
                    {insight.tags.map((tag) => <Badge key={tag} label={tag} variant={tag === "warning" ? "warning" : "neutral"} />)}
                    <span className="text-[11px] text-[var(--text-tertiary)] ml-auto">{timeAgo(insight.generated_at)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
