import Link from "next/link";
import { ArrowUpRight, BarChart3, Boxes, GitCompareArrows, Landmark, ReceiptText, Settings2, Sparkles } from "lucide-react";
import { ENGINE_MODULES } from "@/lib/engine-modules";

const featured = [
  { href: "/finance/reports", title: "Reports & net worth", description: "Net worth, income vs expenses and cash-flow reports from the engine.", Icon: BarChart3 },
  { href: "/finance/reconciliation", title: "Reconciliation", description: "Review matching policy and reconciliation rules for invoice and recurring workflows.", Icon: GitCompareArrows },
];

const icons = [Boxes, Settings2, Landmark, ReceiptText, Sparkles];

export default function FinanceOperationsPage() {
  const modules = Object.values(ENGINE_MODULES);
  return <div className="flex flex-col gap-7 max-w-6xl pb-12">
    <header><p className="text-xs uppercase tracking-[.18em] text-accent">Finance engine</p><h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">Finance operations</h1><p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">The advanced financial workflows now live inside FinCopilot's own interface. Your Personal Hub and everyday money screens stay unchanged while the deeper engine features are available here.</p></header>

    <section className="grid md:grid-cols-2 gap-4">{featured.map(({href,title,description,Icon}) => <Link key={href} href={href} className="premium-card p-6 group"><div className="flex items-start justify-between gap-4"><div className="w-11 h-11 rounded-2xl bg-(--surface-subtle) flex items-center justify-center"><Icon className="w-5 h-5 text-accent"/></div><ArrowUpRight className="w-4 h-4 text-(--text-tertiary) group-hover:text-accent transition-colors"/></div><h2 className="font-display font-semibold text-xl mt-5">{title}</h2><p className="text-sm text-(--text-secondary) mt-2">{description}</p></Link>)}</section>

    <div><h2 className="font-display font-semibold text-xl">All engine modules</h2><p className="text-sm text-(--text-secondary) mt-1">Live workspace-scoped data from the unified FastAPI backend.</p></div>
    <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{modules.map((module,index)=>{const Icon=icons[index%icons.length];return <Link key={module.key} href={`/finance/${module.key}`} className="premium-card p-5 group min-w-0"><div className="flex items-start justify-between gap-3"><div className="w-10 h-10 rounded-xl bg-(--surface-subtle) flex items-center justify-center"><Icon className="w-5 h-5 text-accent"/></div><ArrowUpRight className="w-4 h-4 text-(--text-tertiary) group-hover:text-accent"/></div><p className="text-[10px] uppercase tracking-[.14em] text-accent mt-5">{module.eyebrow}</p><h3 className="font-display font-semibold text-lg mt-1">{module.title}</h3><p className="text-xs text-(--text-secondary) mt-2 line-clamp-3">{module.description}</p></Link>})}</section>
  </div>;
}
