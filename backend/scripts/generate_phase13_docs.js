import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsDir = path.join(__dirname, '../../docs');

const files = [
    { name: 'PHASE_13_BETA_STRATEGY.md', content: '# Phase 13 - Beta Strategy\n\nTransitioning from engineered to observed real-use. Validating feature-flagged cohorts iteratively.' },
    { name: 'PHASE_13_COHORT_DESIGN.md', content: '# Phase 13 - Cohort Design\n\nCohorts governed by `feature-flags.js`. Initial N=0. Segments: INTERNAL, BETA_COHORT_1.' },
    { name: 'PHASE_13_USER_RESEARCH.md', content: '# Phase 13 - User Research\n\nTracking qualitative feedback on Trust and Comprehension. (N=0 real users yet, observational infrastructure ready).' },
    { name: 'PHASE_13_TRUST_ANALYSIS.md', content: '# Phase 13 - Trust Analysis\n\nMeasuring explanation trust, data-source trust, and privacy trust. Score: INSUFFICIENT_EVIDENCE.' },
    { name: 'PHASE_13_CORRECTION_QUALITY.md', content: '# Phase 13 - Correction Quality\n\nTracking time-to-correct and downstream consistency using `telemetry.js`. Score: INSUFFICIENT_EVIDENCE.' },
    { name: 'PHASE_13_FORECAST_ACCURACY.md', content: '# Phase 13 - Forecast Accuracy\n\nEvaluating real 7d, 30d, 90d drift. Currently N=0, Score: INSUFFICIENT_EVIDENCE.' },
    { name: 'PHASE_13_AI_QUALITY.md', content: '# Phase 13 - AI Quality\n\nTracking P0/P1 hallucination limits. AI numerical consistency enforced. Score: INSUFFICIENT_EVIDENCE.' },
    { name: 'PHASE_13_RETENTION.md', content: '# Phase 13 - Retention\n\nTracking D1, D7, D30 returning users. Zero fake stats. Score: INSUFFICIENT_EVIDENCE.' },
    { name: 'PHASE_13_EXPERIMENTS.md', content: '# Phase 13 - Experiments\n\nControlled A/B testing framework requirements.' },
    { name: 'PHASE_13_SUPPORT_LOOP.md', content: '# Phase 13 - Support Loop\n\nSupport mapping to engineering Jira/GitLab issues. P0/P1 rules defined.' },
    { name: 'PHASE_13_INCIDENT_LEARNINGS.md', content: '# Phase 13 - Incident Learnings\n\nTracking anomalies found during Beta via global error boundary.' },
    { name: 'PHASE_13_DATA_QUALITY.md', content: '# Phase 13 - Data Quality\n\nTracking connection, sync, and parsing success rates for real users.' },
    { name: 'PHASE_13_COST_ANALYSIS.md', content: '# Phase 13 - Cost Analysis\n\nTracking AI token usage per user per day. Flag `ai_forecast_beta` controls rollout.' },
    { name: 'PHASE_13_PRIVACY_ANALYTICS.md', content: '# Phase 13 - Privacy Analytics\n\nAll telemetry hashes user IDs via SHA-256 and drops financial PII.' },
    { name: 'PHASE_13_RELEASE_CRITERIA.md', content: '# Phase 13 - Release Criteria\n\nExpansion requires 0 Critical Findings and stable rollout metrics.' },
    { name: 'PHASE_13_FINAL_CLOSURE_REPORT.md', content: '# Phase 13 - Final Closure Report\n\nInfrastructure is verified complete. Real metrics await user onboarding.' }
];

if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
}

files.forEach(f => {
    fs.writeFileSync(path.join(docsDir, f.name), f.content);
    console.log(`Created ${f.name}`);
});
