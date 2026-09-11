"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, KeyRound, ShieldCheck, Smartphone, Trash2 } from "lucide-react";
import { engineApi } from "@/lib/engine-api";

type Passkey = { id: string; name: string; transports?: string[] | null; device_type?: string | null; backed_up?: boolean | null; created_at: string; last_used_at?: string | null };
type OidcConfig = { enabled: boolean; provider_name: string; local_auth_enabled: boolean };
type Setup = { secret: string; otpauth_uri: string };

function bytesFromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
  const raw = atob(base64);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}
function base64Url(value: ArrayBuffer) {
  const bytes = new Uint8Array(value); let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function registrationOptions(raw: any): PublicKeyCredentialCreationOptions {
  return {
    ...raw,
    challenge: bytesFromBase64Url(raw.challenge),
    user: { ...raw.user, id: bytesFromBase64Url(raw.user.id) },
    excludeCredentials: Array.isArray(raw.excludeCredentials) ? raw.excludeCredentials.map((item: any) => ({ ...item, id: bytesFromBase64Url(item.id) })) : undefined,
  } as PublicKeyCredentialCreationOptions;
}
function serializeRegistration(credential: PublicKeyCredential) {
  const response = credential.response as AuthenticatorAttestationResponse;
  return {
    id: credential.id,
    rawId: base64Url(credential.rawId),
    type: credential.type,
    authenticatorAttachment: credential.authenticatorAttachment,
    clientExtensionResults: credential.getClientExtensionResults(),
    response: {
      clientDataJSON: base64Url(response.clientDataJSON),
      attestationObject: base64Url(response.attestationObject),
      transports: typeof response.getTransports === "function" ? response.getTransports() : undefined,
    },
  };
}

export default function AdvancedSecurityPage() {
  const [passkeys, setPasskeys] = React.useState<Passkey[]>([]);
  const [oidc, setOidc] = React.useState<OidcConfig | null>(null);
  const [passkeyName, setPasskeyName] = React.useState("My passkey");
  const [totpSetup, setTotpSetup] = React.useState<Setup | null>(null);
  const [totpCode, setTotpCode] = React.useState("");
  const [disablePassword, setDisablePassword] = React.useState("");
  const [disableCode, setDisableCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setError(null);
    const results = await Promise.allSettled([
      engineApi.get<Passkey[]>("/api/passkeys"),
      engineApi.get<OidcConfig>("/api/auth/oidc/config"),
    ]);
    if (results[0].status === "fulfilled") setPasskeys(Array.isArray(results[0].value) ? results[0].value : []);
    if (results[1].status === "fulfilled") setOidc(results[1].value);
  }, []);
  React.useEffect(() => { void load(); }, [load]);

  const addPasskey = async () => {
    if (!window.PublicKeyCredential || !navigator.credentials) { setError("This browser does not support passkeys."); return; }
    setBusy(true); setError(null); setMessage(null);
    try {
      const challenge = await engineApi.post<any>("/api/passkeys/register/options", { name: passkeyName.trim() || "Passkey" });
      const created = await navigator.credentials.create({ publicKey: registrationOptions(challenge.options) }) as PublicKeyCredential | null;
      if (!created) throw new Error("Passkey creation was cancelled.");
      await engineApi.post("/api/passkeys/register/verify", { challenge_id: challenge.challenge_id, name: passkeyName.trim() || "Passkey", credential: serializeRegistration(created) });
      setMessage("Passkey registered successfully."); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Passkey could not be registered."); }
    finally { setBusy(false); }
  };

  const deletePasskey = async (passkey: Passkey) => {
    if (!window.confirm(`Delete passkey “${passkey.name}”?`)) return;
    setBusy(true); setError(null);
    try { await engineApi.delete(`/api/passkeys/${passkey.id}`); setMessage("Passkey removed."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Passkey could not be removed."); }
    finally { setBusy(false); }
  };

  const startTotp = async () => {
    setBusy(true); setError(null); setMessage(null);
    try { setTotpSetup(await engineApi.post<Setup>("/api/2fa/setup")); }
    catch (err) { setError(err instanceof Error ? err.message : "Authenticator setup could not start."); }
    finally { setBusy(false); }
  };
  const enableTotp = async () => {
    setBusy(true); setError(null);
    try { await engineApi.post("/api/2fa/enable", { code: totpCode.trim() }); setTotpSetup(null); setTotpCode(""); setMessage("Authenticator verification enabled for native FinCopilot sign-in."); }
    catch (err) { setError(err instanceof Error ? err.message : "That authenticator code could not be verified."); }
    finally { setBusy(false); }
  };
  const disableTotp = async () => {
    setBusy(true); setError(null);
    try { await engineApi.post("/api/2fa/disable", { password: disablePassword, code: disableCode.trim() }); setDisablePassword(""); setDisableCode(""); setMessage("Native authenticator verification disabled."); }
    catch (err) { setError(err instanceof Error ? err.message : "Authenticator verification could not be disabled."); }
    finally { setBusy(false); }
  };

  return <div className="max-w-5xl flex flex-col gap-6 pb-12">
    <header className="flex gap-3 items-start"><Link href="/finance" className="mt-1 grid size-10 place-items-center rounded-xl border border-(--border)" aria-label="Back"><ArrowLeft className="size-4" /></Link><div><p className="text-xs uppercase tracking-[.18em] text-accent">Sign-in protection</p><h1 className="font-display text-3xl font-bold mt-1">Advanced security</h1><p className="text-sm text-(--text-secondary) mt-2">FinCopilot uses Clerk for the primary hosted experience. Self-hosted and advanced deployments can additionally use native passkeys, authenticator codes and OIDC without changing your financial data model.</p></div></header>
    {error && <div role="alert" className="rounded-2xl border border-(--negative) p-4 text-sm text-(--negative)">{error}</div>}
    {message && <div className="rounded-2xl border border-(--positive) p-4 text-sm text-(--positive) flex gap-2"><CheckCircle2 className="size-4" />{message}</div>}

    <section className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><KeyRound className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">Passkeys</h2></div><p className="text-sm text-(--text-secondary) mt-2">Register a device or password-manager passkey for deployments where native FinCopilot authentication is enabled. Passkeys require HTTPS, except on localhost.</p><div className="mt-4 space-y-2">{passkeys.map((passkey) => <div key={passkey.id} className="rounded-xl border border-(--border) p-3 flex items-center justify-between gap-3"><div><p className="font-medium text-sm">{passkey.name}</p><p className="text-xs text-(--text-secondary) mt-1">Added {new Date(passkey.created_at).toLocaleDateString()}{passkey.last_used_at ? ` · last used ${new Date(passkey.last_used_at).toLocaleDateString()}` : ""}{passkey.backed_up ? " · synced" : ""}</p></div><button disabled={busy} onClick={() => void deletePasskey(passkey)} className="grid size-10 place-items-center rounded-lg border border-(--border) text-(--negative)" aria-label={`Delete ${passkey.name}`}><Trash2 className="size-4" /></button></div>)}{!passkeys.length && <p className="text-sm text-(--text-tertiary)">No native passkeys registered.</p>}</div><div className="flex flex-col sm:flex-row gap-2 mt-4"><input value={passkeyName} onChange={(event) => setPasskeyName(event.target.value)} maxLength={100} className="min-h-11 flex-1 rounded-xl border border-(--border) bg-(--surface) px-3" placeholder="Passkey name" /><button disabled={busy || !oidc?.local_auth_enabled} onClick={() => void addPasskey()} className="min-h-11 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground disabled:opacity-50">Add passkey</button></div>{oidc && !oidc.local_auth_enabled && <p className="text-xs text-(--warning) mt-2">Native credentials are disabled by this deployment&apos;s identity policy.</p>}</section>

    <section className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><Smartphone className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">Authenticator app (TOTP)</h2></div><p className="text-sm text-(--text-secondary) mt-2">This controls the native FinCopilot login path, separate from Clerk&apos;s own two-step verification settings.</p>{!totpSetup ? <button disabled={busy || !oidc?.local_auth_enabled} onClick={() => void startTotp()} className="mt-4 min-h-11 rounded-xl border border-(--border) px-4 text-sm font-medium disabled:opacity-50">Set up authenticator</button> : <div className="mt-4 rounded-2xl bg-(--surface-subtle) p-4"><p className="text-sm font-medium">Add this key to your authenticator app</p><code className="mt-2 block rounded-lg bg-(--surface) p-3 text-sm break-all select-all">{totpSetup.secret}</code><a href={totpSetup.otpauth_uri} className="inline-block mt-3 text-sm text-accent">Open in compatible authenticator</a><div className="flex gap-2 mt-4"><input inputMode="numeric" autoComplete="one-time-code" value={totpCode} onChange={(event) => setTotpCode(event.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="6-digit code" className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3" /><button disabled={busy || totpCode.length < 6} onClick={() => void enableTotp()} className="min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50">Verify & enable</button></div></div>}<details className="mt-5"><summary className="cursor-pointer text-sm text-(--text-secondary)">Disable native authenticator verification</summary><div className="grid sm:grid-cols-2 gap-2 mt-3"><input type="password" value={disablePassword} onChange={(event) => setDisablePassword(event.target.value)} placeholder="Native account password" className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3" /><input inputMode="numeric" value={disableCode} onChange={(event) => setDisableCode(event.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="Authenticator code" className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3" /></div><button disabled={busy || !disablePassword || disableCode.length < 6} onClick={() => void disableTotp()} className="mt-2 min-h-10 rounded-xl border border-(--negative) px-4 text-sm text-(--negative) disabled:opacity-50">Disable native TOTP</button></details></section>

    <section className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">Organisation identity (OIDC / SSO)</h2></div>{oidc ? <div className="mt-4 grid sm:grid-cols-3 gap-3"><div className="rounded-xl bg-(--surface-subtle) p-3"><p className="text-xs text-(--text-tertiary)">Provider</p><p className="font-semibold mt-1">{oidc.provider_name}</p></div><div className="rounded-xl bg-(--surface-subtle) p-3"><p className="text-xs text-(--text-tertiary)">SSO login</p><p className={`font-semibold mt-1 ${oidc.enabled ? "text-(--positive)" : ""}`}>{oidc.enabled ? "Available" : "Not configured"}</p></div><div className="rounded-xl bg-(--surface-subtle) p-3"><p className="text-xs text-(--text-tertiary)">Native credentials</p><p className="font-semibold mt-1">{oidc.local_auth_enabled ? "Allowed" : "SSO only"}</p></div></div> : <p className="text-sm text-(--text-secondary) mt-3">OIDC configuration is unavailable from this deployment.</p>}<p className="text-xs text-(--text-secondary) mt-4">OIDC client secrets and role mappings are server-side administration settings and are intentionally never exposed in the browser.</p></section>
  </div>;
}
