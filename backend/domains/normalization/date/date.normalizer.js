const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
const empty = (ambiguous = false) => ({ date: null, is_ambiguous: ambiguous, format_used: null });
function calendar(year, month, day, format) {
    if (year < 1900 || year > 2200 || month < 1 || month > 12 || day < 1 || day > 31) return empty();
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return empty();
    return { date, is_ambiguous: false, format_used: format };
}
export class DateNormalizer {
    static normalizeDate(raw, { dateOrder } = {}) {
        if (typeof raw !== 'string' || !raw.trim()) return empty();
        const text = raw.trim().replace(/\s+/g, ' ');
        let m = /^(\d{4})[-/](\d{2})[-/](\d{2})$/.exec(text);
        if (m) return calendar(+m[1], +m[2], +m[3], 'YYYY-MM-DD');
        m = /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.exec(text);
        if (m) {
            if (!calendar(+m[1], +m[2], +m[3], 'ISO').date) return empty();
            const date = new Date(text);
            return Number.isFinite(date.getTime()) ? { date, is_ambiguous: false, format_used: 'ISO' } : empty();
        }
        m = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(text);
        if (m) {
            const a=+m[1], b=+m[2], y=+m[3];
            if (dateOrder === 'DMY' || a > 12 || a === b) return calendar(y,b,a,'DD/MM/YYYY');
            if (dateOrder === 'MDY' || b > 12) return calendar(y,a,b,'MM/DD/YYYY');
            return empty(true);
        }
        m = /^(\d{1,2})[- ]([A-Za-z]{3})[- ](\d{4})$/.exec(text);
        if (m) return calendar(+m[3],MONTHS.indexOf(m[2].toLowerCase())+1,+m[1],'DD-MMM-YYYY');
        m = /^([A-Za-z]{3}) (\d{1,2}),? (\d{4})$/.exec(text);
        if (m) return calendar(+m[3],MONTHS.indexOf(m[1].toLowerCase())+1,+m[2],'MMM DD YYYY');
        return empty(true);
    }
}
