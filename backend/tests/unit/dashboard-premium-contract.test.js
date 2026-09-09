import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const page = readFileSync(new URL('../../../frontend/src/app/page.tsx', import.meta.url), 'utf8');
const shell = readFileSync(new URL('../../../frontend/src/components/shell/app-shell.tsx', import.meta.url), 'utf8');
const components = readFileSync(new URL('../../../frontend/src/components/dashboard/dashboard-premium.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../../../frontend/src/components/dashboard/dashboard-premium.module.css', import.meta.url), 'utf8');
const sts = readFileSync(new URL('../../domains/financial-state/safe-to-spend/safe_to_spend.engine.js', import.meta.url), 'utf8');

test('primary home workspace is consistently named Dashboard', () => {
  assert.match(page, />Dashboard<\/h1>/);
  assert.match(shell, /href:"\/",label:"Dashboard"/);
  assert.match(shell, /"\/":"Dashboard"/);
  assert.doesNotMatch(page, /Today at a glance/);
  assert.doesNotMatch(shell, /label:"Today at a glance"/);
});

test('dashboard quick actions preserve the requested copy and use dedicated visual tones', () => {
  for (const copy of [
    'Import a statement',
    'Bring your latest activity in',
    'Set a spending limit',
    'Give each category a plan',
    'Build a milestone',
    'Save towards something meaningful',
    'Ask your copilot',
    'Explore your financial questions',
  ]) assert.match(page, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  for (const tone of ['actionImport', 'actionBudget', 'actionGoal', 'actionCopilot']) {
    assert.match(components, new RegExp(`styles\\.${tone}`));
  }
  assert.match(styles, /\.actionCard:hover/);
  assert.match(styles, /\.actionCard:active/);
});

test('profile trigger opens an accessible real-account menu', () => {
  assert.match(components, /DropdownMenuTrigger asChild/);
  assert.match(components, /aria-label={`Open profile menu for \$\{displayName\}`}/);
  assert.match(components, /href="\/you"/);
  assert.match(components, /href="\/you\/security"/);
  assert.match(components, /href="\/you\/privacy"/);
  assert.match(components, /user\.display_name/);
  assert.match(components, /user\.email/);
  assert.match(components, /user\.created_at/);
});

test('money snapshot uses standard ID-1 card proportions and a platinum-gold metal treatment', () => {
  assert.match(styles, /aspect-ratio:\s*85\.6\s*\/\s*53\.98/);
  assert.match(styles, /dashboardMetalSheen/);
  assert.match(styles, /214,179,108/);
  assert.match(components, /Recorded net activity/);
  assert.match(components, /Imported records · opening balances excluded/);
  assert.doesNotMatch(components, /PRIVATE VIEW/);
});

test('safe-to-spend response exposes evidence completeness without changing the deterministic amount formula', () => {
  assert.match(sts, /const rawSts = availableCash \+ expectedIncome - upcomingCommitments - essentialSpending - safetyBuffer/);
  assert.match(sts, /planning_data_status: planningDataStatus/);
  assert.match(sts, /planning_evidence: planningEvidence/);
  assert.match(sts, /horizon_days: horizonDays/);
  assert.match(page, /stsPlanningDataStatus/);
  assert.match(page, /stsHorizonDays/);
});

test('dashboard consumes the actual AI home-feed insights contract', () => {
  assert.match(page, /data\.insights\.insights \|\| data\.insights\.feed/);
});

test('safe-to-spend and income use dedicated premium metric surfaces', () => {
  assert.match(page, /<SafeToSpendCard/);
  assert.match(page, /<IncomeMetricCard/);
  assert.match(styles, /\.safeCard/);
  assert.match(styles, /\.incomeCard/);
  assert.match(styles, /dashboardMetricSheen/);
});
