# ADR-003 — Money Precision and Currency Handling

**Date:** 2026-08-22  
**Status:** ACCEPTED  
**PRD Reference:** Section 17 Rule 5  

---

## Context

Financial software has a well-known class of bugs caused by floating-point arithmetic. A balance of ₹1,234.56 stored as a DECIMAL or FLOAT can produce values like 1234.5600000000002 due to IEEE 754 representation. Accumulated over thousands of transactions, this results in incorrect totals.

---

## Decision

### 1. Storage — Integer Paise
ALL monetary amounts are stored as BIGINT representing the smallest currency unit:
- INR: paise (1 INR = 100 paise)
- USD: cents (1 USD = 100 cents)
- EUR: euro cents

```sql
-- CORRECT
amount_paise BIGINT NOT NULL    -- ₹1,234.56 stored as 123456

-- FORBIDDEN
amount DECIMAL(15,2)            -- risk of precision loss
amount FLOAT                    -- absolutely forbidden
amount NUMERIC(15,2)            -- acceptable if BIGINT unavailable, but BIGINT preferred
```

### 2. Computation — Integer Arithmetic Only
All calculations on monetary amounts use integer arithmetic:
```javascript
// CORRECT
const total = transactions.reduce((sum, t) => sum + t.amount_paise, 0);

// FORBIDDEN
const total = transactions.reduce((sum, t) => sum + (t.amount_paise / 100), 0) * 100;
```

### 3. Display — Format on Client
The client receives amounts in paise (integer) and formats for display:
```javascript
// Format ₹1,234.56 from 123456 paise
function formatINR(paise) {
  const amount = paise / 100;
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    minimumFractionDigits: 2 
  }).format(amount);
}
```

### 4. Currency Column — Always Explicit
Every monetary column must have a corresponding currency column:
```sql
amount_paise BIGINT NOT NULL,
currency TEXT NOT NULL DEFAULT 'INR'
```

### 5. Multi-Currency
Foreign currency transactions store both:
- Original amount in original currency
- INR equivalent at recorded FX rate
- FX rate at time of transaction
- FX source (bank-stated or estimated)

### 6. Indian Number System
Display uses Indian lakhs notation: ₹12,34,567.89 (not ₹1,234,567.89)

---

## Consequences

### Positive
- Exact arithmetic — no floating-point errors
- Correct totals across thousands of transactions
- Safe for regulatory compliance

### Negative
- All code must remember to use paise (easy to forget)
- Display conversion required everywhere

---

## Compliance

- CI lint rule: Reject any column definition with FLOAT or DECIMAL for money
- Code review: Any division of monetary amounts must be verified as safe
- API: All monetary values transmitted as integer paise with currency field
