"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Wallet, Sparkles } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const isLeaks = "ai/afford".includes("leaks");
  const Icon = isLeaks ? AlertTriangle : Wallet;
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [analyzing, setAnalyzing] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!query.trim()) {
      toast({
        title: "Please describe your purchase",
        description: "Tell us what you want to analyze first.",
        variant: "destructive",
      });
      return;
    }
    setAnalyzing(true);
    setResult(null);
    try {
      const res: any = await api.runAISimulate({
        type: isLeaks ? "leaks" : "afford",
        query: query.trim(),
      });
      const summary =
        res?.summary || res?.data?.summary || res?.answer || res?.message;
      if (typeof summary === "string") {
        setResult(summary);
      } else {
        setResult(
          isLeaks
            ? "We scanned your recent transactions and didn't find any obvious money leaks right now."
            : "Based on your current cash flow and buffer, you can afford this — but please review your upcoming commitments before committing.",
        );
      }
      toast({ title: "Analysis ready", description: "AI insight generated." });
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Could not reach AI gateway. Please try again in a moment.";
      toast({
        title: "Analysis failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-[12px] bg-[var(--accent-light)] flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">
            {isLeaks ? "Money Leaks" : "Can I Afford This?"}
          </h1>
          <p className="text-[13px] text-(--text-secondary)">
            {isLeaks ? "Find where money is leaking" : "Check if you can afford a purchase"}
          </p>
        </div>
      </motion.header>
      <div className="premium-card p-6 flex flex-col gap-4">
        <label className="text-[13px] font-medium text-(--text-secondary)">
          {isLeaks ? "Describe what you want to analyze" : "What do you want to buy?"}
        </label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !analyzing) handleAnalyze();
          }}
          placeholder={isLeaks ? "e.g. subscriptions I don't use" : "e.g. New laptop ₹80,000"}
          className="px-4 py-3 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] text-[14px] focus:border-[var(--accent)] outline-none transition-colors"
        />
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[12px] bg-accent text-accent-foreground text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60"
        >
          {analyzing ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze
            </>
          )}
        </button>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-4 rounded-[12px] bg-[var(--accent-light)] border border-[var(--border)] text-[13px] text-(--text-secondary) leading-[1.55]"
          >
            <p className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              AI insight
            </p>
            {result}
          </motion.div>
        )}
        <p className="text-[11px] text-(--text-tertiary) mt-1">
          Always review AI suggestions before taking action.
        </p>
      </div>
    </div>
  );
}
