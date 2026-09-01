# Screen Inventory — 48 Screens

**Status:** Phase 0 — Defined, Not Implemented  
**Last Updated:** 2026-08-22

---

## Implementation Status Key

```
❌ NOT STARTED
🔄 IN PROGRESS  
✅ VERIFIED DONE
⛔ BLOCKED
```

---

## Onboarding Group (Screens 00–07)

### Screen 00 — Splash / Boot
| Field | Value |
|-------|-------|
| **ID** | SCR-00 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | App initialization, auth check, routing |
| **User Job** | Land in correct state without confusion |
| **Entry Points** | App launch |
| **Exit Paths** | → 01 Welcome (new user), → 08 Home (returning authenticated), → 40 Security (session expired) |
| **Key Data** | Auth token validity, onboarding completion flag |
| **States** | LOADING, ERROR, REDIRECT |
| **Security** | Do not flash sensitive data during boot |
| **PRD Requirement** | Phase 1 — Auth foundation |

---

### Screen 01 — Welcome
| Field | Value |
|-------|-------|
| **ID** | SCR-01 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | First impression, value proposition, CTA to begin |
| **User Job** | Understand what the app does and choose to begin |
| **Entry Points** | SCR-00 (new user) |
| **Exit Paths** | → 02 Trust & Privacy |
| **Key Data** | None (unauthenticated) |
| **States** | DEFAULT |
| **Design Note** | Calm, premium. No aggressive marketing. |
| **PRD Requirement** | Phase 1 — Onboarding |

---

### Screen 02 — Trust & Privacy
| Field | Value |
|-------|-------|
| **ID** | SCR-02 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Explain data usage, consent, privacy upfront |
| **User Job** | Understand what data is collected, consent explicitly |
| **Entry Points** | SCR-01 |
| **Exit Paths** | → 03 Goal Setup (consented), → 01 (declined) |
| **Key Data** | Consent version, consent timestamp |
| **States** | DEFAULT, CONSENT_REQUIRED |
| **Security** | Consent must be recorded server-side. Version-tracked. |
| **PRD Requirement** | Phase 1 — Consent |

---

### Screen 03 — Goal Setup
| Field | Value |
|-------|-------|
| **ID** | SCR-03 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Capture initial financial goals to personalize experience |
| **User Job** | Tell the app what matters most to them financially |
| **Entry Points** | SCR-02 (post-consent) |
| **Exit Paths** | → 04 Data Connection |
| **Key Data** | Goal type, target amount, timeline (draft) |
| **States** | DEFAULT, LOADING (save), SUCCESS, ERROR |
| **Notes** | Goals are draft until confirmed. Skip allowed. |
| **PRD Requirement** | Phase 7 — Goals |

---

### Screen 04 — Data Connection
| Field | Value |
|-------|-------|
| **ID** | SCR-04 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Guide user to connect/import their first financial data |
| **User Job** | Get their financial data into the system |
| **Entry Points** | SCR-03 |
| **Exit Paths** | → 05 Connection Flow, → 07 First Value (if skipped/later) |
| **Key Data** | Available import methods |
| **States** | DEFAULT, LOADING |
| **V1 Methods** | PDF, CSV, Excel, Receipt, Manual, Voice |
| **PRD Requirement** | Phase 2 — Import |

---

### Screen 05 — Connection Flow
| Field | Value |
|-------|-------|
| **ID** | SCR-05 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | File upload / manual entry flow for import |
| **User Job** | Upload a statement or enter transactions |
| **Entry Points** | SCR-04 |
| **Exit Paths** | → 06 First Sync |
| **Key Data** | Upload status, file validation result |
| **States** | DEFAULT, UPLOADING, VALIDATING, ERROR, SUCCESS |
| **Security** | File validation: type, size, parser safety, no macros |
| **PRD Requirement** | Phase 2 — Import |

---

### Screen 06 — First Sync
| Field | Value |
|-------|-------|
| **ID** | SCR-06 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Show real processing status while pipeline runs |
| **User Job** | Trust that data is being processed correctly |
| **Entry Points** | SCR-05 |
| **Exit Paths** | → 07 First Value |
| **Key Data** | Job status, processing stage, estimated completion |
| **States** | PROCESSING, PARTIAL, COMPLETE, ERROR |
| **NEVER** | Fake progress bars or fabricated completion states |
| **PRD Requirement** | Phase 2 — Import + Phase 3 — Normalization |

---

