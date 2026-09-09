"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Loader2, UploadCloud } from "lucide-react";
import { formatPaise, formatDate, categoryIcon } from "@/lib/format";
import { object, rows, label } from "@/lib/response";
import { api } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

export default function TransactionsPage() {
  const { isLoaded, userId } = useAuth();
  const [offset,setOffset]=React.useState(0);
  const [total,setTotal]=React.useState(0);
  const [reviewOnly,setReviewOnly]=React.useState(false);
  const [direction,setDirection]=React.useState('all');
  const [viewAccount,setViewAccount]=React.useState('all');
  const [revision,setRevision]=React.useState(0);
  const [filter, setFilter] = React.useState("");
  const [txs, setTxs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const [accountId,setAccountId] = React.useState("");
  const [importAccounts,setImportAccounts] = React.useState<Record<string,unknown>[]>([]);
  const [institution,setInstitution] = React.useState("");
  React.useEffect(() => {
    let active = true;
    setImportAccounts([]);
    setAccountId("");
    if (!isLoaded || !userId) return;
    api.getAccounts().then(value => {
      if (!active) return;
      const accounts = rows(object(value).accounts);
      setImportAccounts(accounts);
      const requested = new URLSearchParams(window.location.search).get("account");
      if (requested && accounts.some(account => account.account_id === requested)) setAccountId(requested);
    }).catch(error => { if (active) setError(error.message); });
    return () => { active = false; };
  }, [isLoaded, userId]);
  const addAccount=async()=>{try{const result=object(await api.createAccount({institution_name:institution,account_type:'savings'}));const account=object(result.account);setImportAccounts(current=>[...current,account]);setAccountId(label(account.account_id,''));setInstitution('');}catch(error){toast({title:'Account could not be created',description:error instanceof Error?error.message:'Please try again.',variant:'destructive'});}};
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!accountId || !importAccounts.some(account => account.account_id === accountId)) {
      toast({title: "Select an account", variant: "destructive"});
      e.target.value = "";
      return;
    }
    if (!/\.(csv|pdf)$/i.test(file.name) || file.size === 0 || file.size > 10 * 1024 * 1024) {
      toast({title: "Choose a CSV or PDF up to 10 MB", variant: "destructive"});
      e.target.value = "";
      return;
    }
    const contentType = file.name.toLowerCase().endsWith(".csv") ? "text/csv" : "application/pdf";
    setUploading(true);
    try {
      const intent: any = await api.initiateUpload(file.name, contentType, accountId);
      
      const uploadRes = await fetch(intent.upload_url, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Your statement could not be uploaded");

      await api.confirmUpload(intent.job_id, intent.storage_key);

      toast({
        title: "Statement Uploaded",
        description: "Your statement has been queued for processing.",
      });
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  React.useEffect(() => {
    let mounted = true;
    setTxs([]);
    setError(null);
    setLoading(true);
    if (!isLoaded || !userId) return;
    api.getTransactions({...(reviewOnly?{needsReview:"true"}:{}),limit:"50",offset:String(offset),...(direction!=="all"?{direction}:{}),...(viewAccount!=="all"?{accountId:viewAccount}:{})})
      .then((res: any) => {
        if (!mounted) return;
        setTxs(res.transactions || []);
        setTotal(Number(object(res.pagination).total)||0);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load transactions");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [isLoaded, userId,offset,direction,viewAccount,reviewOnly,revision]);

  const filtered = txs.filter((t: any) => 
    label(t.merchant_name, "").toLowerCase().includes(filter.toLowerCase()) || 
    label(t.category, "").toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-(--accent)" /></div>;
  }
  if (error) {
    return <div className="premium-card p-8"><p role="alert">{error}</p><button onClick={()=>setRevision(value=>value+1)} className="min-h-11 text-accent mt-3">Retry loading activity</button></div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Activity journal</h1>
          <p className="text-[14px] text-(--text-secondary) mt-1">{total} records ? {filtered.length} shown on this page</p>
        </div>
        <div>
          <input type="file" ref={fileInputRef} onChange={handleUpload} accept="application/pdf, text/csv" className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={uploading || !accountId}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[var(--surface-subtle)] text-[14px] font-medium hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload Statement"}
          </button>
        </div>
      </div>
      <section className="premium-card p-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Import into account<select aria-label="Account for statement import" value={accountId} onChange={e=>setAccountId(e.target.value)} className="block w-full p-2 mt-2 rounded-lg border border-(--border) bg-(--surface)"><option value="">Select an account</option>{importAccounts.map(account=><option key={label(account.account_id)} value={label(account.account_id)}>{label(account.institution_name)}</option>)}</select></label>
          <div><label className="text-sm" htmlFor="institution">Add a savings account</label><div className="flex gap-2 mt-2"><input id="institution" maxLength={120} value={institution} onChange={e=>setInstitution(e.target.value)} placeholder="Institution name" className="min-w-0 p-2 rounded-lg border border-(--border) bg-(--surface)" /><button disabled={!institution.trim()} onClick={addAccount} className="text-accent disabled:opacity-50">Add account</button></div></div>
        </section>
        <div className="flex flex-col sm:flex-row gap-3"><label className="flex min-h-11 items-center gap-2 px-3 text-sm"><input type="checkbox" checked={reviewOnly} onChange={event=>{setReviewOnly(event.target.checked);setOffset(0);}} className="h-5 w-5 accent-(--accent)"/>Needs review</label><select aria-label="Filter transaction direction" value={direction} onChange={e=>{setDirection(e.target.value);setOffset(0);}} className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3"><option value="all">Money in and out</option><option value="credit">Money in</option><option value="debit">Money out</option></select><select aria-label="Filter transactions by account" value={viewAccount} onChange={e=>{setViewAccount(e.target.value);setOffset(0);}} className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3"><option value="all">Every account</option>{importAccounts.map(account=><option key={label(account.account_id)} value={label(account.account_id)}>{label(account.institution_name)}</option>)}</select><button onClick={()=>setRevision(value=>value+1)} className="min-h-11 rounded-xl px-4 text-accent bg-(--surface-subtle)">Refresh activity</button></div>
        <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-tertiary)" />
        <input value={filter} onChange={e => setFilter(e.target.value)} aria-label="Search current transaction page" placeholder="Search the current page..." className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] text-[14px] focus:border-[var(--accent)] outline-none transition-colors" />
      </div>
      <div className="premium-card overflow-hidden">
        {filtered.length === 0 && <div className="p-8 text-center text-(--text-tertiary)">No transactions found.</div>}
        {filtered.map((tx, i) => { 
          const isIncome = tx.direction === "credit"; 
          return (
            <Link key={tx.transaction_id} href={`/transactions/${tx.transaction_id}`} className={`flex items-center gap-3 p-4 hover:bg-(--surface-subtle) transition-colors ${i < filtered.length - 1 ? "border-b border-(--border-subtle)" : ""}`}>
              <div className="w-10 h-10 rounded-[10px] bg-[var(--surface-subtle)] flex items-center justify-center text-[16px] shrink-0">{categoryIcon(tx.category)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium truncate">{tx.merchant_name}</p>
                <p className="text-[12px] text-(--text-tertiary) capitalize">{tx.category} · {formatDate(tx.date || tx.observed_at)}{tx.needs_review===true&&<span className="ml-2 text-(--warning)">Review needed</span>}{tx.pending && <span className="ml-1.5 text-(--warning)">· Pending</span>}</p>
              </div>
              <span className={`text-[14px] font-semibold tabular-nums shrink-0 ${isIncome ? "text-(--positive)" : ""}`}>{isIncome ? "+" : ""}{formatPaise(tx.amount_paise)}</span>
            </Link>
          ); 
        })}
      </div>
      <nav aria-label="Transaction pages" className="flex items-center justify-between gap-3"><button disabled={offset===0} onClick={()=>setOffset(value=>Math.max(0,value-50))} className="min-h-11 px-4 rounded-xl border border-(--border) disabled:opacity-40">Previous</button><p className="text-xs text-(--text-secondary)">Page {Math.floor(offset/50)+1} of {Math.max(1,Math.ceil(total/50))}</p><button disabled={offset+50>=total} onClick={()=>setOffset(value=>value+50)} className="min-h-11 px-4 rounded-xl border border-(--border) disabled:opacity-40">Next</button></nav>
    </div>
  );
}
