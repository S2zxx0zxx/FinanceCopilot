/**
 * Phase 12 Chaos Testing Script
 * 
 * Simulates extreme production faults to ensure the core finance
 * application remains highly available and does not leak or corrupt data.
 */
import fetch from 'node-fetch';

const API_BASE = process.env.API_BASE || 'http://localhost:3000/api/v1';
const MOCK_TOKEN = 'mock-user-chaos-token';

async function runChaos() {
    console.log('🔥 Initializing Phase 12 Chaos & Resilience Test...');
    let passed = 0;
    let failed = 0;

    const testScenario = async (name, operation, expectedStatus) => {
        try {
            console.log(`\n[TEST] ${name}`);
            const res = await operation();
            if (res.status === expectedStatus || (expectedStatus === 200 && res.ok)) {
                console.log(`✅ PASS (${res.status})`);
                passed++;
            } else {
                console.error(`❌ FAIL (Expected ${expectedStatus}, Got ${res.status})`);
                failed++;
            }
        } catch (err) {
            console.error(`❌ FAIL Exception: ${err.message}`);
            failed++;
        }
    };

    // 1. Core Finance Survivability (Read)
    await testScenario(
        'Core Finance (Home) survives without AI',
        () => fetch(`${API_BASE}/financial-state/home`, {
            headers: { 'Authorization': `Bearer ${MOCK_TOKEN}` }
        }),
        200
    );

    // 2. AI Degradation Handling
    await testScenario(
        'AI Endpoint returns graceful 503 instead of crashing on timeout',
        () => fetch(`${API_BASE}/forecast/scenario`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${MOCK_TOKEN}`,
                'Content-Type': 'application/json',
                'X-Chaos-Inject': 'provider-timeout'
            },
            body: JSON.stringify({ goalId: 'g1', scenarioType: 'accelerate' })
        }),
        503 // Our new global error handler maps ProviderError to 503
    );

    // 3. Rate Limit Bypass Attempt
    console.log('\n[TEST] Abusive Traffic (Rate Limit)');
    let rateLimited = false;
    for(let i=0; i<110; i++) {
        const r = await fetch(`${API_BASE}/financial-state/home`, { headers: { 'Authorization': `Bearer ${MOCK_TOKEN}` }});
        if (r.status === 429) {
            rateLimited = true;
            break;
        }
    }
    if (rateLimited) {
        console.log(`✅ PASS (Rate limit triggered)`);
        passed++;
    } else {
        console.error(`❌ FAIL (Rate limit not triggered after 100 requests)`);
        failed++;
    }

    console.log(`\n🏁 Chaos Test Complete. Pass: ${passed}, Fail: ${failed}`);
    if (failed > 0) process.exit(1);
}

runChaos();