### Screen 07 — First Value
| Field | Value |
|-------|-------|
| **ID** | SCR-07 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Show first meaningful financial insight post-import |
| **User Job** | See immediate value from their data |
| **Entry Points** | SCR-06 |
| **Exit Paths** | → 08 Home |
| **Key Data** | First reconciled financial snapshot |
| **States** | DEFAULT, PARTIAL (low data), EMPTY (no usable data) |
| **Design Note** | Truthful anticipation — show real data, label estimates |
| **PRD Requirement** | Phase 5 — Ledger / Financial State |

---

## Core Navigation Group (Screens 08–14)

### Screen 08 — Home
| Field | Value |
|-------|-------|
| **ID** | SCR-08 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Financial command center |
| **User Job** | Understand most important financial state in seconds |
| **Priority Order** | Greeting → Safe-to-Spend → Money Outlook → Needs Attention → This Month → Spending Story → AI Insight |
| **Entry Points** | Boot (returning user), bottom nav |
| **Exit Paths** | All major screens via nav + attention items |
| **Key Data** | Safe-to-Spend, balances, upcoming commitments, AI insight |
| **States** | DEFAULT, LOADING, SKELETON, PARTIAL, STALE, OFFLINE, ERROR |
| **NEVER** | Show stale data as current. Always show freshness. |
| **PRD Requirement** | Phase 6 — Home + Money |

---

### Screen 09 — Data Coverage & Trust Center
| Field | Value |
|-------|-------|
| **ID** | SCR-09 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Show user what data exists, why, what's connected, coverage |
| **User Job** | Trust the financial picture, understand gaps |
| **Entry Points** | Home (coverage badge), You tab |
| **Exit Paths** | → 35 Connections, → 04 Data Connection |
| **Key Data** | Connected sources, coverage percentage, last sync |
| **States** | DEFAULT, PARTIAL, EMPTY |
| **PRD Requirement** | Phase 11 — Trust / Operations |

---

### Screen 10 — Money Overview
| Field | Value |
|-------|-------|
| **ID** | SCR-10 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Total financial picture across all accounts |
| **User Job** | See net worth, total cash, total debt at a glance |
| **Entry Points** | Money tab (bottom nav) |
| **Exit Paths** | → 11 Accounts, → 13 Transactions |
| **Key Data** | Net position, account totals, by type breakdown |
| **States** | DEFAULT, LOADING, SKELETON, PARTIAL, STALE, OFFLINE |
| **PRD Requirement** | Phase 6 — Home + Money |

---

### Screen 11 — Accounts
| Field | Value |
|-------|-------|
| **ID** | SCR-11 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | List all connected/imported accounts |
| **User Job** | See all accounts and their current status |
| **Entry Points** | SCR-10, You tab |
| **Exit Paths** | → 12 Account Detail |
| **Key Data** | Account list, balances, last sync, status |
| **States** | DEFAULT, LOADING, EMPTY, PARTIAL, STALE |
| **PRD Requirement** | Phase 6 — Home + Money |

---

### Screen 12 — Account Detail
| Field | Value |
|-------|-------|
| **ID** | SCR-12 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Detailed view of single account |
| **User Job** | Review account balance, transactions, sync status |
| **Entry Points** | SCR-11 |
| **Exit Paths** | → 13 Transactions (filtered), → 14 Transaction Detail |
| **Key Data** | Account balance, transaction list, sync metadata |
| **States** | DEFAULT, LOADING, SKELETON, STALE, OFFLINE, ERROR |
| **PRD Requirement** | Phase 6 |

---

### Screen 13 — Transactions
| Field | Value |
|-------|-------|
| **ID** | SCR-13 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Browse all transactions across accounts |
| **User Job** | Find, review, and correct transactions |
| **Entry Points** | Money tab, Account Detail, Search |
| **Exit Paths** | → 14 Transaction Detail, → 16 Filter Sheet |
| **Key Data** | Paginated transaction list, filters, search |
| **States** | DEFAULT, LOADING, SKELETON, EMPTY, PARTIAL, OFFLINE |
| **Performance** | Paginated — never unbounded query |
| **PRD Requirement** | Phase 6 |

---

### Screen 14 — Transaction Detail
| Field | Value |
|-------|-------|
| **ID** | SCR-14 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Full detail of single transaction with correction |
| **User Job** | Review, understand, and correct a transaction |
| **Entry Points** | SCR-13, SCR-12, Search |
| **Exit Paths** | Back |
| **Key Data** | Full transaction fields, category, merchant, source provenance |
| **States** | DEFAULT, PENDING, LOADING, ERROR |
| **Correction** | Auditable — preserves original + new value + actor + timestamp |
| **PRD Requirement** | Phase 6 |

