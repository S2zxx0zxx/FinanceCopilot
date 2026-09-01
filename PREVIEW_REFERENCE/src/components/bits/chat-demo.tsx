"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { chatExamples, chatPlaceholders } from "@/lib/landing-data";
import { useChatCycle } from "@/lib/use-chat-cycle";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { cn } from "@/lib/utils";

interface ChatDemoProps {
  variant?: "hero" | "compact" | "full";
  autoCycle?: boolean;
  cycleMs?: number;
  className?: string;
}

export function ChatDemo({
  variant = "hero",
  autoCycle = true,
  cycleMs = 8500,
  className,
}: ChatDemoProps) {
  const { activeIndex, phase, next, setPhase } = useChatCycle();
  const example = chatExamples[activeIndex];
  const [typedAnswer, setTypedAnswer] = React.useState("");
  const [placeholderIdx, setPlaceholderIdx] = React.useState(0);

  // Auto-cycle through examples
  React.useEffect(() => {
    if (!autoCycle) return;
    let mounted = true;

    const run = async () => {
      // question shown for 2.5s
      setPhase("question");
      setTypedAnswer("");
      await wait(2500);
      if (!mounted) return;
      // typing indicator 1.4s
      setPhase("typing");
      await wait(1400);
      if (!mounted) return;
      // type out the answer
      setPhase("answer");
      await typeText(example.a, setTypedAnswer, 18);
      if (!mounted) return;
      // hold for the rest of cycleMs
      await wait(cycleMs - 2500 - 1400 - example.a.length * 18);
      if (!mounted) return;
      next();
    };

    run();
    return () => {
      mounted = false;
    };
  }, [activeIndex, autoCycle, cycleMs, next, setPhase]);

  // Placeholder rotation for the input
  React.useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % chatPlaceholders.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const containerHeight =
    variant === "compact" ? "h-[280px]" : variant === "full" ? "h-[520px]" : "h-[340px]";

  return (
    <div
      className={cn(
        "glass-card flex flex-col overflow-hidden",
        containerHeight,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)]/40">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-[#0A0F0D]" />
          </div>
          <span className="text-[12px] font-semibold">FinCopilot</span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">AI</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
          <span className="text-[10px] text-[var(--text-muted)] font-mono">online</span>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 flex flex-col gap-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            {/* User bubble */}
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-[14px] rounded-tr-[4px] bg-[var(--accent)] text-[#0A0F0D] px-3 py-2 text-[13px] font-medium">
                {example.q}
              </div>
            </div>

            {/* Typing indicator or AI answer */}
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-[14px] rounded-tl-[4px] bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2.5 text-[13px] flex flex-col gap-2">
                {phase === "typing" && (
                  <div className="flex items-center gap-1 h-5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)]"
                        style={{ animation: "bounce-dot 1.4s ease-in-out infinite", animationDelay: `${i * 0.16}s` }}
                      />
                    ))}
                  </div>
                )}

                {phase === "answer" && (
                  <>
                    <p className="leading-[1.5] text-[var(--text)]">
                      {typedAnswer}
                      <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-[var(--accent)] align-middle" style={{ animation: "blink 1s step-end infinite" }} />
                    </p>

                    {/* Rich response card */}
                    {typedAnswer.length >= example.a.length - 2 && (
                      <ResponseCard card={example.card} />
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div className="border-t border-[var(--border)] p-2.5 bg-[var(--surface)]/40">
        <div className="flex items-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
          <div className="relative flex-1 h-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={placeholderIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 text-[12px] text-[var(--text-muted)] truncate"
              >
                {chatPlaceholders[placeholderIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
          <button className="w-6 h-6 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-bright)] flex items-center justify-center transition-colors">
            <Send className="w-3 h-3 text-[#0A0F0D]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ResponseCard({ card }: { card: import("@/lib/landing-data").ChatCard }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-2 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-2.5 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
          {card.type === "insight" ? "Insight" : card.type === "forecast" ? "Forecast" : card.type === "action" ? "Action" : "Alert"}
        </span>
        {card.confidence && (
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-[var(--gold-glow)] text-[var(--gold)]">
            {card.confidence}% conf
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        {card.metric && (
          <span className="font-mono text-[18px] font-bold">{card.metric}</span>
        )}
        {card.delta && (
          <span className="text-[11px] text-[var(--danger)]">{card.delta}</span>
        )}
      </div>

      {card.chart === "mini-bar" && (
        <div className="h-8 flex items-end gap-0.5">
          {[40, 65, 50, 80, 55, 90, 75, 60, 85, 70].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-[2px]"
              style={{
                height: `${h}%`,
                background: i >= 7 ? "var(--accent)" : "var(--surface-3)",
              }}
            />
          ))}
        </div>
      )}

      {card.chart === "forecast-spark" && (
        <div className="h-10">
          <MiniSparkline data={[42, 44, 43, 46, 48, 47, 50, 49, 52, 54, 55, 56]} color="var(--gold)" fill />
        </div>
      )}

      {card.list && (
        <div className="flex flex-col gap-1">
          {card.list.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5">
                <span>{item.emoji}</span>
                <span className="text-[var(--text-secondary)]">{item.name}</span>
              </span>
              <span className="font-mono">{item.price}</span>
            </div>
          ))}
        </div>
      )}

      {card.action && (
        <button className="mt-1 self-start inline-flex items-center gap-1 text-[11px] font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors">
          {card.action}
          <span aria-hidden>→</span>
        </button>
      )}
    </motion.div>
  );
}

function wait(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

function typeText(text: string, setter: (s: string) => void, msPerChar: number) {
  return new Promise<void>((resolve) => {
    let i = 0;
    const step = () => {
      i += 1;
      setter(text.slice(0, i));
      if (i < text.length) {
        setTimeout(step, msPerChar);
      } else {
        resolve();
      }
    };
    step();
  });
}
