"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { engineApi } from "@/lib/engine-api";

export default function BankOAuthCallbackPage() {
  const [status, setStatus] = React.useState<"working" | "success" | "error">("working");
  const [message, setMessage] = React.useState("Finishing your bank connection…");

  React.useEffect(() => {
    let active = true;
    const finish = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      const provider = params.get("provider") || sessionStorage.getItem("fincopilot.bank-provider") || undefined;
      if (!code) {
        if (!active) return;
        setStatus("error"); setMessage(params.get("error_description") || params.get("error") || "The bank did not return an authorisation code.");
        return;
      }
      try {
        await engineApi.post("/api/connections/oauth/callback", { code, state: state || undefined, provider });
        sessionStorage.removeItem("fincopilot.bank-provider");
        if (!active) return;
        setStatus("success"); setMessage("Your bank is connected. FinCopilot can now sync the accounts you authorised.");
        window.setTimeout(() => window.location.replace("/finance/connections?connected=1"), 900);
      } catch (err) {
        if (!active) return;
        setStatus("error"); setMessage(err instanceof Error ? err.message : "FinCopilot could not finish this bank connection.");
      }
    };
    void finish();
    return () => { active = false; };
  }, []);

  return <main className="min-h-screen grid place-items-center bg-background p-4"><div className="premium-card max-w-lg w-full p-8 text-center">{status === "working" ? <Loader2 className="size-9 animate-spin mx-auto text-accent" /> : status === "success" ? <CheckCircle2 className="size-10 mx-auto text-(--positive)" /> : <XCircle className="size-10 mx-auto text-(--negative)" />}<h1 className="font-display text-2xl font-bold mt-5">{status === "working" ? "Connecting your bank" : status === "success" ? "Bank connected" : "Connection needs attention"}</h1><p className="text-sm text-(--text-secondary) mt-3">{message}</p>{status === "error" && <Link href="/finance/connections" className="inline-flex mt-6 min-h-11 items-center rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground">Back to bank sync</Link>}</div></main>;
}