---

## Discovery Group (Screens 15–18)

### Screen 15 — Smart Search
| Field | Value |
|-------|-------|
| **ID** | SCR-15 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Natural language + structured financial search |
| **User Job** | Find any transaction, merchant, account, goal |
| **Entry Points** | Global search, Home |
| **Exit Paths** | → 14 Transaction Detail, → 12 Account Detail, → 25 Goal Detail |
| **Key Data** | Search results (transactions, merchants, accounts, goals, recurring, insights) |
| **States** | DEFAULT, LOADING, EMPTY, ERROR |
| **AI Note** | NL search via AI Gateway — must respect auth scope |
| **PRD Requirement** | Phase 6, Phase 10 |

---

### Screen 16 — Filter Sheet
| Field | Value |
|-------|-------|
| **ID** | SCR-16 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Filter transactions by date, category, account, amount, type |
| **User Job** | Narrow down transaction view |
| **Entry Points** | SCR-13, SCR-18 |
| **Exit Paths** | Back to calling screen with filters applied |
| **Component** | BottomSheet + filter controls |
| **PRD Requirement** | Phase 6 |

---

### Screen 17 — Spending Story
| Field | Value |
|-------|-------|
| **ID** | SCR-17 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Visual narrative of spending patterns over time |
| **User Job** | Understand how money is being spent |
| **Entry Points** | Home, Money tab |
| **Exit Paths** | → 18 Category Detail |
| **Key Data** | Spending by category, time period, trends |
| **States** | DEFAULT, LOADING, PARTIAL, EMPTY |
| **Design** | SpendingStory component — visual, non-shaming |
| **PRD Requirement** | Phase 6 |

---

### Screen 18 — Category Detail
| Field | Value |
|-------|-------|
| **ID** | SCR-18 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Drill into a specific spending category |
| **User Job** | Understand spending in one category, find specific transactions |
| **Entry Points** | SCR-17, SCR-32 Money Leaks |
| **Exit Paths** | → 14 Transaction Detail, → 16 Filter Sheet |
| **Key Data** | Category total, transactions, trend, subcategories |
| **PRD Requirement** | Phase 6 |

---

## Planning Group (Screens 19–27)

### Screen 19 — Recurring
| Field | Value |
|-------|-------|
| **ID** | SCR-19 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Show all detected recurring payments and income |
| **User Job** | Review, confirm, or correct recurring series |
| **Entry Points** | Plan tab, Home (attention item) |
| **Exit Paths** | → 14 Transaction Detail, → 20 Upcoming |
| **Key Data** | RecurringSeries list, status, confidence |
| **States** | DEFAULT, LOADING, EMPTY, PARTIAL |
| **PRD Requirement** | Phase 7 |

---

### Screen 20 — Upcoming
| Field | Value |
|-------|-------|
| **ID** | SCR-20 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Timeline of upcoming committed payments |
| **User Job** | Know what money is leaving soon |
| **Entry Points** | Plan tab, Home |
| **Exit Paths** | → 14 Transaction Detail, → 19 Recurring |
| **Key Data** | Commitment list, due dates, amounts |
| **PRD Requirement** | Phase 7 |

---

### Screen 21 — Cashflow
| Field | Value |
|-------|-------|
| **ID** | SCR-21 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Income vs expenses cashflow view |
| **User Job** | See money in vs out, identify pressure points |
| **Entry Points** | Plan tab |
| **Exit Paths** | → 22 Forecast, → 13 Transactions |
| **Key Data** | Income total, expense total, net, by period |
| **PRD Requirement** | Phase 7 |

---

### Screen 22 — Forecast
| Field | Value |
|-------|-------|
| **ID** | SCR-22 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Show financial forecast (7/30/90 day) |
| **User Job** | Understand future financial position |
| **Entry Points** | Plan tab |
| **Exit Paths** | → 26 What-if Simulator, → 31 Can I Afford This? |
| **Key Data** | Forecast range, drivers, assumptions, confidence, coverage |
| **States** | DEFAULT, LOADING, PARTIAL, INSUFFICIENT_DATA, STALE |
| **NEVER** | Show false precision. Always show confidence + coverage. |
| **PRD Requirement** | Phase 8 |

---

