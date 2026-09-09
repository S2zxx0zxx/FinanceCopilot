import { formatPaise } from '@/lib/format';

type Datum = { name: string; value: number | null };
/** Bars retain their numeric labels and do not interpolate unavailable observations. */
export function ValueBars({ title, description, data, unit = 'money' }: {
  title: string; description: string; data: Datum[]; unit?: 'money' | 'count';
}) {
  const valid = data.filter((row): row is Datum & {value:number} => row.value !== null && Number.isFinite(row.value));
  const ordered = [...valid].sort((a,b)=>Math.abs(b.value)-Math.abs(a.value)).slice(0,8);
  const peak = Math.max(1,...ordered.map(row=>Math.abs(row.value)));
  return <section className="premium-card p-5 sm:p-6 min-w-0">
    <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.16em] text-accent font-mono">In focus</p><h2 className="font-display text-xl font-semibold mt-2">{title}</h2><p className="text-xs text-(--text-secondary) mt-2 max-w-xl">{description}</p></div><span className="rounded-full px-3 py-1.5 text-[10px] bg-(--surface-subtle) text-(--text-secondary) shrink-0">{valid.length} entries</span></div>
    {!ordered.length ? <p className="py-8 text-sm text-(--text-secondary)">No recorded values available for this chart.</p> : <ol className="flex flex-col gap-5 mt-7">{ordered.map((row,index)=><li key={`${row.name}-${index}`}><div className="flex items-baseline justify-between gap-4 text-sm mb-2"><span className="min-w-0 break-words font-medium">{row.name}</span><span className="font-mono text-xs tabular-nums shrink-0">{unit==='money'?formatPaise(row.value):row.value.toLocaleString('en-IN')}</span></div><div aria-hidden="true" className="h-3 rounded-full bg-(--surface-subtle) overflow-hidden"><div className="h-full rounded-full" style={{width:`${Math.abs(row.value)/peak*100}%`,background:`linear-gradient(90deg, var(--accent), color-mix(in oklab, var(--accent) ${85-index*7}%, var(--gold)))`}}/></div></li>)}</ol>}
    <p className="mt-5 text-[10px] text-(--text-tertiary)">{valid.length>8?'Largest eight entries shown. ':''}Bar lengths compare magnitudes; labels show exact recorded values.{data.length!==valid.length?` ${data.length-valid.length} unavailable values are excluded.`:''}</p>
  </section>;
}
