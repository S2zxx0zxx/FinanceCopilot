"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShieldCheck, Lock, EyeOff, Download, Bell, User, ChevronRight,
} from "lucide-react";
import { currentUser, securityData, privacyData } from "@/lib/data";
import { formatDate } from "@/lib/format";

const SETTING_GROUPS = [
  {
    title: "Account",
    items: [
      { label: "Profile", desc: "Name, email, phone", href: "/you", icon: User },
    ],
  },
  {
    title: "Data & Privacy",
    items: [
      { label: "Connections", desc: "Bank & account links", href: "/you/connections", icon: ShieldCheck },
      { label: "Privacy Center", desc: "Consent, data inventory", href: "/you/privacy", icon: EyeOff },
      { label: "Security", desc: "2FA, sessions, activity", href: "/you/security", icon: Lock },
      { label: "Data & Export", desc: "Export or delete your data", href: "/you/export", icon: Download },
    ],
  },
  {
    title: "Preferences",
    items: [
      { label: "Preferences", desc: "Currency, language, display", href: "/you/connections", icon: Bell },
      { label: "Notifications", desc: "Alerts, emails, push", href: "/you/connections", icon: Bell },
    ],
  },
];

export default function YouPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">You</h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1">Profile, settings, and privacy</p>
      </motion.header>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="premium-card p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-white font-display font-bold text-[24px] shrink-0">
          {currentUser.displayName?.charAt(0) || "U"}
        </div>
        <div className="flex-1">
          <h2 className="font-display font-semibold text-[18px]">{currentUser.displayName}</h2>
          <p className="text-[13px] text-[var(--text-secondary)]">{currentUser.email}</p>
          <p className="text-[12px] text-[var(--text-tertiary)] mt-1">Member since {formatDate(currentUser.createdAt, { style: "long" })}</p>
        </div>
      </motion.div>

      {/* Security Score */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="premium-card p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-[12px] bg-[var(--positive-light)] flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-[var(--positive)]" />
        </div>
        <div className="flex-1">
          <h3 className="text-[14px] font-semibold">Security Score</h3>
          <p className="text-[12px] text-[var(--text-tertiary)]">{securityData.two_factor_enabled ? "2FA enabled" : "Enable 2FA"}</p>
        </div>
        <span className="font-display font-bold text-[28px] tabular-nums">{securityData.security_score}</span>
      </motion.div>

      {/* Settings Groups */}
      {SETTING_GROUPS.map((group, gi) => (
        <motion.section key={gi} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 + gi * 0.05 }}>
          <h2 className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-3 px-1">{group.title}</h2>
          <div className="premium-card overflow-hidden">
            {group.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link key={i} href={item.href} className={`flex items-center gap-3 p-4 hover:bg-[var(--surface-subtle)] transition-colors ${i < group.items.length - 1 ? "border-b border-[var(--border-subtle)]" : ""}`}>
                  <div className="w-9 h-9 rounded-[10px] bg-[var(--surface-subtle)] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-medium">{item.label}</p>
                    <p className="text-[12px] text-[var(--text-tertiary)]">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                </Link>
              );
            })}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
