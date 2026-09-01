# Design System — AI Financial Life Manager

**Version:** 1.0  
**Status:** LOCKED (Phase 0)  
**PRD Reference:** Section 10, Section 11  
**Last Updated:** 2026-08-22

---

## 1. Design Philosophy

| Principle | Description |
|-----------|-------------|
| **Calm** | Reduce anxiety, not increase it |
| **Premium** | Next-generation fintech aesthetic |
| **Clarity** | High information density, never cluttered |
| **Trust** | Every data point labeled with its confidence/freshness |
| **Progressive Disclosure** | Show summary first, detail on demand |
| **Contextual Intelligence** | Show the right information at the right moment |
| **Accessible** | WCAG 2.1 AA minimum |
| **Meaningful Motion Only** | No decorative animation that distracts |

---

## 2. Reference Viewport

```
Primary: 390 × 844 (iPhone 14)
Responsive Range: 360px – 430px mobile
Also: tablet, desktop
```

The mobile UI must not be a compressed desktop layout.

---

## 3. Spacing System

All spacing values are multiples of 4px:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Micro gaps, icon padding |
| `--space-2` | 8px | Tight component spacing |
| `--space-3` | 12px | Card gap, list item gap |
| `--space-4` | 16px | Standard padding |
| `--space-5` | 20px | Page horizontal padding |
| `--space-6` | 24px | Card padding |
| `--space-7` | 28px | Section gap (min) |
| `--space-8` | 32px | Section gap (max) |
| `--space-10` | 40px | Large section separation |

Page padding: **20px** horizontal  
Card gap: **12px**  
Section gap: **28–32px**  
Card padding: **20–24px**

---

## 4. Border Radius System

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-hero` | 28px | Hero cards, main financial state card |
| `--radius-card` | 20px | Standard cards |
| `--radius-compact` | 16px | Compact cards, list items |
| `--radius-compact-alt` | 18px | Alternate compact |
| `--radius-button` | 14px | Primary/secondary buttons |
| `--radius-button-alt` | 16px | Alternate buttons |
| `--radius-input` | 16px | Text inputs |
| `--radius-sheet` | 28px | Bottom sheets (top corners) |
| `--radius-badge` | 999px | Pills, badges |
| `--radius-icon` | 12px | Icon containers |

---

## 5. Color System

### Base Palette

```css
/* Backgrounds */
--color-bg:               #F7F7F5;   /* App background */
--color-surface:          #FFFFFF;   /* Cards, surfaces */
--color-surface-elevated: #FFFFFF;   /* Elevated surfaces (modals) */
--color-surface-subtle:   #F2F2F0;   /* Subtle surface variant */

/* Text */
--color-text-primary:     #101010;   /* Primary text */
--color-text-secondary:   #5C5C5C;   /* Secondary text, labels */
--color-text-tertiary:    #8C8C8C;   /* Captions, hints */
--color-text-inverse:     #FFFFFF;   /* Text on dark/primary */
--color-text-disabled:    #BCBCBC;   /* Disabled state text */

/* Borders */
--color-border:           #E8E8E6;   /* Standard border */
--color-border-subtle:    #F0F0EE;   /* Subtle dividers */
--color-border-strong:    #D0D0CE;   /* Strong borders */

/* Brand / Primary */
--color-primary:          #1A1A2E;   /* Deep navy — primary brand */
--color-primary-alt:      #16213E;   /* Alternate primary */
--color-accent:           #0F3460;   /* Accent blue */
--color-accent-light:     #E8F0FF;   /* Light accent (backgrounds) */

/* Semantic — Financial States */
--color-positive:         #15803D;   /* Income, positive balance */
--color-positive-light:   #DCFCE7;   /* Positive background */
--color-negative:         #DC2626;   /* Expense, negative, debt */
--color-negative-light:   #FEE2E2;   /* Negative background */
--color-warning:          #D97706;   /* Warning, low balance, pressure */
--color-warning-light:    #FEF3C7;   /* Warning background */
--color-neutral:          #6B7280;   /* Neutral, transfer, pending */
--color-neutral-light:    #F3F4F6;   /* Neutral background */

/* Data Trust Labels */
--color-verified:         #15803D;   /* VERIFIED data */
--color-pending:          #D97706;   /* PENDING / processing */
--color-estimated:        #7C3AED;   /* ESTIMATED / AI-derived */
--color-stale:            #DC2626;   /* STALE data */
--color-partial:          #2563EB;   /* PARTIAL coverage */

/* AI / Intelligence */
--color-ai:               #7C3AED;   /* AI / intelligence accent */
--color-ai-light:         #F5F3FF;   /* AI background */

