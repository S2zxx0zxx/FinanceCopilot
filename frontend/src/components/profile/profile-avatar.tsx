"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export type ResolvedProfileAvatarProps = {
  avatarMode?: unknown;
  presetAvatarUrl?: unknown;
  displayName?: unknown;
  accountImageUrl?: string | null;
  size?: number;
  className?: string;
  imageClassName?: string;
};

function validText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function ProfileAvatar({
  avatarMode,
  presetAvatarUrl,
  displayName,
  accountImageUrl,
  size = 80,
  className,
  imageClassName,
}: Readonly<ResolvedProfileAvatarProps>) {
  const { user } = useUser();
  const accountSrc = accountImageUrl ?? user?.imageUrl ?? null;
  const presetSrc = avatarMode === "preset" ? validText(presetAvatarUrl) : null;
  const preferredSrc = presetSrc || accountSrc;
  const [src, setSrc] = React.useState<string | null>(preferredSrc);

  React.useEffect(() => {
    setSrc(preferredSrc);
  }, [preferredSrc]);

  const name = validText(displayName) || user?.fullName || user?.primaryEmailAddress?.emailAddress || "User";
  const initial = name.charAt(0).toUpperCase() || "U";

  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-linear-to-br from-(--accent-dim) via-(--surface-elevated) to-(--gold-light) text-(--text) ring-1 ring-inset ring-white/10",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {src ? (
        <img
          src={src}
          alt=""
          draggable={false}
          className={cn("h-full w-full select-none object-cover", imageClassName)}
          onError={() => {
            if (presetSrc && src === presetSrc && accountSrc) setSrc(accountSrc);
            else setSrc(null);
          }}
        />
      ) : (
        <span className="font-display font-bold" style={{ fontSize: Math.max(12, Math.round(size * 0.34)) }}>{initial}</span>
      )}
    </span>
  );
}
