"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Loader2, UploadCloud } from "lucide-react";
import { formatPaise, formatDate, categoryIcon } from "@/lib/format";
import { object, rows, label } from "@/lib/response";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function TransactionsPage() {
  const [filter, setFilter] = React.useState("");
  const [txs, setTxs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const [accountId,setAccountId] = React.useState("");
  const [importAccounts,setImportAccounts] = React.useState<Record<string,unknown>[]>([]);
  const [institution,setInstitution] = React.useState("");
  React.useEffect(()=>{api.getAccounts().then(value=>setImportAccounts(rows(object(value).accounts))).catch(error=>setError(error.message));},[]);
  const addAccount=async()=>{try{const result=object(await api.createAccount({institution_name:institution,account_type:'savings'}));const account=object(result.account);setImportAccounts(current=>[...current,account]);setAccountId(label(account.account_id,''));setInstitution('');}catch(error){toast({title:'Account could not be created',description:error instanceof Error?error.message:'Please try again.',variant:'destructive'});}};
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const intent: any = await api.initiateUpload(file.name, file.type || (file.name.toLowerCase().endsWith(".csv") ? "text/csv" : "application/pdf"), accountId);
      
      const uploadRes = await fetch(intent.upload_url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload to Cloudflare R2");

      await api.confirmUpload(intent.job_id, intent.storage_key);

      toast({
        title: "Statement Uploaded",
        description: "Your statement is safely in Cloudflare R2 and will be processed.",
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
    api.getTransactions()
      .then((res: any) => {
        if (!mounted) return;
        setTxs(res.transactions || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load transactions");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const filtered = txs.filter((t: any) => 
    t.merchant_name.toLowerCase().includes(filter.toLowerCase()) || 
    t.category.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-(--accent)" /></div>;
  }
  if (error) {
    return <div className="min-h-[50vh] flex items-center justify-center text-(--danger)">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Transactions</h1>
          <p className="text-[14px] text-(--text-secondary) mt-1">{filtered.length} transactions</p>
        </div>
        <div>
          <input type="file" ref={fileInputRef} onChange={handleUpload} accept="application/pdf, text/csv" className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={uploading || !accountId}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[var(--surface-subtle)] text-[14px] font-medium hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {uploading ? "Uploading to R2..." : "Upload Statement"}
          </button>
        </div>
      </div>
      <section className="premium-card p-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Import into account<select aria-label="Account for statement import" value={accountId} onChange={e=>setAccountId(e.target.value)} className="block w-full p-2 mt-2 rounded-lg border border-(--border) bg-(--surface)"><option value="">Select an account</option>{importAccounts.map(account=><option key={label(account.account_id)} value={label(account.account_id)}>{label(account.institution_name)}</option>)}</select></label>
          <div><label className="text-sm" htmlFor="institution">Add a savings account</label><div className="flex gap-2 mt-2"><input id="institution" maxLength={120} value={institution} onChange={e=>setInstitution(e.target.value)} placeholder="Institution name" className="min-w-0 p-2 rounded-lg border border-(--border) bg-(--surface)" /><button disabled={!institution.trim()} onClick={addAccount} className="text-accent disabled:opacity-50">Add account</button></div></div>
        </section>
        <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-tertiary)" />
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search transactions..." className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] text-[14px] focus:border-[var(--accent)] outline-none transition-colors" />
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
                <p className="text-[12px] text-(--text-tertiary) capitalize">{tx.category} · {formatDate(tx.date || tx.observed_at)}{tx.pending && <span className="ml-1.5 text-(--warning)">· Pending</span>}</p>
              </div>
              <span className={`text-[14px] font-semibold tabular-nums shrink-0 ${isIncome ? "text-(--positive)" : ""}`}>{isIncome ? "+" : ""}{formatPaise(tx.amount_paise)}</span>
            </Link>
          ); 
        })}
      </div>
    </div>
  );
}
