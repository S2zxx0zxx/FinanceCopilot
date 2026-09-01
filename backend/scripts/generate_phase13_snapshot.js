/**
 * Phase 13 Beta Evidence Snapshot Generator
 *
 * PURPOSE (per §43, §44):
 *   - Replace the [HASH] placeholder with a REAL cryptographic checksum
 *   - Snapshot contains aggregate references — NO raw bank data, transactions, or AI conversations
 *   - Repeated generation of identical content produces identical hash (deterministic)
 *   - This snapshot is the Phase 13 evidence baseline for Phase 14 entry
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Canonical snapshot content — aggregate/structural only, no PII
const SNAPSHOT_CONTENT = {
    snapshot_version: '1.0.1',
    created_at: '2026-08-27T21:00:00Z',
    code_release: 'FINCOPILOT-BETA-2026-08-27-01',
    schema_version: '0020',        // highest applied migration
    phase: 'PHASE_13',

    cohort_definition: {
        cohorts: ['INTERNAL', 'BETA_COHORT_1'],
        assignment: 'DETERMINISTIC_PERCENTAGE_BUCKET',
        test_accounts_excluded: true,
        consent_required: true,
        region_policy: 'POLICY_REQUIRED'
    },

    feature_flag_state: {
        'ai_forecast_beta': { enabled: true, cohorts: ['INTERNAL', 'BETA_COHORT_1'], expiry: '2027-01-01' },
        'automated_corrections': { enabled: false, cohorts: ['INTERNAL'], expiry: '2026-10-01' },
        'new_trust_dashboard': { enabled: true, cohorts: ['ALL'], expiry: '2026-12-31' }
    },

    metric_definitions: {
        activation: 'FIRST_TRUSTED_FINANCIAL_RESULT_VIEWED — server-side verified',
        correction_completed: 'backend_persisted AND downstream_state_updated',
        retention_d1: 'return_within_24h_of_activation',
        retention_d7: 'return_within_7d_of_activation',
        retention_d30: 'return_within_30d_of_activation',
        ai_numerical_consistency: 'AI_claim == deterministic_tool_output for same state/version'
    },

    // Real-user aggregate evidence — all INSUFFICIENT_EVIDENCE until N > 0
    aggregate_evidence: {
        real_users_n: 0,
        onboarding: 'INSUFFICIENT_EVIDENCE',
        data_quality: 'INSUFFICIENT_EVIDENCE',
        connection_sync: 'INSUFFICIENT_EVIDENCE',
        correction_quality: 'INSUFFICIENT_EVIDENCE',
        trust_analysis: 'INSUFFICIENT_EVIDENCE',
        ai_quality: 'INSUFFICIENT_EVIDENCE',
        ai_numerical_consistency: 'INSUFFICIENT_EVIDENCE',
        ai_p0_p1_incidents: 0,
        forecast_7d: 'N-A',
        forecast_30d: 'N-A',
        forecast_90d: 'UNAVAILABLE_BY_POLICY',
        retention_d1: 'INSUFFICIENT_EVIDENCE',
        retention_d7: 'INSUFFICIENT_EVIDENCE',
        retention_d30: 'INSUFFICIENT_EVIDENCE',
        decision_impact: 'INSUFFICIENT_EVIDENCE'
    },

    infrastructure_evidence: {
        telemetry_traffic_class_isolation: 'PASS',
        feature_flag_middleware_db_backed: 'PASS',
        cohort_persistence_migration: '0020_beta_cohort_assignments.sql',
        performance_middleware: 'PASS',
        pii_strip_in_telemetry: 'PASS',
        test_account_guard: 'PASS',
        data_quality_endpoint: 'PASS',
        onboarding_funnel_events_defined: 'PASS',
        correction_telemetry_hook: 'PASS',
        split_telemetry_hook: 'PASS'
    },

    security_privacy: {
        tenant_isolation: 'PASS',
        authorization: 'PASS',
        privacy_controls: 'PASS',
        export_delete: 'PASS',
        ai_security: 'PASS',
        connection_security: 'PASS'
    },

    incident_summary: {
        p0_incidents: 0,
        p1_incidents: 0,
        known_limitations: [
            'REAL_USERS = 0: all user-facing metrics are INSUFFICIENT_EVIDENCE',
            'Region/age eligibility policy not yet defined (POLICY_REQUIRED)',
            '90-day forecast evaluation requires minimum 3 months of user history — unavailable by policy until users onboard',
            'Statistical causal claims for Decision Impact require proper experimental design not yet run'
        ]
    },

    phase_013_final_status: 'OPEN — awaiting REAL_USERS > 0 for user-facing metric validation'
};

// Produce deterministic canonical JSON (sorted keys)
function deterministicStringify(obj) {
    if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);
    if (Array.isArray(obj)) return '[' + obj.map(deterministicStringify).join(',') + ']';
    const keys = Object.keys(obj).sort();
    return '{' + keys.map(k => JSON.stringify(k) + ':' + deterministicStringify(obj[k])).join(',') + '}';
}

const canonical = deterministicStringify(SNAPSHOT_CONTENT);
const sha256Hash = crypto.createHash('sha256').update(canonical).digest('hex');

const snapshot = {
    ...SNAPSHOT_CONTENT,
    _checksum: {
        algorithm: 'SHA-256',
        hash: sha256Hash,
        generated_at: new Date().toISOString(),
        note: 'Deterministic. Identical content always produces identical hash.'
    }
};

// Write snapshot JSON
const outPath = path.join(__dirname, '../../docs/PHASE_13_EVIDENCE_SNAPSHOT.json');
fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2));
console.log('✅ Evidence snapshot written to docs/PHASE_13_EVIDENCE_SNAPSHOT.json');
console.log(`🔐 SHA-256: ${sha256Hash}`);
console.log(`📦 Version: ${SNAPSHOT_CONTENT.snapshot_version}`);
