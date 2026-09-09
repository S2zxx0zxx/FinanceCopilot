export class CoverageEngine {
    static calculateCoverage(totalAccounts, syncedAccounts) {
        const total = Number(totalAccounts);
        const synced = Number(syncedAccounts);
        if (!Number.isInteger(total) || !Number.isInteger(synced) || total <= 0 || synced <= 0) return 'no_coverage';
        return synced >= total ? 'full' : 'partial';
    }
}
