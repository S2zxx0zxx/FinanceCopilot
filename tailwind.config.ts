// ============================================================================
// tailwind.config.ts — DEPRECATED (Tailwind v4 ignores this file)
// ----------------------------------------------------------------------------
// Tailwind CSS v4 uses CSS-first configuration via the `@theme` directive in
// `globals.css`. This JS config file is no longer read by the Tailwind v4
// PostCSS plugin (`@tailwindcss/postcss`).
//
// The actual Tailwind v4 theme tokens for this monorepo live in:
//   • fincopilot-landing/src/app/globals.css  (landing — marketing site)
//   • frontend/src/app/globals.css            (frontend — authenticated SPA)
//
// This file is intentionally kept as an empty stub (rather than deleted) so
// legacy tooling / IDE plugins that still resolve `tailwind.config.ts` do not
// error. Do NOT add new theme values here — add them to the `@theme` block in
// the relevant `globals.css` instead.
// ============================================================================
import type { Config } from "tailwindcss";

const config: Config = {
  content: [],
};

export default config;
