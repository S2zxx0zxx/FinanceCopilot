# ADR-004 — AI Gateway and Provider Abstraction

**Date:** 2026-08-22  
**Status:** ACCEPTED  
**PRD Reference:** Section 28, Section 34  

---

## Decision

1. **All AI requests go through the backend AI Gateway.** The browser never calls OmniRouter, Gemini, or any other AI provider directly.

2. **All AI providers are adapters.** The `ai-gateway` domain depends on the `AIProvider` interface, never on a specific SDK.

3. **AI is never the source of financial truth.** All financial computations are deterministic. AI explains, summarizes, classifies, and proposes — it does not calculate authoritative values.

4. **Every tool call is authenticated, authorized, and audited.**

5. **The Evidence Validator blocks any AI response that cites data not present in tool outputs.**

---

## AI Provider Interface

```javascript
export const AIProviderInterface = {
  chat: async (messages, options) => ChatResponse,
  classify: async (text, categories, options) => Classification,
  embed: async (text) => Float32Array,
  healthCheck: async () => Boolean,
  name: String,
  version: String,
};
```

---

## Consequences

### Positive
- Provider keys never exposed to client
- Cost control centralized
- Policy enforcement centralized
- Provider swap requires only adapter change

### Negative
- Additional latency (client → API → gateway → provider)
- More complex architecture than direct API calls

---

## Compliance

- No AI provider SDK may be imported in `src/` (frontend)
- Every AI tool must be registered in `tool.registry.js`
- Every AI request writes to `ai_interactions` table