### Screen 23 — Plan
| Field | Value |
|-------|-------|
| **ID** | SCR-23 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Planning hub — goals, budgets, upcoming |
| **User Job** | See the full financial plan at a glance |
| **Entry Points** | Plan tab (primary) |
| **Exit Paths** | → 24 Goals, → 20 Upcoming, → 21 Cashflow, → 22 Forecast |
| **PRD Requirement** | Phase 7 |

---

### Screen 24 — Goals
| Field | Value |
|-------|-------|
| **ID** | SCR-24 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | List all financial goals |
| **User Job** | Track progress toward goals |
| **Entry Points** | SCR-23, Plan tab |
| **Exit Paths** | → 25 Goal Detail |
| **Key Data** | Goal list, progress, status |
| **PRD Requirement** | Phase 7 |

---

### Screen 25 — Goal Detail
| Field | Value |
|-------|-------|
| **ID** | SCR-25 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Detailed view of single goal with tracking |
| **User Job** | Understand goal status, contributions, timeline |
| **Entry Points** | SCR-24 |
| **Key Data** | Goal target, current, timeline, contributions |
| **PRD Requirement** | Phase 7 |

---

### Screen 26 — What-if Simulator
| Field | Value |
|-------|-------|
| **ID** | SCR-26 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Simulate financial scenarios before making decisions |
| **User Job** | Explore "what if I spend X" or "what if I save Y" |
| **Entry Points** | SCR-22, SCR-31, AI tab |
| **Key Data** | Scenario inputs, projected impact, trade-offs |
| **AI Note** | AI proposes scenarios; deterministic engine calculates impact |
| **PRD Requirement** | Phase 10 |

---

### Screen 27 — Financial Health
| Field | Value |
|-------|-------|
| **ID** | SCR-27 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Overall financial health score and indicators |
| **User Job** | Understand financial wellbeing holistically |
| **Entry Points** | Plan tab, AI tab |
| **Key Data** | Health score, indicators, areas for improvement |
| **PRD Requirement** | Phase 7 |

---

## AI Group (Screens 28–32)

### Screen 28 — AI Home
| Field | Value |
|-------|-------|
| **ID** | SCR-28 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | AI insight feed and quick AI actions |
| **User Job** | See proactive AI insights about their finances |
| **Entry Points** | AI tab (bottom nav) |
| **Exit Paths** | → 29 AI Conversation, → 30 AI Insight Detail |
| **Key Data** | AI insights list, confidence, evidence |
| **States** | AI_AVAILABLE, AI_UNAVAILABLE, LOW_CONFIDENCE, INSUFFICIENT_DATA |
| **PRD Requirement** | Phase 10 |

---

### Screen 29 — AI Conversation
| Field | Value |
|-------|-------|
| **ID** | SCR-29 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Conversational AI interface for financial Q&A |
| **User Job** | Ask questions about their finances in natural language |
| **Entry Points** | SCR-28, Home, Global Action Sheet |
| **Key Data** | Conversation history, tool outputs, evidence |
| **States** | AI_AVAILABLE, AI_UNAVAILABLE, LOADING, ERROR, CORRECTION_REQUIRED |
| **Security** | All via AI Gateway. No direct LLM calls from client. |
| **PRD Requirement** | Phase 10 |

---

### Screen 30 — AI Insight Detail
| Field | Value |
|-------|-------|
| **ID** | SCR-30 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Deep detail on a single AI insight with evidence |
| **User Job** | Understand the evidence behind an AI insight |
| **Entry Points** | SCR-28, SCR-29, Home |
| **Key Data** | Answer, evidence, assumptions, impact, options |
| **PRD Requirement** | Phase 10 |

---

### Screen 31 — Can I Afford This?
| Field | Value |
|-------|-------|
| **ID** | SCR-31 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Evaluate affordability of a purchase |
| **User Job** | Get an honest answer about whether they can afford something |
| **Entry Points** | AI tab, Global Action Sheet |
| **Key Data** | Liquid funds, commitments, goals, forecast, safety buffer |
| **Output** | Options, trade-offs, projected impact, confidence, assumptions |
| **PRD Requirement** | Phase 10 |

---

### Screen 32 — Money Leaks
| Field | Value |
|-------|-------|
| **ID** | SCR-32 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Detect rising categories, unused subscriptions, unusual charges |
| **User Job** | Find where money is leaking without awareness |
| **Entry Points** | AI tab, Home (attention item) |
| **Key Data** | Detected leaks, evidence, estimated impact |
| **NEVER** | Shame the user. Inform only. |
| **PRD Requirement** | Phase 10 |

