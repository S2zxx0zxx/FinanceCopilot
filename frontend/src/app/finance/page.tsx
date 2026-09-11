import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  Boxes,
  Cable,
  FileInput,
  GitCompareArrows,
  Landmark,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const featured = [
  { href: "/finance/assets", title: "Investments & assets", description: "Track holdings, valuations, market prices and portfolio activity in one place.", Icon: Landmark },
  { href: "/finance/reports", title: "Reports & net worth", description: "Understand net worth, income, expenses and cash-flow trends across your money.", Icon: BarChart3 },
  { href: "/finance/invoices", title: "Invoices", description: "Create receivables and payables, attach files, share securely and export PDFs.", Icon: ReceiptText },
  { href: "/finance/imports", title: "Import center", description: "Bring in CSV, OFX, QIF and CAMT files with preview, mapping and import history.", Icon: FileInput },
  { href: "/finance/rules", title: "Automation", description: "Build rules that classify and organise repetitive money activity automatically.", Icon: Settings2 },
  { href: "/finance/reconciliation", title: "Reconciliation", description: "Review matching policy, suggestions and financial records that need attention.", Icon: GitCompareArrows },
];

const manage = [
  { href: "/finance/connections", title: "Bank sync", description: "Connect and maintain supported open-banking providers.", Icon: Cable },
  { href: "/finance/workspaces", title: "Shared workspaces", description: "Manage collaborative money spaces, members and roles.", Icon: Users },
  { href: "/finance/groups", title: "Shared expenses", description: "Track group balances, participants and settlements.", Icon: Boxes },
  { href: "/finance/payees", title: "Payees", description: "Manage people and organisations used by transactions and invoices.", Icon: Sparkles },
  { href: "/finance/security", title: "Advanced security", description: "Passkeys, TOTP and additional sign-in controls for supported deployments.", Icon: ShieldCheck },
  { href: "/ai/agents", title: "Agent studio", description: "Configure financial agents, model providers, tools and knowledge sources.", Icon: Bot },
  { href: "/finance/admin", title: "Admin center", description: "Workspace and system administration for authorised users.", Icon: Settings2 },
];

export default function FinanceOperationsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl pb-12">
      <header>
        <p className="text-xs uppercase tracking-[.18em] text-accent">Advanced money</p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">Money workspace</h1>
        <p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">
          FinCopilot&apos;s deeper tools for investments, imports, automation, reporting, shared money and financial operations. Everything here uses the same accounts, transactions and permissions as the rest of your workspace.
        </p>
      </header>

      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {featured.map(({ href, title, description, Icon }) => (
          <Link key={href} href={href} className="premium-card p-6 group min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="w-11 h-11 rounded-2xl bg-(--surface-subtle) flex items-center justify-center"><Icon className="w-5 h-5 text-accent" /></div>
              <ArrowUpRight className="w-4 h-4 text-(--text-tertiary) group-hover:text-accent transition-colors" />
            </div>
            <h2 className="font-display font-semibold text-xl mt-5">{title}</h2>
            <p className="text-sm text-(--text-secondary) mt-2">{description}</p>
          </Link>
        ))}
      </section>

      <div>
        <p className="text-xs uppercase tracking-[.18em] text-(--text-tertiary)">Manage & configure</p>
        <h2 className="font-display font-semibold text-2xl mt-2">Workspace controls</h2>
        <p className="text-sm text-(--text-secondary) mt-1">Connections, collaboration, security and supporting financial records.</p>
      </div>

      <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {manage.map(({ href, title, description, Icon }) => (
          <Link key={href} href={href} className="premium-card p-5 group min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-(--surface-subtle) flex items-center justify-center"><Icon className="w-5 h-5 text-accent" /></div>
              <ArrowUpRight className="w-4 h-4 text-(--text-tertiary) group-hover:text-accent" />
            </div>
            <h3 className="font-display font-semibold text-lg mt-5">{title}</h3>
            <p className="text-xs text-(--text-secondary) mt-2">{description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
