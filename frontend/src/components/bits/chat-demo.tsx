"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Send } from "lucide-react";
import { useChatCycle } from "@/lib/use-chat-cycle";
import { chatExamples, chatPlaceholders } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

interface ChatDemoProps {
  variant?: "hero" | "compact" | "full";
  autoCycle?: boolean;
  cycleMs?: number;
  className?: string;
}

const heights: Record<NonNullable<ChatDemoProps["variant"]>, string> = {
  compact: "h-[280px]",
  full: "h-[520px]",
  hero: "h-[340px]",
};

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function ChatDemo({
  variant = "hero",
  autoCycle = true,
  cycleMs = 8500,
  className,
}: ChatDemoProps) {
  const { activeIndex, phase, next, setPhase } = useChatCycle();
  const [typedAnswer, setTypedAnswer] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const example = chatExamples[activeIndex];

  // Auto-cycle
  useEffect(() => {
    if (!autoCycle) return;
    let mounted = true;

    const run = async () => {
      setPhase("question");
      setTypedAnswer("");
      await wait(2500);
      if (!mounted) return;
      setPhase("typing");
      await wait(1400);
      if (!mounted) return;
      setPhase("answer");
      // type out answer
      let i = 0;
      const interval = setInterval(() => {
        i += 2;
        setTypedAnswer(example.a.slice(0, i));
        if (i >= example.a.length) clearInterval(interval);
      }, 18);
      await wait(cycleMs - 2500 - 1400);
      if (!mounted) return;
      next();
    };
    run();
    return () => {
      mounted = false;
    };
  }, [activeIndex, autoCycle, cycleMs, example.a, next, setPhase]);

  // Placeholder rotation
  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % chatPlaceholders.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "glass-card flex flex-col overflow-hidden rounded-[16px]",
        heights[variant],
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[6px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-[#0A0F0D]" />
          </div>
          <span className="font-display font-bold text-[13px]">FinCopilot</span>
          <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--surface-3)] text-[var(--text-secondary)]">
            AI
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
          <span className="text-[10px] font-mono text-[var(--text-muted)]">online</span>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-hidden px-3 py-3 flex flex-col gap-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            {/* User bubble */}
            <div className="self-end max-w-[80%]">
              <div className="bg-[var(--accent)] text-[#0A0F0D] rounded-[14px] rounded-tr-[4px] px-3 py-2 text-[12px] font-medium">
                {example.q}
              </div>
            </div>
            {/* AI bubble */}
            <div className="self-start max-w-[85%]">
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[14px] rounded-tl-[4px] px-3 py-2 text-[12px] text-[var(--text)] leading-relaxed">
                {phase === "typing" && (
                  <div className="flex items-center gap-1 py-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]"
                        style={{ animation: `bounce-dot 1.4s ease-in-out ${i * 0.16}s infinite` }}
                      />
                    ))}
                  </div>
                )}
                {phase === "answer" && (
                  <span>
                    {typedAnswer}
                    <span className="inline-block w-1.5 h-3 bg-[var(--accent)] ml-0.5 align-middle" style={{ animation: "blink 1s step-end infinite" }} />
                  </span>
                )}
                {phase === "question" && <span className="text-[var(--text-muted)]">…</span>}
              </div>
              {phase === "answer" && typedAnswer.length >= example.a.length - 2 && (
                <ResponseCard card={example.card} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div className="border-t border-[var(--border)] bg-[var(--surface)]/40 p-2.5">
        <div className="flex items-center gap-2 bg-[var(--surface-3)] rounded-[10px] px-3 py-2">
          <AnimatePresence mode="wait">
            <motion.span
              key={placeholderIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 text-[12px] text-[var(--text-muted)]"
            >
              {chatPlaceholders[placeholderIdx]}
            </motion.span>
          </AnimatePresence>
          <button className="w-7 h-7 rounded-[8px] bg-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent-bright)] transition-colors">
            <Send className="w-3 h-3 text-[#0A0F0D]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ResponseCard({ card }: { card: import("@/lib/landing-data").ChatCard }) {
  const accent =
    card.type === "alert"
      ? "var(--danger)"
      : card.type === "forecast"
      ? "var(--gold)"
      : "var(--accent)";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mt-2 glass-card p-2.5 rounded-[10px] flex flex-col gap-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: accent }}>
          {card.type}
        </span>
        {card.confidence != null && (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] font-semibold">
            {card.confidence * 100}% conf
          </span>
        )}
      </div>
      {card.metric && (
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-[16px] font-bold" style={{ color: accent }}>
            {card.metric}
          </span>
          {card.delta && <span className="text-[10px] text-[var(--text-muted)]">{card.delta}</span>}
        </div>
      )}
      {card.chart === "bar" && (
        <div className="flex items-end gap-0.5 h-6">
          {[4200, 3800, 5100, 4600, 6900, 7200, 8450].map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${(v / 8450) * 100}%`,
                background: i >= 4 ? "var(--accent)" : "var(--surface-3)",
              }}
            />
          ))}
        </div>
      )}
      {card.chart === "forecast" && (
        <div className="h-6">
          <MiniSparklineLite data={[42, 44, 43, 46, 48, 47, 50, 49, 52, 54, 55, 56]} color="var(--gold)" fill />
        </div>
      )}
      {card.chart === "list" && card.list && (
        <div className="flex flex-col gap-0.5">
          {card.list.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-[10px]">
              <span>{item.emoji} {item.name}</span>
              <span className="font-mono text-[var(--text-secondary)]">{item.price}</span>
            </div>
          ))}
        </div>
      )}
      {card.action && (
        <button className="text-[10px] font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] text-left mt-0.5">
          {card.action} →
        </button>
      )}
    </motion.div>
  );
}

// Inline minimal sparkline for the response card (avoids circular import)
function MiniSparklineLite({ data, color, fill }: { data: number[]; color: string; fill?: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * 100, 24 - ((v - min) / range) * 22 - 1]);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ");
  return (
    <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="w-full h-full">
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      {fill && <path d={`${path} L 100,24 L 0,24 Z`} fill={color} opacity={0.2} />}
    </svg>
  );
}
