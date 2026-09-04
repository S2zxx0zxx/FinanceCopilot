"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAppData } from "@/hooks/use-app-data";


import { api } from "@/lib/api";

export default function AIChatPage() {
  const [messages, setMessages] = React.useState([
    { role: "user", content: "How much did I spend on dining out last month?" },
    { role: "ai", content: "₹8,450 across 23 transactions. That's 22% above your 3-month average of ₹6,900. Want me to set a dining budget?", insight: true },
  ]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = async () => {
    if (!input.trim() || typing) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);
    try {
      const response = await api.sendAIChat(input.trim());
      const aiContent = (response as any)?.message || (response as any)?.response || (response as any)?.text || "I'm analyzing your financial data. Please try again.";
      setMessages(m => [...m, { role: "ai", content: aiContent }]);
    } catch {
      setMessages(m => [...m, { role: "ai", content: "Sorry, I couldn't process your request. Please try again." }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl">
      <header className="flex items-center gap-3 mb-4">
        <Link href="/ai" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-linear-to-br from-accent to-(--gold) flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
          <div><h1 className="font-display font-semibold text-[18px]">AI Chat</h1><p className="text-[11px] text-(--text-tertiary) flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-(--positive)" style={{ animation: "pulse-dot 2s infinite" }} /> Online</p></div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto premium-card flex flex-col gap-3 p-4 mb-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={`msg-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-accent text-white rounded-br-lg" : "bg-(--surface-subtle) text-foreground rounded-bl-lg"}`}>
                <p className="text-[14px] leading-normal">{msg.content}</p>
                {msg.insight && (
                  <div className="mt-2 p-2.5 rounded-[10px] bg-(--accent-light) border border-(--accent)/20">
                    <p className="text-[12px] font-mono text-accent">💡 Insight</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-(--surface-subtle) rounded-2xl rounded-bl-lg px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map(i => <span key={`dot-${i}`} className="w-1.5 h-1.5 rounded-full bg-(--text-tertiary)" style={{ animation: "bounce-dot 1.4s infinite", animationDelay: `${i * 0.16}s` }} />)}
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about your money..." className="flex-1 px-4 py-3 rounded-[12px] bg-(--surface) border border-border text-[14px] focus:border-accent outline-none transition-colors" />
        <button onClick={send} disabled={!input.trim()} className="w-12 h-12 rounded-[12px] bg-accent text-white flex items-center justify-center hover:bg-(--accent-hover) disabled:opacity-40 transition-all"><Send className="w-5 h-5" /></button>
      </div>
    </div>
  );
}