---

## Financial Detail Group (Screens 33–34)

### Screen 33 — Income
| Field | Value |
|-------|-------|
| **ID** | SCR-33 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | View all income sources and history |
| **User Job** | Understand income patterns and consistency |
| **Entry Points** | Money tab, Cashflow |
| **Key Data** | Income transactions, recurring income, salary, other |
| **PRD Requirement** | Phase 6 |

---

### Screen 34 — Credit & Liabilities
| Field | Value |
|-------|-------|
| **ID** | SCR-34 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | View credit card balances and known liabilities |
| **User Job** | Track what is owed and when payments are due |
| **Entry Points** | Money tab, Home (attention) |
| **Key Data** | Credit card balances, due dates, minimum payments |
| **V1 Note** | For cashflow/Safe-to-Spend correctness only. No lending marketplace. |
| **PRD Requirement** | Phase 6 |

---

## Operations Group (Screens 35–41)

### Screen 35 — Connections
| Field | Value |
|-------|-------|
| **ID** | SCR-35 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Manage all data connections and imports |
| **User Job** | Add, view, remove data sources |
| **Entry Points** | You tab, SCR-09 |
| **Exit Paths** | → 04 Data Connection, → 05 Connection Flow |
| **PRD Requirement** | Phase 11 |

---

### Screen 36 — Profile
| Field | Value |
|-------|-------|
| **ID** | SCR-36 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | User profile and account basics |
| **Entry Points** | You tab |
| **PRD Requirement** | Phase 1 |

---

### Screen 37 — Preferences
| Field | Value |
|-------|-------|
| **ID** | SCR-37 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | App preferences — currency, language, display |
| **Entry Points** | You tab, Settings |
| **PRD Requirement** | Phase 11 |

---

### Screen 38 — Notifications
| Field | Value |
|-------|-------|
| **ID** | SCR-38 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Notification history and settings |
| **Entry Points** | You tab, notification bell |
| **Key Data** | Notification list, notification preferences |
| **PRD Requirement** | Phase 11 |

---

### Screen 39 — Privacy
| Field | Value |
|-------|-------|
| **ID** | SCR-39 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Privacy center — what data, why, what shared, consent |
| **Entry Points** | You tab |
| **Key Data** | Consent records, data inventory, AI sharing preferences |
| **PRD Requirement** | Phase 11 |

---

### Screen 40 — Security
| Field | Value |
|-------|-------|
| **ID** | SCR-40 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Security settings — auth methods, sessions, activity |
| **Entry Points** | You tab |
| **PRD Requirement** | Phase 1 + Phase 11 |

---

### Screen 41 — Data & Export
| Field | Value |
|-------|-------|
| **ID** | SCR-41 |
| **Status** | ❌ NOT STARTED |
| **Purpose** | Export data, delete account, data lifecycle |
| **Entry Points** | You tab, Privacy |
| **Key Data** | Export options, deletion workflow |
| **Security** | Deletion requires confirmation + audit event |
| **PRD Requirement** | Phase 11 |

---

## Error / State Group (Screens 42–47)

### Screen 42 — Connection Error
| **ID** | SCR-42 | ❌ NOT STARTED |
| **Purpose** | Show when a data connection has failed |
| **Exit Paths** | → 35 Connections, retry |

### Screen 43 — Incomplete Data
| **ID** | SCR-43 | ❌ NOT STARTED |
| **Purpose** | Show when data coverage is insufficient for a feature |
| **Exit Paths** | → 04 Data Connection |

### Screen 44 — Empty State
| **ID** | SCR-44 | ❌ NOT STARTED |
| **Purpose** | Generic empty state component for no-data scenarios |
| **Note** | Reusable component, not a standalone page |

### Screen 45 — Global Search
| **ID** | SCR-45 | ❌ NOT STARTED |
| **Purpose** | Full-app search overlay |
| **Entry Points** | Any screen via search icon |

### Screen 46 — Global Action Sheet
| **ID** | SCR-46 | ❌ NOT STARTED |
| **Purpose** | Quick financial actions accessible from anywhere |
| **Entry Points** | FAB or action button on any screen |

### Screen 47 — Settings / About
| **ID** | SCR-47 | ❌ NOT STARTED |
| **Purpose** | App settings, version, legal, support |
| **Entry Points** | You tab |

---

## Implementation Matrix

