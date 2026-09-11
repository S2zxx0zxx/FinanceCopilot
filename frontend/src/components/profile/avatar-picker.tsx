"use client";

import * as React from "react";
import { Check, LoaderCircle, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileAvatar } from "./profile-avatar";
import { api, type FinCopilotProfile, type ProfileAvatarMode, type ProfileAvatarPreset } from "@/lib/api";
import { cn } from "@/lib/utils";
import styles from "./avatar-picker.module.css";

type Selection = {
  mode: ProfileAvatarMode;
  presetId: string | null;
};

export function AvatarPicker({
  open,
  onOpenChange,
  profile,
  presets,
  accountImageUrl,
  onSaved,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: FinCopilotProfile;
  presets: ProfileAvatarPreset[];
  accountImageUrl?: string | null;
  onSaved: (profile: FinCopilotProfile) => void;
}>) {
  const initialSelection = React.useMemo<Selection>(() => ({
    mode: profile.avatar_mode === "preset" ? "preset" : "account",
    presetId: profile.avatar_mode === "preset" ? profile.preset_avatar_id : null,
  }), [profile.avatar_mode, profile.preset_avatar_id]);

  const [selection, setSelection] = React.useState<Selection>(initialSelection);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setSelection(initialSelection);
      setError(null);
    }
  }, [open, initialSelection]);

  const selectedPreset = selection.mode === "preset"
    ? presets.find(preset => preset.preset_id === selection.presetId) || null
    : null;

  const changed = selection.mode !== initialSelection.mode || selection.presetId !== initialSelection.presetId;
  const canSave = selection.mode === "account" || Boolean(selectedPreset);

  async function saveSelection() {
    if (!canSave || saving) return;
    setSaving(true);
    setError(null);
    try {
      const result = await api.updateProfileAvatar(selection.mode, selection.mode === "preset" ? selection.presetId : null);
      onSaved(result.profile);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update your avatar. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const previewUrl = selectedPreset?.asset_path || null;
  const previewLabel = selectedPreset?.label || "Your account avatar";

  return (
    <Dialog open={open} onOpenChange={value => !saving && onOpenChange(value)}>
      <DialogContent className={cn(styles.studio, "sm:max-w-[720px] p-5 sm:p-6 gap-5")}>
        <DialogHeader className="sr-only">
          <DialogTitle>Choose your profile avatar</DialogTitle>
          <DialogDescription>Select a FinCopilot preset or keep your signed-in account avatar.</DialogDescription>
        </DialogHeader>

        <section className={styles.hero} aria-label="Avatar preview">
          <div className={styles.previewRing}>
            <div className={styles.previewInner}>
              <ProfileAvatar
                avatarMode={selection.mode}
                presetAvatarUrl={previewUrl}
                displayName={profile.display_name || profile.email}
                accountImageUrl={accountImageUrl}
                size={88}
              />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[.18em] text-(--gold)">
              <Sparkles className="h-3.5 w-3.5" /> Avatar Studio
            </div>
            <h2 className="mt-2 font-display text-[22px] sm:text-[24px] font-bold tracking-[-.03em] text-(--text)">Make FinCopilot feel like yours.</h2>
            <p className="mt-2 max-w-[500px] text-[12px] sm:text-[13px] leading-relaxed text-(--text-secondary)">
              Pick a curated profile look or keep your signed-in account avatar. Your choice follows your FinCopilot profile across supported surfaces.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-(--border) bg-(--surface-subtle) px-2.5 py-1.5 text-[10px] font-medium text-(--text-secondary)">
              <ShieldCheck className="h-3.5 w-3.5 text-(--success)" /> Previewing: {previewLabel}
            </div>
          </div>
        </section>

        <div role="radiogroup" aria-label="Profile avatar choices" className={styles.presetGrid}>
          <button
            type="button"
            role="radio"
            aria-checked={selection.mode === "account"}
            onClick={() => setSelection({ mode: "account", presetId: null })}
            className={cn(styles.presetCard, selection.mode === "account" && styles.presetCardSelected)}
          >
            {selection.mode === "account" && <span className={styles.selectionMark}><Check className="h-3.5 w-3.5" /></span>}
            <div className={styles.avatarFrame}>
              <ProfileAvatar
                avatarMode="account"
                displayName={profile.display_name || profile.email}
                accountImageUrl={accountImageUrl}
                size={72}
              />
            </div>
            <span className="max-w-full truncate text-[12px] font-semibold">My account</span>
            <span className="text-[10px] text-(--text-tertiary)"><UserRound className="mr-1 inline h-3 w-3" />Default</span>
          </button>

          {presets.map((preset, index) => {
            const selected = selection.mode === "preset" && selection.presetId === preset.preset_id;
            return (
              <motion.button
                key={preset.preset_id}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`Use ${preset.label} avatar`}
                onClick={() => setSelection({ mode: "preset", presetId: preset.preset_id })}
                whileTap={{ scale: 0.98 }}
                className={cn(styles.presetCard, selected && styles.presetCardSelected)}
                style={{ "--avatar-tone": ["214 179 108", "244 114 182", "34 211 238", "250 204 21", "45 212 191", "168 85 247", "248 113 113"][index % 7] } as React.CSSProperties}
              >
                {selected && <span className={styles.selectionMark}><Check className="h-3.5 w-3.5" /></span>}
                <div className={styles.avatarFrame}>
                  <img src={preset.asset_path} alt="" draggable={false} />
                </div>
                <span className="max-w-full truncate text-[12px] font-semibold">{preset.label}</span>
                <span className="text-[10px] text-(--text-tertiary)">FinCopilot preset</span>
              </motion.button>
            );
          })}
        </div>

        {error && <div role="alert" className={styles.error}>{error}</div>}

        <div className={styles.footer}>
          <p className="hidden sm:block max-w-[330px] text-[10px] leading-relaxed text-(--text-tertiary)">
            Presets are stored as a profile preference. Your signed-in account image remains unchanged.
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:ml-auto">
            <button type="button" disabled={saving} onClick={() => onOpenChange(false)} className={styles.secondaryButton}>Cancel</button>
            <button type="button" disabled={!changed || !canSave || saving} onClick={saveSelection} className={styles.primaryButton}>
              {saving ? <span className="inline-flex items-center gap-2"><LoaderCircle className="h-4 w-4 animate-spin" />Saving…</span> : "Use this avatar"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