/* Safe-to-Spend Spectrum */
--color-sts-safe:         #15803D;   /* Comfortable */
--color-sts-moderate:     #D97706;   /* Watch this */
--color-sts-tight:        #DC2626;   /* Tight */

/* Overlay */
--color-overlay:          rgba(0, 0, 0, 0.5);
--color-overlay-light:    rgba(0, 0, 0, 0.2);
```

### Dark Mode (Future)

Dark mode is a planned future enhancement. Design tokens are structured to support it via a `[data-theme="dark"]` selector. Not required for V1 but do not hardcode light values without tokens.

---

## 6. Typography System

### Font Family

```css
--font-family-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-body:    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-mono:    'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
--font-family-number:  'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

Use `font-variant-numeric: tabular-nums` for all financial numbers so columns align.

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-hero` | 40px | 700 | 1.1 | Safe-to-Spend hero number |
| `--text-display` | 32px | 700 | 1.15 | Section hero numbers |
| `--text-h1` | 24px | 700 | 1.2 | Page titles |
| `--text-h2` | 20px | 600 | 1.25 | Section headings |
| `--text-h3` | 17px | 600 | 1.3 | Card headings |
| `--text-body-lg` | 16px | 400 | 1.5 | Body text (primary) |
| `--text-body` | 15px | 400 | 1.5 | Body text (secondary) |
| `--text-body-sm` | 14px | 400 | 1.5 | Small body |
| `--text-caption` | 12px | 400 | 1.4 | Captions, timestamps |
| `--text-micro` | 11px | 400 | 1.4 | Micro labels |
| `--text-label` | 12px | 600 | 1 | Uppercase labels, badges |
| `--text-button` | 15px | 600 | 1 | Button text |
| `--text-amount` | 28px | 700 | 1 | Transaction amounts |
| `--text-amount-sm` | 20px | 700 | 1 | Small amounts |

### Number Formatting Rules (CRITICAL)

- Always use `tabular-nums` for financial numbers
- Always show currency symbol (₹ for INR)
- Never show floating point arithmetic artifacts (use paise integer math server-side)
- Format: `₹1,23,456.78` (Indian number system: lakhs notation)
- Negative: `−₹1,234` (use actual minus sign, not hyphen)
- Estimates: `~₹1,234` (tilde prefix)
- Range: `₹1,200 – ₹1,400` (en-dash, spaces)
- Pending: show as muted with `PENDING` badge

---

## 7. Elevation / Shadow System

```css
--shadow-none:   none;
--shadow-xs:     0 1px 2px rgba(0,0,0,0.04);
--shadow-sm:     0 2px 8px rgba(0,0,0,0.06);
--shadow-md:     0 4px 16px rgba(0,0,0,0.08);
--shadow-lg:     0 8px 32px rgba(0,0,0,0.10);
--shadow-xl:     0 16px 48px rgba(0,0,0,0.14);
--shadow-sheet:  0 -4px 24px rgba(0,0,0,0.08);  /* bottom sheet */
--shadow-card:   0 2px 12px rgba(0,0,0,0.06);
--shadow-hero:   0 8px 40px rgba(26,26,46,0.12);
```

---

## 8. Motion / Animation System

```css
/* Durations */
--duration-instant:  0ms;
--duration-fast:     150ms;
--duration-normal:   250ms;
--duration-slow:     350ms;
--duration-xslow:    500ms;

/* Easing */
--ease-default:      cubic-bezier(0.25, 0.46, 0.45, 0.94);  /* ease-out */
--ease-spring:       cubic-bezier(0.34, 1.56, 0.64, 1);     /* spring */
--ease-sharp:        cubic-bezier(0.4, 0, 0.6, 1);          /* sharp */
--ease-smooth:       cubic-bezier(0.4, 0, 0.2, 1);          /* material */
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Rule:** No decorative animation. Every motion must serve a purpose (orientation, feedback, attention).

---

## 9. Touch Target Rules

Minimum touch target: **44×44px** (Apple HIG standard)  
Preferred for primary actions: **48×48px**  
Financial action buttons: **minimum 48px height**  
Bottom navigation items: **48px height** (or safe area + bottom padding)

---

## 10. Component Specifications

### 10.1 HeroFinancialState
- Shows Safe-to-Spend prominently
- Background: gradient using primary/accent colors
- Amount: `--text-hero` size, `--color-text-inverse`
- Always shows: amount, horizon, freshness badge
- Click → opens explanation/detail

### 10.2 SafeToSpend
- Server-calculated only
- Always shows: amount + horizon label + freshness indicator
- Color: `--color-sts-safe/moderate/tight` based on threshold
- Confidence/coverage badge when data is partial

### 10.3 MoneyMetricCard
- Used for: total balance, income, spending, debt
- Shows: label, amount, trend indicator, freshness
- Max height: auto — never clip content
- Padding: `--space-6`

