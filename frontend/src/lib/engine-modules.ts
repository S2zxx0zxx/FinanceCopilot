export type EngineModuleKey =
  | "assets"
  | "asset-groups"
  | "rules"
  | "categories"
  | "category-groups"
  | "payees"
  | "collections"
  | "invoices"
  | "workspaces"
  | "currencies"
  | "groups"
  | "connections"
  | "imports";

export type EngineFieldType = "text" | "number" | "select" | "checkbox" | "date" | "textarea";

export type EngineFieldOption = {
  label: string;
  value: string;
};

export type EngineFieldConfig = {
  key: string;
  label: string;
  type?: EngineFieldType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | boolean;
  options?: EngineFieldOption[];
  createOnly?: boolean;
  editOnly?: boolean;
};

export type EngineCrudConfig = {
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  fields: EngineFieldConfig[];
};

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
  crud?: EngineCrudConfig;
};

const groupFields = (
  icon: string,
  color: string,
  includeHidden = false,
): EngineFieldConfig[] => [
  { key: "name", label: "Group name", required: true, placeholder: "Investments, Essentials…" },
  { key: "icon", label: "Icon name", defaultValue: icon, placeholder: icon },
  { key: "color", label: "Colour", defaultValue: color, placeholder: color },
  { key: "position", label: "Position", type: "number", defaultValue: "0" },
  ...(includeHidden
    ? [{ key: "is_hidden", label: "Hide group", type: "checkbox" as const, defaultValue: false, editOnly: true }]
    : []),
];

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
    subtitleKeys: ["type", "valuation_method", "currency"],
    crud: {
      create: true,
      edit: true,
      delete: true,
      fields: [
        { key: "name", label: "Asset name", required: true, placeholder: "Home, Gold, AAPL…" },
        {
          key: "type",
          label: "Asset type",
          type: "select",
          required: true,
          defaultValue: "investment",
          options: [
            { label: "Investment", value: "investment" },
            { label: "Real estate", value: "real_estate" },
            { label: "Vehicle", value: "vehicle" },
            { label: "Valuable", value: "valuable" },
            { label: "Other", value: "other" },
          ],
        },
        { key: "currency", label: "Currency", required: true, defaultValue: "INR", placeholder: "INR" },
        {
          key: "valuation_method",
          label: "Valuation method",
          type: "select",
          required: true,
          defaultValue: "manual",
          options: [
            { label: "Manual value", value: "manual" },
            { label: "Market price", value: "market_price" },
            { label: "Growth rule", value: "growth_rule" },
          ],
        },
        { key: "current_value", label: "Current value", type: "number", createOnly: true, placeholder: "0" },
        { key: "units", label: "Units / quantity", type: "number", placeholder: "1" },
        { key: "ticker", label: "Market ticker", placeholder: "AAPL, BTC-USD, RELIANCE.NS" },
        { key: "purchase_date", label: "Purchase date", type: "date" },
        { key: "purchase_price", label: "Purchase price", type: "number" },
        { key: "is_archived", label: "Archived", type: "checkbox", defaultValue: false },
      ],
    },
  },
  "asset-groups": {
    key: "asset-groups",
    title: "Asset groups",
    eyebrow: "Portfolio organisation",
    description: "Organise investments and other assets into wallets or portfolio groups without losing live valuation rollups.",
    endpoint: "/asset-groups",
    emptyTitle: "No asset groups",
    emptyDescription: "Create a group to organise related investments, properties or other holdings.",
    titleKeys: ["name"],
    subtitleKeys: ["institution_name", "source", "asset_count"],
    crud: {
      create: true,
      edit: true,
      delete: true,
      fields: groupFields("wallet", "#0EA5E9"),
    },
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
    subtitleKeys: ["group_name", "icon"],
    crud: {
      create: true,
      edit: true,
      delete: true,
      fields: [
        { key: "name", label: "Category name", required: true, placeholder: "Dining, Salary, Travel…" },
        { key: "icon", label: "Icon name", defaultValue: "circle-help", placeholder: "utensils" },
        { key: "color", label: "Colour", defaultValue: "#6B7280", placeholder: "#6B7280" },
        { key: "treat_as_transfer", label: "Treat as transfer", type: "checkbox", defaultValue: false },
        { key: "is_ignored", label: "Ignore in analytics", type: "checkbox", defaultValue: false },
        { key: "is_hidden", label: "Hide category", type: "checkbox", defaultValue: false, editOnly: true },
      ],
    },
  },
  "category-groups": {
    key: "category-groups",
    title: "Category groups",
    eyebrow: "Taxonomy structure",
    description: "Group spending and income categories into clean reporting sections while preserving protected system groups.",
    endpoint: "/category-groups",
    emptyTitle: "No category groups",
    emptyDescription: "Create a category group to structure reports, budgets and transaction classification.",
    titleKeys: ["name"],
    subtitleKeys: ["icon", "color", "is_system"],
    crud: {
      create: true,
      edit: true,
      delete: true,
      fields: groupFields("folder", "#6B7280", true),
    },
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
    subtitleKeys: ["email", "type", "notes"],
    crud: {
      create: true,
      edit: true,
      delete: true,
      fields: [
        { key: "name", label: "Payee name", required: true, placeholder: "Amazon, Rahul, Landlord…" },
        {
          key: "type",
          label: "Type",
          type: "select",
          options: [
            { label: "Not specified", value: "" },
            { label: "Person", value: "person" },
            { label: "Company", value: "company" },
          ],
        },
        { key: "email", label: "Email", placeholder: "name@example.com" },
        { key: "phone", label: "Phone", placeholder: "+91…" },
        { key: "website", label: "Website", placeholder: "https://…" },
        { key: "address", label: "Address", type: "textarea" },
        { key: "notes", label: "Notes", type: "textarea" },
        { key: "is_favorite", label: "Favourite", type: "checkbox", defaultValue: false, editOnly: true },
      ],
    },
  },
  collections: {
    key: "collections",
    title: "Collections",
    eyebrow: "Flexible grouping",
    description: "Group accounts and wallets into reusable collections for organisation and reporting.",
    endpoint: "/collections",
    emptyTitle: "No collections",
    emptyDescription: "Create collections when you want a flexible way to group related financial records.",
    titleKeys: ["name", "title"],
    subtitleKeys: ["icon", "color"],
    crud: {
      create: true,
      edit: true,
      delete: true,
      fields: [
        { key: "name", label: "Collection name", required: true, placeholder: "Family, Business, Travel…" },
        { key: "icon", label: "Icon name", defaultValue: "folder", placeholder: "folder" },
        { key: "color", label: "Colour", defaultValue: "#6B7280", placeholder: "#6B7280" },
        { key: "position", label: "Position", type: "number", defaultValue: "0" },
      ],
    },
  },
  invoices: {
    key: "invoices",
    title: "Invoices",
    eyebrow: "Receivables",
    description: "Track invoices, payment state, public invoice links and supporting attachments.",
    endpoint: "/invoices",
    emptyTitle: "No invoices",
    emptyDescription: "Invoices will appear here when invoicing is enabled for the current workspace.",
    titleKeys: ["number", "external_number", "description"],
    subtitleKeys: ["state", "due_date", "currency"],
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
