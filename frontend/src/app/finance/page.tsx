import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  Boxes,
  Cable,
  Coins,
  FileInput,
  FolderKanban,
  GitCompareArrows,
  Landmark,
  ReceiptText,
  Repeat2,
  Settings2,
  ShieldCheck,
  Sparkles,
  Tags,
  Users,
} from "lucide-react";

const featured = [
  { href: "/finance/assets", title: "Investments & assets", description: "Track holdings, valuations, market prices and portfolio activity in one place.", Icon: Landmark },
  { href: "/finance/reports", title: "Reports & money map", description: "Explore net worth, income, expenses, category trends and forward cash flow.", Icon: BarChart3 },
  { href: "/finance/invoices", title: "Invoices", description: "Create receivables and payables, allocate payments, attach files, share securely and export PDFs.", Icon: ReceiptText },
  { href: "/finance/imports", title: "Import center", description: "Bring in CSV, OFX, QIF and CAMT files with preview, mapping and import history.", Icon: FileInput },
  { href: "/finance/rules", title: "Automation", description: "Build nested transaction rules, preview impact, install packs and apply them to history.", Icon: Settings2 },
  { href: "/finance/reconciliation", title: "Reconciliation", description: "Review matching policy, suggestions, decisions and financial records that need attention.", Icon: GitCompareArrows },
];

const organise = [
  { href: "/finance/categories", title: "Categories", description: "Manage transaction categories, category groups and reporting behaviour.", Icon: Tags },
  { href: "/finance/payees", title: "Payees", description: "Manage people and organisations, summaries, tax IDs and duplicate records.", Icon: Sparkles },
  { href: "/finance/collections", title: "Collections", description: "Group accounts and asset wallets into reusable reporting scopes.", Icon: FolderKanban },
  { href: "/recurring", title: "Recurring activity", description: "Detect, review and manage repeating bills, subscriptions and income rhythms.", Icon: Repeat2 },
  { href: "/finance/groups", title: "Shared expenses", description: "Track group balances, participants, linked transactions and settlements.", Icon: Boxes },
  { href: "/finance/currencies", title: "Currencies & FX", description: "Inspect supported currencies and monitor or refresh the exchange-rate store.", Icon: Coins },
];

const manage = [
  { href: "/finance/connections", title: "Bank sync", description: "Connect and maintain supported open-banking providers and sync status.", Icon: Cable },
  { href: "/finance/workspaces", title: "Shared workspaces", description: "Manage collaborative money spaces, members, invitations and roles.", Icon: Users },
  { href: "/finance/security", title: "Advanced security", description: "Passkeys, TOTP and additional sign-in controls for supported deployments.", Icon: ShieldCheck },
  { href: "/ai/agents", title: "Agent studio", description: "Configure financial agents, model providers, tools and knowledge sources.", Icon: Bot },
  { href: "/finance/admin", title: "Admin center", description: "Workspace and system administration for authorised users.", Icon: Settings2 },
];

function ToolGrid({ items }: { items: typeof featured }) {
  return (
    <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map(({ href, title, description, Icon }) => (
        <Link key={href} href={href} className="premium-card p-5 sm:p-6 group min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="w-11 h-11 rounded-2xl bg-(--surface-subtle) flex items-center justify-center"><Icon className="w-5 h-5 text-accent" /></div>
            <ArrowUpRight className="w-4 h-4 text-(--text-tertiary) group-hover:text-accent transition-colors" />
          </div>
          <h3 className="font-display font-semibold text-lg sm:text-xl mt-5">{title}</h3>
          <p className="text-xs sm:text-sm text-(--text-secondary) mt-2">{description}</p>
        </Link>
      ))}
    </section>
  );
}

export default function FinanceOperationsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl pb-12">
      <header>
        <p className="text-xs uppercase tracking-[.18em] text-accent">Advanced money</p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">Money workspace</h1>
        <p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">
          The complete finance engine inside FinCopilot: investments, imports, automation, reports, invoicing, shared money, multi-currency operations and administration — all using the same accounts, transactions and workspace permissions.
        </p>
      </header>

      <div>
        <p className="text-xs uppercase tracking-[.18em] text-(--text-tertiary)">Core operations</p>
        <h2 className="font-display font-semibold text-2xl mt-2">Analyze & operate</h2>
        <p className="text-sm text-(--text-secondary) mt-1">The high-value workflows that turn the transaction ledger into a complete finance workspace.</p>
      </div>
      <ToolGrid items={featured} />

      <div>
        <p className="text-xs uppercase tracking-[.18em] text-(--text-tertiary)">Money structure</p>
        <h2 className="font-display font-semibold text-2xl mt-2">Organize & classify</h2>
        <p className="text-sm text-(--text-secondary) mt-1">Taxonomy, counterparties, reusable scopes, recurring activity and shared balances.</p>
      </div>
      <ToolGrid items={organise} />

      <div>
        <p className="text-xs uppercase tracking-[.18em] text-(--text-tertiary)">Workspace controls</p>
        <h2 className="font-display font-semibold text-2xl mt-2">Connect, secure & configure</h2>
        <p className="text-sm text-(--text-secondary) mt-1">Connections, collaboration, advanced security, agents and administration.</p>
      </div>
      <ToolGrid items={manage} />
    </div>
  );
}
