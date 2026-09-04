"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { api, ApiError } from "@/lib/api";

import { Badge, EmptyState } from "@/components/shared";
import { timeAgo } from "@/lib/format";

type InsightAction = { label: string; href: string };
type Insight = {
  insight_id: string;
  title: string;
  summary: string;
  evidence?: string;
  confidence: number;
  generated_at: string;
  tags?: string[];
  actions?: InsightAction[];
};

export default function InsightDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [insight, setInsight] = React.useState<Insight | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .getAIInsight(id)
      .then((res: any) => {
        if (!mounted) return;
        const i: Insight = res?.insight || res?.data || res;
        setInsight(i ?? null);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        setError(err instanceof ApiError ? err.message : "Insight not found");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <header className="flex items-center gap-3">
        <Link href="/ai" className="w-9 h-9 rounded-[10px] flex items-center justify-center border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-[10px] bg-linear-to-br from-accent to-(--gold) flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#0A0F0D]" />
          </div>
          <div>
            <h1 className="font-display font-bold text-[18px] leading-tight">AI Insight</h1>
            {insight && (
              <p className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Generated {timeAgo(insight.generated_at)}
              </p>
            )}
          </div>
        </div>
      </header>

      {loading && (
        <div className="premium-card p-6 flex items-center justify-center">
          <span className="w-6 h-6 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
        </div>
      )}

      {!loading && (!insight || error) && (
        <EmptyState
          icon={<ArrowLeft className="w-8 h-8" strokeWidth={1.5} />}
          title="Not found"
          description={error || "We couldn't find this insight."}
          action={
            <Link href="/ai" className="mt-2 px-4 py-2 rounded-[10px] bg-accent text-accent-foreground text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors">
              Back to AI
            </Link>
          }
        />
      )}

      {!loading && insight && (
        <>
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="premium-card p-6 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-[20px] leading-tight">{insight.title}</h2>
              <Badge label={`${insight.confidence}% conf`} variant="ai" />
            </div>
            <p className="text-[15px] text-(--text-secondary) leading-[1.6]">{insight.summary}</p>
            {insight.tags && insight.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {insight.tags.map((tag) => (
                  <Badge key={tag} label={tag} variant={tag === "warning" ? "warning" : "neutral"} />
                ))}
              </div>
            )}
          </motion.section>

          {insight.evidence && (
            <section className="premium-card p-6 flex flex-col gap-3">
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Evidence</h3>
              <p className="text-[14px] text-(--text-secondary) leading-[1.6]">{insight.evidence}</p>
            </section>
          )}

          {insight.actions && insight.actions.length > 0 && (
            <section className="flex flex-col gap-3">
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Suggested actions</h3>
              {insight.actions.map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="premium-card p-4 flex items-center justify-between group hover:border-[var(--border-strong)] transition-colors"
                >
                  <span className="text-[14px] font-medium">{action.label}</span>
                  <span className="text-[12px] text-accent group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
              ))}
            </section>
          )}

          <p className="text-center text-[11px] text-[var(--text-muted)] mt-4">
            This insight was generated by FinCopilot AI. Always review before taking action.
          </p>
        </>
      )}
    </div>
  );
}
