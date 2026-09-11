"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@clerk/nextjs";
import { object } from "@/lib/response";
import { api, ApiError } from "@/lib/api";

export default function AIChatPage() {
  const {userId,isLoaded}=useAuth();
  const owner=React.useRef(userId);owner.current=userId;
  const [messages, setMessages] = React.useState<{role:string;content:string;insight?:boolean;error?:boolean}[]>([]);
  React.useEffect(()=>{setMessages([]);setTyping(false);setInput(new URLSearchParams(window.location.search).get('q')?.slice(0,4000)??'');},[userId]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = async () => {
    if (!input.trim() || typing || !isLoaded || !userId) return;
    const requestOwner=userId;
    const userMsg = { role: "user", content: input.trim() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);
    try {
      const response = object(await api.sendAIChat(userMsg.content));
      if(owner.current!==requestOwner)return;
      if(typeof response.answer!=='string'||!response.answer.trim())throw new Error('Copilot returned no answer. Please retry your question.');
      setMessages(m => [...m, { role: "ai", content: response.answer as string, error: response.status==='ERROR' }]);
    } catch (err: unknown) {
      if(owner.current!==requestOwner)return;
      const fallback = err instanceof Error
        ? err.message
        : "Sorry, I couldn't process your request. Please try again.";
      setMessages(m => [...m, { role: "ai", content: fallback, error:true }]);
    } finally {
      if(owner.current===requestOwner)setTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] max-w-3xl">
      <header className="flex items-center gap-3 mb-4">
        <Link href="/ai" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-linear-to-br from-accent to-(--gold) flex items-center justify-center"><Sparkles className="w-4 h-4 text-accent-foreground" /></div>
          <div><h1 className="font-display font-semibold text-[18px]">Ask your copilot</h1><p className="text-[11px] text-(--text-tertiary) flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-(--positive)" style={{ animation: "pulse-dot 2s infinite" }} /> {typing?"Working on your question":"Answers use your available records"}</p></div>
        </div>
      </header>

      <div role="log" aria-label="Conversation" aria-live="polite" className="flex-1 overflow-y-auto premium-card flex flex-col gap-3 p-4 mb-4">
        {messages.length===0&&<div className="m-auto max-w-md text-center p-4"><Sparkles className="w-10 h-10 text-accent mx-auto"/><h2 className="font-display text-2xl font-semibold mt-4">What would you like to understand?</h2><p className="text-sm text-(--text-secondary) mt-3">Ask about spending, your goals or a planned purchase. Each answer depends on the records available to your account.</p><div className="flex flex-col gap-2 mt-5">{['Summarise my recorded spending','How are my goals progressing?','What recurring payments should I review?'].map(question=><button key={question} onClick={()=>setInput(question)} className="min-h-11 text-sm rounded-xl p-3 border border-(--border) hover:border-accent">{question}</button>)}</div></div>}
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={`msg-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-accent text-accent-foreground rounded-br-lg" : "bg-(--surface-subtle) text-foreground rounded-bl-lg"}`}>
                <p className="text-[14px] leading-normal whitespace-pre-wrap">{msg.content}</p>{msg.error&&<p className="text-xs text-(--warning) mt-2">Request could not be completed. Edit your question and try again.</p>}
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
        <input aria-label="Your question" maxLength={4000} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.nativeEvent.isComposing && send()} placeholder="Ask about your money..." className="flex-1 px-4 py-3 rounded-[12px] bg-(--surface) border border-border text-[14px] focus:border-accent outline-none transition-colors" />
        <button onClick={send} aria-label="Send question" disabled={!input.trim()||typing||!isLoaded||!userId} className="w-12 h-12 rounded-[12px] bg-accent text-accent-foreground flex items-center justify-center hover:bg-(--accent-hover) disabled:opacity-40 transition-all"><Send className="w-5 h-5" /></button>
      </div>
    </div>
  );
}
