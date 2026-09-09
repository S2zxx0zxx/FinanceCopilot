/** Exact paise conversion. Currency and direction remain separate ledger fields. */
export class MoneyNormalizer {
    static normalizeToPaise(raw) {
        let negative = false;
        const invalid = () => ({ amount_paise: null, is_negative_in_source: negative, is_valid: false });
        if (typeof raw !== 'string') return invalid();
        let value = raw.trim().replace(/^(?:INR|Rs\.?|₹)\s*/i, '').trim();
        if (/^\(.*\)$/.test(value)) { negative = true; value = value.slice(1, -1).trim(); }
        else if (value.startsWith('-')) { negative = true; value = value.slice(1).trim(); }
        else if (value.endsWith('-')) { negative = true; value = value.slice(0, -1).trim(); }
        else if (value.startsWith('+')) value = value.slice(1).trim();
        value = value.replace(/^(?:INR|Rs\.?|₹)\s*/i, '').trim();
        // Accept ungrouped, international or Indian grouping; do not guess comma decimals.
        if (!/^(?:\d+|\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})*,\d{3})(?:\.\d{1,2})?$/.test(value)) return invalid();
        const [whole, fraction = ''] = value.replaceAll(',', '').split('.');
        const paise = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
        if (paise > BigInt(Number.MAX_SAFE_INTEGER)) return invalid();
        return { amount_paise: Number(paise), is_negative_in_source: negative, is_valid: true };
    }
}
