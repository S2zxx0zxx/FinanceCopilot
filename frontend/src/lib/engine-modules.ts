export type EngineModuleKey =
  | "assets"
  | "rules"
  | "categories"
  | "payees"
  | "collections"
  | "invoices"
  | "workspaces"
  | "currencies"
  | "groups"
  | "connections"
  | "imports";

export type EngineModuleConfig = {
  key: EngineModuleKey;
  title: string;
  eyebrow: string;
  description: string;
  endpoint: string;
  emptyTitle: string;
  emptyDescription: string;
  titleKeys: string[];
  subtitleKeys: string[];
};

export const ENGINE_MODULES: Record<EngineModuleKey, EngineModuleConfig> = {
  assets: {
    key: "assets",
    title: "Assets & investments",
    eyebrow: "Net worth engine",
    description: "Track holdings, valuations, market-priced assets and investment positions from the finance engine.",
    endpoint: "/assets",
    emptyTitle: "No assets yet",
    emptyDescription: "Add investments, property or other assets to extend your net-worth picture beyond cash accounts.",
    titleKeys: ["name", "symbol", "ticker"],
    subtitleKeys: ["asset_type", "valuation_method", "currency"],
  },
  rules: {
    key: "rules",
    title: "Automation rules",
    eyebrow: "Money automation",
    description: "Review the categorisation and transaction rules that automate repetitive financial housekeeping.",
    endpoint: "/rules",
    emptyTitle: "No automation rules",
    emptyDescription: "Rules can classify and transform matching transactions automatically.",
    titleKeys: ["name"],
    subtitleKeys: ["conditions_op", "is_active"],
  },
  categories: {
    key: "categories",
    title: "Categories",
    eyebrow: "Money taxonomy",
    description: "Manage the category system used by transactions, budgets, reports and automation.",
    endpoint: "/categories",
    emptyTitle: "No categories",
    emptyDescription: "Categories organise your spending and power reporting and rules.",
    titleKeys: ["name", "label"],
    subtitleKeys: ["type", "group_name", "icon"],
  },
  payees: {
    key: "payees",
    title: "Payees",
    eyebrow: "Money directory",
    description: "Keep the people and organisations attached to transactions and invoices organised.",
    endpoint: "/payees",
    emptyTitle: "No payees",
    emptyDescription: "Payees appear as transactions and invoice relationships are created.",
    titleKeys: ["name", "display_name"],
    subtitleKeys: ["email", "tax_id", "notes"],
  },
  collections: {
    key: "collections",
    title: "Collections",
    eyebrow: "Flexible grouping",
    description: "Group financial records into reusable collections for organisation and reporting.",
    endpoint: "/collections",
    emptyTitle: "No collections",
    emptyDescription: "Create collections when you want a flexible way to group related financial records.",
    titleKeys: ["name", "title"],
    subtitleKeys: ["description", "type"],
  },
  invoices: {
    key: "invoices",
    title: "Invoices",
    eyebrow: "Receivables",
    description: "Track invoices, payment state, public invoice links and supporting attachments.",
    endpoint: "/invoices",
    emptyTitle: "No invoices",
    emptyDescription: "Invoices will appear here when invoicing is enabled for the current workspace.",
    titleKeys: ["number", "invoice_number", "title", "description"],
    subtitleKeys: ["status", "due_date", "currency"],
  },
  workspaces: {
    key: "workspaces",
    title: "Workspaces",
    eyebrow: "Shared finance",
    description: "See personal and collaborative workspaces, roles and shared financial contexts.",
    endpoint: "/workspaces",
    emptyTitle: "No workspaces",
    emptyDescription: "Your personal workspace is created automatically when your account is provisioned.",
    titleKeys: ["name"],
    subtitleKeys: ["role", "workspace_type", "default_currency"],
  },
  currencies: {
    key: "currencies",
    title: "Currencies & FX",
    eyebrow: "Multi-currency",
    description: "Review currencies available to the finance engine and the basis for cross-currency reporting.",
    endpoint: "/currencies",
    emptyTitle: "No currencies available",
    emptyDescription: "Currency metadata will appear when the finance engine is initialised.",
    titleKeys: ["code", "name"],
    subtitleKeys: ["symbol", "decimal_places"],
  },
  groups: {
    key: "groups",
    title: "Groups & settlements",
    eyebrow: "Shared expenses",
    description: "Track shared-money groups, participants and settlement state.",
    endpoint: "/groups",
    emptyTitle: "No groups",
    emptyDescription: "Create a group when money is shared with friends, family or a team.",
    titleKeys: ["name", "title"],
    subtitleKeys: ["description", "currency", "status"],
  },
  connections: {
    key: "connections",
    title: "Bank connections",
    eyebrow: "Connected finance",
    description: "Review finance-engine bank connections alongside FinCopilot's India Account Aggregator connection centre.",
    endpoint: "/connections",
    emptyTitle: "No engine connections",
    emptyDescription: "Connect a supported provider when credentials and provider configuration are enabled.",
    titleKeys: ["institution_name", "provider", "name"],
    subtitleKeys: ["status", "provider", "last_sync_at"],
  },
  imports: {
    key: "imports",
    title: "Import history",
    eyebrow: "Data intake",
    description: "Audit imported transaction and asset files and the records created from them.",
    endpoint: "/import-logs",
    emptyTitle: "No imports yet",
    emptyDescription: "Imported statements and asset files will leave an auditable history here.",
    titleKeys: ["filename", "account_name", "entity"],
    subtitleKeys: ["format", "transaction_count", "created_at"],
  },
};

export function isEngineModuleKey(value: string): value is EngineModuleKey {
  return Object.prototype.hasOwnProperty.call(ENGINE_MODULES, value);
}