| Screen | ID | Group | Phase | PRD Requirement | Status |
|--------|-----|-------|-------|----------------|--------|
| Splash / Boot | SCR-00 | Onboarding | Phase 1 | Auth | ❌ |
| Welcome | SCR-01 | Onboarding | Phase 1 | Onboarding | ❌ |
| Trust & Privacy | SCR-02 | Onboarding | Phase 1 | Consent | ❌ |
| Goal Setup | SCR-03 | Onboarding | Phase 7 | Goals | ❌ |
| Data Connection | SCR-04 | Onboarding | Phase 2 | Import | ❌ |
| Connection Flow | SCR-05 | Onboarding | Phase 2 | Import | ❌ |
| First Sync | SCR-06 | Onboarding | Phase 2+3 | Import+Norm | ❌ |
| First Value | SCR-07 | Onboarding | Phase 5 | Ledger | ❌ |
| Home | SCR-08 | Core | Phase 6 | Financial State | ❌ |
| Data Coverage | SCR-09 | Core | Phase 11 | Trust | ❌ |
| Money Overview | SCR-10 | Core | Phase 6 | Financial State | ❌ |
| Accounts | SCR-11 | Core | Phase 6 | Financial State | ❌ |
| Account Detail | SCR-12 | Core | Phase 6 | Financial State | ❌ |
| Transactions | SCR-13 | Core | Phase 6 | Financial State | ❌ |
| Transaction Detail | SCR-14 | Core | Phase 6 | Financial State | ❌ |
| Smart Search | SCR-15 | Discovery | Phase 6+10 | Search | ❌ |
| Filter Sheet | SCR-16 | Discovery | Phase 6 | Transactions | ❌ |
| Spending Story | SCR-17 | Discovery | Phase 6 | Financial State | ❌ |
| Category Detail | SCR-18 | Discovery | Phase 6 | Financial State | ❌ |
| Recurring | SCR-19 | Planning | Phase 7 | Recurring | ❌ |
| Upcoming | SCR-20 | Planning | Phase 7 | Commitments | ❌ |
| Cashflow | SCR-21 | Planning | Phase 7 | Cashflow | ❌ |
| Forecast | SCR-22 | Planning | Phase 8 | Forecast | ❌ |
| Plan | SCR-23 | Planning | Phase 7 | Plan | ❌ |
| Goals | SCR-24 | Planning | Phase 7 | Goals | ❌ |
| Goal Detail | SCR-25 | Planning | Phase 7 | Goals | ❌ |
| What-if Simulator | SCR-26 | Planning | Phase 10 | AI UX | ❌ |
| Financial Health | SCR-27 | Planning | Phase 7 | Health | ❌ |
| AI Home | SCR-28 | AI | Phase 10 | AI UX | ❌ |
| AI Conversation | SCR-29 | AI | Phase 10 | AI UX | ❌ |
| AI Insight Detail | SCR-30 | AI | Phase 10 | AI UX | ❌ |
| Can I Afford This? | SCR-31 | AI | Phase 10 | AI UX | ❌ |
| Money Leaks | SCR-32 | AI | Phase 10 | AI UX | ❌ |
| Income | SCR-33 | Financial | Phase 6 | Financial State | ❌ |
| Credit & Liabilities | SCR-34 | Financial | Phase 6 | Financial State | ❌ |
| Connections | SCR-35 | Operations | Phase 11 | Trust | ❌ |
| Profile | SCR-36 | Operations | Phase 1 | Auth | ❌ |
| Preferences | SCR-37 | Operations | Phase 11 | UX | ❌ |
| Notifications | SCR-38 | Operations | Phase 11 | Notifications | ❌ |
| Privacy | SCR-39 | Operations | Phase 11 | Privacy | ❌ |
| Security | SCR-40 | Operations | Phase 1+11 | Security | ❌ |
| Data & Export | SCR-41 | Operations | Phase 11 | Export | ❌ |
| Connection Error | SCR-42 | Error States | Phase 2 | Import | ❌ |
| Incomplete Data | SCR-43 | Error States | Phase 2 | Import | ❌ |
| Empty State | SCR-44 | Error States | Phase 6 | UX | ❌ |
| Global Search | SCR-45 | Global | Phase 6 | Search | ❌ |
| Global Action Sheet | SCR-46 | Global | Phase 6 | UX | ❌ |
| Settings / About | SCR-47 | Operations | Phase 11 | UX | ❌ |

**Total: 48 screens | Implemented: 0 | Remaining: 48**
