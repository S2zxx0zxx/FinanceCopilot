import { Loader2, RefreshCw } from 'lucide-react';
export function ResourceState({loading,error,retry}: {loading:boolean;error:string|null;retry:()=>void}) {
  if (loading) return <div role="status" className="flex items-center justify-center gap-3 min-h-[50vh] text-[var(--text-secondary)]"><Loader2 aria-hidden="true" className="animate-spin h-5 w-5" /> Loading your data…</div>;
  if (error) return <div role="alert" className="premium-card p-6 border border-red-400/30"><h2 className="font-semibold">We couldn’t load this view</h2><p className="mt-2 text-sm text-(--text-secondary)">{error}</p><button onClick={retry} className="mt-4 flex items-center gap-2 text-accent"><RefreshCw className="h-4 w-4" /> Try again</button></div>;
  return null;
}
