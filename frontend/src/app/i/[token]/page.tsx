import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type TaxId = { label: string; value: string };
type Party = {
  name?: string | null;
  legal_name?: string | null;
  address?: string | null;
  email?: string | null;
  tax_ids?: TaxId[];
};
type InvoiceLine = {
  description: string;
  quantity: string;
  unit?: string | null;
  unit_price: string;
  total: string;
  tax_rate?: string | null;
};
type PublicInvoice = {
  number?: string | null;
  status: string;
  state: string;
  issue_date: string;
  due_date: string;
  currency: string;
  subtotal: string;
  discount: string;
  tax_total: string;
  total: string;
  amount_paid: string;
  balance: string;
  issuer: Party;
  client: Party;
  lines: InvoiceLine[];
  labels: Record<string, string>;
  accent_color?: string | null;
  logo_url?: string | null;
  payment_details?: string | null;
  notes?: string | null;
  footer_note?: string | null;
  custom_fields?: Array<{ label: string; value: string }>;
  has_line_items: boolean;
  direction: string;
};

function backendBase() {
  return (process.env.BACKEND_URL || "http://localhost:3001").replace(/\/$/, "");
}

function money(value: string, currency: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `${value} ${currency}`;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function dateLabel(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(parsed);
}

async function getInvoice(token: string): Promise<PublicInvoice> {
  const response = await fetch(
    `${backendBase()}/api/public/invoices/${encodeURIComponent(token)}`,
    { cache: "no-store" },
  );
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error(`Unable to load invoice (${response.status})`);
  return response.json() as Promise<PublicInvoice>;
}

export default async function SharedInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invoice = await getInvoice(token);
  const labels = invoice.labels || {};
  const accent = invoice.accent_color || "#7c3aed";
  const title = invoice.direction === "payable" ? "Received invoice" : labels.invoice || "Invoice";

  return (
    <main className="min-h-screen bg-[#07070a] px-4 py-8 text-zinc-100 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-sm font-semibold shadow-2xl shadow-black/30">
              FC
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">FinCopilot</p>
              <p className="text-xs text-zinc-500">Secure shared invoice</p>
            </div>
          </div>
          <a
            href={`/i/${encodeURIComponent(token)}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.1]"
          >
            View PDF
          </a>
        </div>

        <article className="overflow-hidden rounded-[28px] border border-white/10 bg-[#101014] shadow-2xl shadow-black/40">
          <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
          <div className="p-6 sm:p-9">
            <header className="grid gap-7 border-b border-white/10 pb-8 sm:grid-cols-[1fr_auto]">
              <div>
                {invoice.logo_url ? (
                  <img
                    src={`/i/${encodeURIComponent(token)}/logo`}
                    alt="Issuer logo"
                    className="mb-5 max-h-14 max-w-48 object-contain object-left"
                  />
                ) : null}
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                  {title}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {invoice.number ? `#${invoice.number}` : title}
                </h1>
                <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium capitalize text-zinc-300">
                  {invoice.state || invoice.status}
                </div>
              </div>
              <div className="sm:text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                  {labels.balance || "Balance due"}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight" style={{ color: accent }}>
                  {money(invoice.balance, invoice.currency)}
                </p>
                <dl className="mt-4 space-y-1.5 text-sm text-zinc-400">
                  <div className="flex gap-3 sm:justify-end">
                    <dt>{labels.issueDate || "Issue date"}</dt>
                    <dd className="font-medium text-zinc-200">{dateLabel(invoice.issue_date)}</dd>
                  </div>
                  <div className="flex gap-3 sm:justify-end">
                    <dt>{labels.dueDate || "Due date"}</dt>
                    <dd className="font-medium text-zinc-200">{dateLabel(invoice.due_date)}</dd>
                  </div>
                </dl>
              </div>
            </header>

            <section className="grid gap-6 border-b border-white/10 py-8 sm:grid-cols-2">
              <PartyBlock title={labels.from || "From"} party={invoice.issuer} />
              <PartyBlock title={labels.billTo || "Bill to"} party={invoice.client} />
            </section>

            {invoice.has_line_items && invoice.lines.length ? (
              <section className="overflow-x-auto py-8">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.12em] text-zinc-500">
                    <tr>
                      <th className="pb-4 font-medium">{labels.description || "Description"}</th>
                      <th className="pb-4 text-right font-medium">{labels.quantity || "Qty"}</th>
                      <th className="pb-4 text-right font-medium">{labels.unitPrice || "Unit price"}</th>
                      <th className="pb-4 text-right font-medium">{labels.amount || "Amount"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {invoice.lines.map((line, index) => (
                      <tr key={`${line.description}-${index}`}>
                        <td className="py-4 pr-4 font-medium text-zinc-100">{line.description}</td>
                        <td className="py-4 text-right text-zinc-400">
                          {line.quantity}{line.unit ? ` ${line.unit}` : ""}
                        </td>
                        <td className="py-4 text-right text-zinc-400">
                          {money(line.unit_price, invoice.currency)}
                        </td>
                        <td className="py-4 text-right font-medium text-zinc-200">
                          {money(line.total, invoice.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ) : null}

            <section className="grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-[1fr_320px]">
              <div className="space-y-6 text-sm">
                {invoice.payment_details ? (
                  <TextBlock title={labels.paymentDetails || "Payment details"} value={invoice.payment_details} />
                ) : null}
                {invoice.notes ? <TextBlock title={labels.notes || "Notes"} value={invoice.notes} /> : null}
                {invoice.custom_fields?.map((field) => (
                  <TextBlock key={field.label} title={field.label} value={field.value} />
                ))}
              </div>

              <dl className="space-y-3 text-sm">
                <MoneyRow label={labels.subtotal || "Subtotal"} value={money(invoice.subtotal, invoice.currency)} />
                {Number(invoice.discount) !== 0 ? (
                  <MoneyRow label={labels.discount || "Discount"} value={money(invoice.discount, invoice.currency)} />
                ) : null}
                {Number(invoice.tax_total) !== 0 ? (
                  <MoneyRow label={labels.tax || "Tax"} value={money(invoice.tax_total, invoice.currency)} />
                ) : null}
                <MoneyRow label={labels.total || "Total"} value={money(invoice.total, invoice.currency)} strong />
                {Number(invoice.amount_paid) !== 0 ? (
                  <MoneyRow label={labels.paid || "Paid"} value={money(invoice.amount_paid, invoice.currency)} />
                ) : null}
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-4">
                  <dt className="font-semibold text-zinc-100">{labels.balance || "Balance due"}</dt>
                  <dd className="text-lg font-semibold" style={{ color: accent }}>
                    {money(invoice.balance, invoice.currency)}
                  </dd>
                </div>
              </dl>
            </section>

            {invoice.footer_note ? (
              <p className="mt-8 border-t border-white/10 pt-6 text-center text-xs leading-5 text-zinc-500">
                {invoice.footer_note}
              </p>
            ) : null}
          </div>
        </article>
        <p className="mt-5 text-center text-xs text-zinc-600">
          Shared securely through FinCopilot. The private link is the access key to this invoice.
        </p>
      </div>
    </main>
  );
}

function PartyBlock({ title, party }: { title: string; party: Party }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">{title}</p>
      <p className="font-semibold text-zinc-100">{party.name || party.legal_name || "—"}</p>
      {party.legal_name && party.legal_name !== party.name ? (
        <p className="mt-1 text-sm text-zinc-400">{party.legal_name}</p>
      ) : null}
      {party.address ? <p className="mt-2 whitespace-pre-line text-sm text-zinc-400">{party.address}</p> : null}
      {party.email ? <p className="mt-1 text-sm text-zinc-400">{party.email}</p> : null}
      {party.tax_ids?.map((taxId) => (
        <p key={`${taxId.label}-${taxId.value}`} className="mt-1 text-xs text-zinc-500">
          {taxId.label}: {taxId.value}
        </p>
      ))}
    </div>
  );
}

function TextBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">{title}</p>
      <p className="whitespace-pre-line leading-6 text-zinc-300">{value}</p>
    </div>
  );
}

function MoneyRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={strong ? "font-semibold text-zinc-100" : "text-zinc-400"}>{label}</dt>
      <dd className={strong ? "font-semibold text-zinc-100" : "font-medium text-zinc-200"}>{value}</dd>
    </div>
  );
}