### 10.4 AttentionItem
- Upcoming bill / unusual spend / low balance alert
- Never alarmist — informational tone
- Shows: what, when, how much, action CTA
- Left accent color by priority: warning (orange), info (blue), positive (green)

### 10.5 TransactionRow
- Shows: merchant icon/initial, merchant name, category, amount, date
- Amount: right-aligned, tabular-nums
- Direction: income (positive color), expense (primary color or negative for alerts)
- Pending: muted + PENDING badge
- Duplicate detected: flagged indicator

### 10.6 AccountCard
- Shows: institution name, account type, masked number, balance, last sync
- Balance: prominently sized
- Sync status: FreshnessBadge

### 10.7 InsightCard
- AI insight card
- Shows: insight text, confidence badge, evidence summary, action CTA
- AI badge always visible (never hide AI origin)
- Low confidence: shows LOW_CONFIDENCE badge
- Evidence: collapsed, expandable

### 10.8 FreshnessBadge
```
LIVE      → green, < 1 hour
RECENT    → green, 1–24 hours
STALE     → orange, 24–72 hours
OLD       → red, > 72 hours
PARTIAL   → blue, coverage < threshold
```

### 10.9 DataStateBadge
```
VERIFIED  → green
PENDING   → amber
ESTIMATED → purple
IMPORTED  → blue
MANUAL    → neutral
STALE     → red
PARTIAL   → blue
UNAVAILABLE → gray
```

### 10.10 BottomSheet
- Top border-radius: `--radius-sheet` (28px)
- Handle bar: centered, 36×4px, `--color-border`
- Shadow: `--shadow-sheet`
- Drag to dismiss
- Backdrop: `--color-overlay`
- Safe area bottom padding

### 10.11 Skeleton
- Animate: shimmer left-to-right
- Color: `--color-surface-subtle`
- Never show fake data in skeleton — only shapes
- Duration: `--duration-xslow` loop
- Respect `prefers-reduced-motion`

### 10.12 EmptyState
- Show: illustration (financial context), title, description, primary CTA
- Never: "Nothing here" without explanation and path forward
- Tone: helpful, not dismissive

### 10.13 ErrorRecovery
- Show: what went wrong (safely — no stack traces), what user can do
- Always: retry action, contact/help path
- Never: expose technical details, provider names, internal IDs

### 10.14 Toast
- Position: top-center on mobile
- Duration: 4s (info/success), persistent (error until dismissed)
- Types: success (green), info (blue), warning (orange), error (red)
- Max width: 90% viewport

---

## 11. Bottom Navigation Bar

5 tabs only:

| Tab | Icon | Label | Route |
|-----|------|-------|-------|
| Home | house | Home | / |
| Money | wallet | Money | /money |
| Plan | calendar | Plan | /plan |
| AI | sparkle | AI | /ai |
| You | person | You | /you |

- Height: 56px + safe area bottom inset
- Active: primary color fill, label visible
- Inactive: tertiary color, label optional
- Tab bar background: `--color-surface` with top border

---

## 12. Data Trust Visual Language

Every financial value must communicate its trust state:

```
₹45,230    → clean, no badge      = VERIFIED, fresh
₹45,230 ●  → PENDING badge        = being processed
~₹45,000   → tilde prefix         = ESTIMATED
₹45,230 ⚠  → STALE badge          = not recently updated
₹45,230 ◑  → PARTIAL badge        = incomplete data
—          → dash                  = UNAVAILABLE
```

This is a trust feature, not a UX decoration.

---

## 13. Accessibility Requirements

| Requirement | Standard |
|-------------|---------|
| Color contrast (normal text) | ≥ 4.5:1 |
| Color contrast (large text) | ≥ 3:1 |
| Color contrast (UI components) | ≥ 3:1 |
| Focus indicator | Visible, 2px minimum |
| Touch targets | ≥ 44×44px |
| Screen reader labels | All interactive elements |
| Heading hierarchy | Single H1 per page |
| State cues | Never color-only |
| Keyboard navigation | All interactions reachable |
| Alt text | All meaningful images |

---

## 14. CSS Token File Location

```
src/styles/tokens.css       → all CSS custom properties
src/styles/base.css         → reset, html/body, font-face
src/styles/typography.css   → text utility classes
src/styles/components.css   → shared component styles
src/styles/utilities.css    → spacing, layout utilities
src/styles/animations.css   → keyframes, transitions
```

---

## 15. Design System Governance

- All new UI must use design tokens. No hardcoded values.
- Any new token must be added to `tokens.css` first.
- Token changes are a design system version bump.
- Accessibility audit required before Phase 6 (Home + Money).
- Mobile-first: build and test on 390px first, scale up.
