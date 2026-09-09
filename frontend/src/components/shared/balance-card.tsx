"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { ArrowUpRight, Eye, EyeOff, Radio } from 'lucide-react';
import Link from 'next/link';
import { formatPaise } from '@/lib/format';

type Props = {
  institution: string;
  amountPaise: number | null;
  lastFour?: string;
  accountType?: string;
  href?: string;
  tone?: 'emerald' | 'midnight' | 'plum';
  caption?: string;
  note?: string;
};

/** Decorative account representation; no invented card credentials or payment-network claims. */
export function BalanceCard({ institution, amountPaise, lastFour, accountType = 'Account overview', href,
  tone = 'emerald', caption = 'Recorded net activity', note = 'Opening balance is not included.' }: Props) {
  const [hidden, setHidden] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty('--card-rx', `${(0.5-y)*7}deg`);
    event.currentTarget.style.setProperty('--card-ry', `${(x-0.5)*9}deg`);
    event.currentTarget.style.setProperty('--light-x', `${x*100}%`);
    event.currentTarget.style.setProperty('--light-y', `${y*100}%`);
  };
  const reset = () => { card.current?.style.setProperty('--card-rx', '0deg'); card.current?.style.setProperty('--card-ry', '0deg'); };
  return <div className="balance-card-stage">
    <div ref={card} onPointerMove={move} onPointerLeave={reset} className={`balance-card balance-card--${tone}`} style={{ '--card-rx':'0deg', '--card-ry':'0deg' } as CSSProperties}>
      <div className="balance-card__contours" aria-hidden="true" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0"><p className="text-[10px] font-mono uppercase tracking-[.2em] text-white/70">FinanceCopilot / Your money</p><h2 className="font-display font-semibold text-xl mt-2 break-words">{institution}</h2></div>
        <button type="button" onClick={()=>setHidden(value=>!value)} aria-label={hidden ? 'Show amount' : 'Hide amount'} aria-pressed={hidden} className="h-11 w-11 shrink-0 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white">{hidden ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</button>
      </div>
      <div className="relative z-10 flex items-center gap-3 mt-6" aria-hidden="true"><span className="balance-card__chip"/><Radio className="w-5 h-5 text-white/55 rotate-90"/><span className="ml-auto font-mono text-sm tracking-[.18em] text-white/75">{lastFour && /^\d{4}$/.test(lastFour) ? `•••• ${lastFour}` : 'PRIVATE VIEW'}</span></div>
      <div className="relative z-10 mt-6"><p className="text-xs text-white/70">{caption}</p><p aria-live="polite" className="balance-card__amount font-display font-semibold mt-2 tabular-nums">{hidden ? '••••••' : amountPaise === null ? 'Unavailable' : formatPaise(amountPaise)}</p></div>
      <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex items-end justify-between gap-3"><div><p className="text-xs capitalize font-medium text-white/90">{accountType.replaceAll('_',' ')}</p><p className="text-[11px] text-white/65 mt-1 max-w-64">{note}</p></div>{href && <Link href={href} aria-label={`Open ${institution}`} className="flex items-center justify-center shrink-0 h-11 w-11 rounded-full bg-white/10 border border-white/15 hover:bg-white/20"><ArrowUpRight className="h-5 w-5"/></Link>}</div>
    </div>
  </div>;
}
