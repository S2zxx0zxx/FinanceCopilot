"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  FolderTree,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import { useToast } from "@/hooks/use-toast";

type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  group_id: string | null;
  is_system: boolean;
  is_hidden: boolean;
  treat_as_transfer: boolean;
  is_ignored: boolean;
};

type CategoryGroup = {
  id: string;
  name: string;
  icon: string;
  color: string;
  position: number;
  is_system: boolean;
  is_hidden: boolean;
  categories: Category[];
};

type CategoryDraft = {
  name: string;
  icon: string;
  color: string;
  group_id: string;
  treat_as_transfer: boolean;
  is_ignored: boolean;
  is_hidden: boolean;
};

type GroupDraft = {
  name: string;
  icon: string;
  color: string;
  position: string;
  is_hidden: boolean;
};

const blankCategory = (): CategoryDraft => ({
  name: "",
  icon: "circle-help",
  color: "#6366F1",
  group_id: "",
  treat_as_transfer: false,
  is_ignored: false,
  is_hidden: false,
});

const blankGroup = (): GroupDraft => ({
  name: "",
  icon: "folder",
  color: "#6B7280",
  position: "0",
  is_hidden: false,
});

export default function CategoriesPage() {
  const { toast } = useToast();
  const [groups, setGroups] = React.useState<CategoryGroup[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [groupOpen, setGroupOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [editingGroup, setEditingGroup] = React.useState<CategoryGroup | null>(null);
  const [categoryDraft, setCategoryDraft] = React.useState<CategoryDraft>(blankCategory);
  const [groupDraft, setGroupDraft] = React.useState<GroupDraft>(blankGroup);

  const reload = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [groupRows, categoryRows] = await Promise.all([
        engineApi.get<CategoryGroup[]>("/category-groups?include_hidden=true"),
        engineApi.get<Category[]>("/categories?include_hidden=true"),
      ]);
      setGroups(Array.isArray(groupRows) ? groupRows : []);
      setCategories(Array.isArray(categoryRows) ? categoryRows : []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { void reload(); }, [reload]);

  const ungrouped = categories.filter((category) => !category.group_id);
  const hiddenCount = categories.filter((category) => category.is_hidden).length;
  const transferCount = categories.filter((category) => category.treat_as_transfer).length;

  const openCategory = (category: Category | null, groupId = "") => {
    setEditingCategory(category);
    setCategoryDraft(category ? {
      name: category.name,
      icon: category.icon,
      color: category.color,
      group_id: category.group_id ?? "",
      treat_as_transfer: category.treat_as_transfer,
      is_ignored: category.is_ignored,
      is_hidden: category.is_hidden,
    } : { ...blankCategory(), group_id: groupId });
    setCategoryOpen(true);
  };

  const openGroup = (group: CategoryGroup | null) => {
    setEditingGroup(group);
    setGroupDraft(group ? {
      name: group.name,
      icon: group.icon,
      color: group.color,
      position: String(group.position ?? 0),
      is_hidden: group.is_hidden,
    } : blankGroup());
    setGroupOpen(true);
  };

  const saveCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!categoryDraft.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: categoryDraft.name.trim(),
        icon: categoryDraft.icon.trim() || "circle-help",
        color: categoryDraft.color || "#6366F1",
        group_id: categoryDraft.group_id || null,
        treat_as_transfer: categoryDraft.treat_as_transfer,
        is_ignored: categoryDraft.is_ignored,
        ...(editingCategory ? { is_hidden: categoryDraft.is_hidden } : {}),
      };
      if (editingCategory) await engineApi.patch(`/categories/${editingCategory.id}`, payload);
      else await engineApi.post("/categories", payload);
      setCategoryOpen(false);
      toast({ title: editingCategory ? "Category updated" : "Category created" });
      await reload();
    } catch (cause) {
      toast({ title: "Could not save category", description: cause instanceof Error ? cause.message : "Please retry.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const saveGroup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!groupDraft.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: groupDraft.name.trim(),
        icon: groupDraft.icon.trim() || "folder",
        color: groupDraft.color || "#6B7280",
        position: Number(groupDraft.position) || 0,
        ...(editingGroup ? { is_hidden: groupDraft.is_hidden } : {}),
      };
      if (editingGroup) await engineApi.patch(`/category-groups/${editingGroup.id}`, payload);
      else await engineApi.post("/category-groups", payload);
      setGroupOpen(false);
      toast({ title: editingGroup ? "Category group updated" : "Category group created" });
      await reload();
    } catch (cause) {
      toast({ title: "Could not save category group", description: cause instanceof Error ? cause.message : "Please retry.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleCategoryHidden = async (category: Category) => {
    setSaving(true);
    try {
      if (category.is_hidden) {
        await engineApi.patch(`/categories/${category.id}`, { is_hidden: false });
      } else {
        const usage = await engineApi.get<{ rules?: { id: string; name: string }[] }>(`/categories/${category.id}/rule-usage`);
        const rules = usage.rules ?? [];
        let deactivateRules = false;
        if (rules.length) {
          deactivateRules = window.confirm(
            `${category.name} is assigned by ${rules.length} active rule${rules.length === 1 ? "" : "s"}: ${rules.map((rule) => rule.name).join(", ")}. Hide the category and deactivate those rules?`,
          );
          if (!deactivateRules) {
            const hideOnly = window.confirm("Keep those rules active and hide only the category?");
            if (!hideOnly) return;
          }
        }
        await engineApi.patch(`/categories/${category.id}?deactivate_rules=${deactivateRules ? "true" : "false"}`, { is_hidden: true });
      }
      await reload();
    } catch (cause) {
      toast({ title: "Could not change visibility", description: cause instanceof Error ? cause.message : "Please retry.", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const removeCategory = async (category: Category) => {
    if (category.is_system || !window.confirm(`Delete ${category.name}?`)) return;
    try {
      await engineApi.delete(`/categories/${category.id}`);
      toast({ title: "Category deleted" });
      await reload();
    } catch (cause) {
      toast({ title: "Category could not be deleted", description: cause instanceof Error ? cause.message : "It may still be used by transactions or rules.", variant: "destructive" });
    }
  };

  const toggleGroupHidden = async (group: CategoryGroup) => {
    try {
      await engineApi.patch(`/category-groups/${group.id}`, { is_hidden: !group.is_hidden });
      await reload();
    } catch (cause) {
      toast({ title: "Could not change group visibility", description: cause instanceof Error ? cause.message : "Please retry.", variant: "destructive" });
    }
  };

  const removeGroup = async (group: CategoryGroup) => {
    if (group.is_system || !window.confirm(`Delete ${group.name}? Categories must be moved first if this group is in use.`)) return;
    try {
      await engineApi.delete(`/category-groups/${group.id}`);
      toast({ title: "Category group deleted" });
      await reload();
    } catch (cause) {
      toast({ title: "Category group could not be deleted", description: cause instanceof Error ? cause.message : "Please retry.", variant: "destructive" });
    }
  };

  const toggleCollapse = (id: string) => setCollapsed((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/finance" className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-(--text-tertiary) hover:text-(--text-primary)"><ArrowLeft className="h-3.5 w-3.5" /> Finance tools</Link>
          <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-(--text-tertiary)">Money taxonomy</p>
          <h1 className="mt-1 font-display text-[28px] font-bold tracking-[-0.02em]">Categories & groups</h1>
          <p className="mt-1 max-w-2xl text-sm text-(--text-secondary)">Control the category structure used by transactions, budgets, reports and automation rules.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => openGroup(null)} className="min-h-11 rounded-xl border border-(--border) px-3 text-xs font-semibold hover:bg-(--surface-subtle)"><Plus className="mr-2 inline h-4 w-4" />New group</button>
          <button onClick={() => openCategory(null)} className="min-h-11 rounded-xl bg-accent px-4 text-xs font-semibold text-accent-foreground"><Plus className="mr-2 inline h-4 w-4" />New category</button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Categories" value={String(categories.length)} detail={`${hiddenCount} hidden`} />
        <Stat label="Groups" value={String(groups.length)} detail={`${groups.filter((group) => group.is_hidden).length} hidden`} />
        <Stat label="Transfer treatment" value={String(transferCount)} detail="Excluded from normal spending flow" />
      </div>

      <section className="premium-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-(--border) p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-sm font-semibold">Category structure</h2><p className="mt-1 text-xs text-(--text-tertiary)">System categories can be hidden but not deleted. Custom categories remain fully editable.</p></div>
          <button onClick={() => void reload()} disabled={loading} className="min-h-10 rounded-xl border border-(--border) px-3 text-xs font-semibold"><RefreshCw className={`mr-2 inline h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Refresh</button>
        </div>

        {loading ? <div className="p-10 text-center text-sm text-(--text-secondary)">Loading categories…</div> : error ? (
          <div className="p-10 text-center"><p className="text-sm text-(--negative)">{error}</p><button onClick={() => void reload()} className="mt-3 rounded-lg border border-(--border) px-3 py-2 text-xs font-semibold">Retry</button></div>
        ) : (
          <div>
            {groups.map((group) => {
              const groupCategories = categories.filter((category) => category.group_id === group.id);
              const isCollapsed = collapsed.has(group.id);
              return (
                <div key={group.id} className={group.is_hidden ? "opacity-60" : ""}>
                  <div className="flex items-center gap-2 border-b border-(--border) bg-(--surface-subtle) px-4 py-3">
                    <button onClick={() => toggleCollapse(group.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                      {isCollapsed ? <ChevronRight className="h-4 w-4 text-(--text-tertiary)" /> : <ChevronDown className="h-4 w-4 text-(--text-tertiary)" />}
                      <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: group.color }} />
                      <span className="truncate text-sm font-semibold">{group.name}</span>
                      <span className="text-[10px] text-(--text-tertiary)">{groupCategories.length} categories</span>
                      {group.is_system && <Badge>System</Badge>}{group.is_hidden && <Badge>Hidden</Badge>}
                    </button>
                    <button onClick={() => openCategory(null, group.id)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-(--surface)" title="Add category to group"><Plus className="h-3.5 w-3.5" /></button>
                    <button onClick={() => openGroup(group)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-(--surface)" title="Edit group"><Pencil className="h-3.5 w-3.5" /></button>
                    {group.is_system ? <button onClick={() => void toggleGroupHidden(group)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-(--surface)" title={group.is_hidden ? "Show group" : "Hide group"}>{group.is_hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}</button> : <button onClick={() => void removeGroup(group)} className="grid h-9 w-9 place-items-center rounded-lg text-(--negative) hover:bg-(--negative-light)" title="Delete group"><Trash2 className="h-3.5 w-3.5" /></button>}
                  </div>
                  {!isCollapsed && groupCategories.map((category) => <CategoryRow key={category.id} category={category} onEdit={() => openCategory(category)} onToggle={() => void toggleCategoryHidden(category)} onDelete={() => void removeCategory(category)} />)}
                </div>
              );
            })}
            {ungrouped.length > 0 && <div><div className="border-b border-(--border) bg-(--surface-subtle) px-4 py-3 text-sm font-semibold text-(--text-secondary)">Ungrouped</div>{ungrouped.map((category) => <CategoryRow key={category.id} category={category} onEdit={() => openCategory(category)} onToggle={() => void toggleCategoryHidden(category)} onDelete={() => void removeCategory(category)} />)}</div>}
            {categories.length === 0 && groups.length === 0 && <div className="p-10 text-center"><FolderTree className="mx-auto h-8 w-8 text-(--text-tertiary)" /><h3 className="mt-3 font-semibold">No category structure yet</h3><p className="mt-2 text-sm text-(--text-secondary)">Create a group and category to start organising transactions.</p></div>}
          </div>
        )}
      </section>

      {categoryOpen && <Modal title={editingCategory ? "Edit category" : "New category"} onClose={() => !saving && setCategoryOpen(false)}>
        <form onSubmit={saveCategory} className="space-y-4">
          <Field label="Name"><input required className="fc-field" value={categoryDraft.name} onChange={(e) => setCategoryDraft((draft) => ({ ...draft, name: e.target.value }))} placeholder="Dining, Salary, Travel…" /></Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Field label="Icon name"><input className="fc-field" value={categoryDraft.icon} onChange={(e) => setCategoryDraft((draft) => ({ ...draft, icon: e.target.value }))} /></Field><Field label="Colour"><input type="color" className="fc-field h-11 p-1" value={categoryDraft.color} onChange={(e) => setCategoryDraft((draft) => ({ ...draft, color: e.target.value }))} /></Field></div>
          <Field label="Group"><select className="fc-field" value={categoryDraft.group_id} onChange={(e) => setCategoryDraft((draft) => ({ ...draft, group_id: e.target.value }))}><option value="">Ungrouped</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></Field>
          <div className="grid gap-3 rounded-xl border border-(--border) bg-(--surface-subtle) p-4 sm:grid-cols-2"><Toggle label="Treat as transfer" detail="Exclude internal money movement from spending/income." checked={categoryDraft.treat_as_transfer} onChange={(checked) => setCategoryDraft((draft) => ({ ...draft, treat_as_transfer: checked }))} /><Toggle label="Ignore in analytics" detail="Keep transactions but omit this category from analytics." checked={categoryDraft.is_ignored} onChange={(checked) => setCategoryDraft((draft) => ({ ...draft, is_ignored: checked }))} />{editingCategory && <Toggle label="Hidden" detail="Hide from normal selectors without deleting history." checked={categoryDraft.is_hidden} onChange={(checked) => setCategoryDraft((draft) => ({ ...draft, is_hidden: checked }))} />}</div>
          <Actions saving={saving} onCancel={() => setCategoryOpen(false)} label={editingCategory ? "Save category" : "Create category"} />
        </form>
      </Modal>}

      {groupOpen && <Modal title={editingGroup ? "Edit category group" : "New category group"} onClose={() => !saving && setGroupOpen(false)}>
        <form onSubmit={saveGroup} className="space-y-4">
          <Field label="Name"><input required className="fc-field" value={groupDraft.name} onChange={(e) => setGroupDraft((draft) => ({ ...draft, name: e.target.value }))} placeholder="Essentials, Lifestyle, Income…" /></Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Field label="Icon"><input className="fc-field" value={groupDraft.icon} onChange={(e) => setGroupDraft((draft) => ({ ...draft, icon: e.target.value }))} /></Field><Field label="Colour"><input type="color" className="fc-field h-11 p-1" value={groupDraft.color} onChange={(e) => setGroupDraft((draft) => ({ ...draft, color: e.target.value }))} /></Field><Field label="Position"><input type="number" className="fc-field" value={groupDraft.position} onChange={(e) => setGroupDraft((draft) => ({ ...draft, position: e.target.value }))} /></Field></div>
          {editingGroup && <Toggle label="Hidden group" detail="Hide the group and its categories from normal selectors." checked={groupDraft.is_hidden} onChange={(checked) => setGroupDraft((draft) => ({ ...draft, is_hidden: checked }))} />}
          <Actions saving={saving} onCancel={() => setGroupOpen(false)} label={editingGroup ? "Save group" : "Create group"} />
        </form>
      </Modal>}

      <style jsx global>{`.fc-field{width:100%;min-height:44px;border:1px solid var(--border);border-radius:12px;padding:0 12px;background:var(--surface);color:var(--text-primary);font-size:13px;outline:none}.fc-field:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}`}</style>
    </div>
  );
}

function CategoryRow({ category, onEdit, onToggle, onDelete }: { category: Category; onEdit: () => void; onToggle: () => void; onDelete: () => void }) {
  return <div className={`flex items-center gap-3 border-b border-(--border) px-4 py-3 pl-8 sm:pl-12 ${category.is_hidden ? "opacity-55" : ""}`}><span className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: category.color }} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="truncate text-sm font-medium">{category.name}</span>{category.is_system && <Badge>System</Badge>}{category.is_hidden && <Badge>Hidden</Badge>}{category.treat_as_transfer && <Badge>Transfer</Badge>}{category.is_ignored && <Badge>Ignored</Badge>}</div><p className="mt-0.5 text-[10px] text-(--text-tertiary)">{category.icon}</p></div><button onClick={onEdit} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-(--surface-subtle)" title="Edit category"><Pencil className="h-3.5 w-3.5" /></button>{category.is_system ? <button onClick={onToggle} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-(--surface-subtle)" title={category.is_hidden ? "Show category" : "Hide category"}>{category.is_hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}</button> : <button onClick={onDelete} className="grid h-9 w-9 place-items-center rounded-lg text-(--negative) hover:bg-(--negative-light)" title="Delete category"><Trash2 className="h-3.5 w-3.5" /></button>}</div>;
}

function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-(--border) bg-(--surface-subtle) px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-(--text-tertiary)">{children}</span>; }
function Stat({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="premium-card p-4"><p className="text-[10px] font-mono uppercase tracking-wider text-(--text-tertiary)">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-(--text-tertiary)">{detail}</p></div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="flex flex-col gap-1.5"><span className="text-[11px] font-semibold text-(--text-secondary)">{label}</span>{children}</label>; }
function Toggle({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex cursor-pointer items-start gap-3"><input type="checkbox" className="mt-1" checked={checked} onChange={(e) => onChange(e.target.checked)} /><span><strong className="block text-xs">{label}</strong><span className="text-[11px] text-(--text-tertiary)">{detail}</span></span></label>; }
function Actions({ saving, onCancel, label }: { saving: boolean; onCancel: () => void; label: string }) { return <div className="flex justify-end gap-2"><button type="button" onClick={onCancel} disabled={saving} className="min-h-11 rounded-xl border border-(--border) px-4 text-xs font-semibold">Cancel</button><button type="submit" disabled={saving} className="min-h-11 rounded-xl bg-accent px-5 text-xs font-semibold text-accent-foreground disabled:opacity-50">{saving ? "Saving…" : label}</button></div>; }
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-(--border) bg-(--surface) p-5 shadow-2xl"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-lg font-bold">{title}</h2><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl border border-(--border)"><X className="h-4 w-4" /></button></div>{children}</div></div>; }
