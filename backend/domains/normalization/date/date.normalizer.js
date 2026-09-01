/**
 * Date Normalizer
 * 
 * Deterministic date parsing across multiple standard formats.
 * Preserves source context. Fails safely if ambiguous.
 */
export class DateNormalizer {
    
    /**
     * Attempts to parse various date formats into an ISO String / Date object.
     * @param {string} rawDateText 
     * @returns {{ date: Date|null, is_ambiguous: boolean, format_used: string|null }}
     */
    static normalizeDate(rawDateText) {
        if (!rawDateText) {
            return { date: null, is_ambiguous: false, format_used: null };
        }

        const cleanText = rawDateText.trim().replace(/\s+/g, ' ');
        if (cleanText === '' || cleanText.toLowerCase() === 'n/a') {
            return { date: null, is_ambiguous: false, format_used: null };
        }

        // We will do deterministic regex matching to prevent JS Date.parse from silently guessing 01/02/2026 as Jan 2 or Feb 1.
        
        // 1. YYYY-MM-DD
        const yyyyMmDdMatch = /^(\d{4})[-/](\d{2})[-/](\d{2})(T.*)?$/.exec(cleanText);
        if (yyyyMmDdMatch) {
            const date = new Date(Date.UTC(Number.parseInt(yyyyMmDdMatch[1]), Number.parseInt(yyyyMmDdMatch[2]) - 1, Number.parseInt(yyyyMmDdMatch[3])));
            return { date, is_ambiguous: false, format_used: 'YYYY-MM-DD' };
        }

        // 2. DD/MM/YYYY or MM/DD/YYYY ambiguity check
        // Format: 12-05-2023 or 12/05/2023
        const slashDashMatch = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(cleanText);
        if (slashDashMatch) {
            const p1 = Number.parseInt(slashDashMatch[1]);
            const p2 = Number.parseInt(slashDashMatch[2]);
            const year = Number.parseInt(slashDashMatch[3]);

            if (p1 > 12 && p2 <= 12) {
                // Must be DD/MM/YYYY
                return { date: new Date(Date.UTC(year, p2 - 1, p1)), is_ambiguous: false, format_used: 'DD/MM/YYYY' };
            } else if (p2 > 12 && p1 <= 12) {
                // Must be MM/DD/YYYY
                return { date: new Date(Date.UTC(year, p1 - 1, p2)), is_ambiguous: false, format_used: 'MM/DD/YYYY' };
            } else if (p1 <= 12 && p2 <= 12) {
                // Ambiguous! 01/02/2026 could be Jan 2 or Feb 1.
                // We refuse to silently guess without account locale context.
                if (p1 === p2) {
                    // 12/12/2026 is safe
                    return { date: new Date(Date.UTC(year, p1 - 1, p1)), is_ambiguous: false, format_used: 'DD/MM/YYYY' };
                }
                return { date: null, is_ambiguous: true, format_used: null };
            }
        }

        // 3. DD-MMM-YYYY or DD MMM YYYY (e.g. 01-Feb-2026, 01 Feb 2026)
        const dddMatch = /^(\d{1,2})[-\s]([A-Za-z]{3})[-\s](\d{4})$/.exec(cleanText);
        if (dddMatch) {
            const day = Number.parseInt(dddMatch[1]);
            const monthStr = dddMatch[2].substring(0, 3);
            const year = Number.parseInt(dddMatch[3]);
            
            const monthMap = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };
            const monthIndex = monthMap[monthStr.toLowerCase()];
            
            if (monthIndex !== undefined) {
                return { date: new Date(Date.UTC(year, monthIndex, day)), is_ambiguous: false, format_used: 'DD-MMM-YYYY' };
            }
        }
        
        // 4. MMM DD, YYYY (e.g. Feb 01, 2026)
        const mmmDdYyyyMatch = /^([A-Za-z]{3})\s(\d{1,2}),?\s(\d{4})$/.exec(cleanText);
        if (mmmDdYyyyMatch) {
            const monthStr = mmmDdYyyyMatch[1].substring(0, 3);
            const day = Number.parseInt(mmmDdYyyyMatch[2]);
            const year = Number.parseInt(mmmDdYyyyMatch[3]);
            
            const monthMap = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };
            const monthIndex = monthMap[monthStr.toLowerCase()];
            
            if (monthIndex !== undefined) {
                return { date: new Date(Date.UTC(year, monthIndex, day)), is_ambiguous: false, format_used: 'MMM DD YYYY' };
            }
        }

        // Fallback: If JS can parse it securely without timezone issues (not reliable for cross-browser, but okay for strict V8 backend)
        const fallbackDate = new Date(cleanText);
        if (!Number.isNaN(fallbackDate.getTime())) {
            return { date: fallbackDate, is_ambiguous: true, format_used: 'JS_FALLBACK_GUESS' };
        }

        return { date: null, is_ambiguous: true, format_used: null };
    }
}
