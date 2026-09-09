import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const migration = readFileSync(new URL('../../db/migrations/027_achievement_engine.sql', import.meta.url), 'utf8');
const service = readFileSync(new URL('../../domains/gamification/achievement.service.js', import.meta.url), 'utf8');
const controller = readFileSync(new URL('../../api/controllers/gamification.controller.js', import.meta.url), 'utf8');
const hub = readFileSync(new URL('../../../frontend/src/components/achievements/achievement-hub.tsx', import.meta.url), 'utf8');
const youPage = readFileSync(new URL('../../../frontend/src/app/you/page.tsx', import.meta.url), 'utf8');

const badgeKeys = [
  'money_mapper',
  'budget_ninja',
  'streak_keeper',
  'ai_explorer',
  'goal_getter',
  'smart_saver',
];

const milestoneKeys = [
  'first_account',
  'first_25_transactions',
  'first_100_transactions',
  'seven_day_rhythm',
  'thirty_day_momentum',
  'first_budget',
  'first_goal',
  'goal_halfway',
  'first_goal_completed',
  'ten_ai_conversations',
];

test('achievement catalog contains exactly the six V2 collectible badges', () => {
  for (const key of badgeKeys) assert.match(migration, new RegExp(`\\('${key}'`));
  const badgeInsert = migration.match(/INSERT INTO gamification_badge_definitions[\s\S]*?ON CONFLICT \(badge_key\)/)?.[0] || '';
  assert.equal((badgeInsert.match(/^    \('/gm) || []).length, 6);
});

test('milestone trail contains exactly ten authoritative milestone definitions', () => {
  for (const key of milestoneKeys) assert.match(migration, new RegExp(`\\('${key}'`));
  const milestoneInsert = migration.match(/INSERT INTO gamification_milestone_definitions[\s\S]*?ON CONFLICT \(milestone_key\)/)?.[0] || '';
  assert.equal((milestoneInsert.match(/^    \('/gm) || []).length, 10);
});

test('achievement progress is derived from canonical finance data', () => {
  for (const table of [
    'financial_accounts',
    'transactions',
    'budgets',
    'goals',
    'goal_contributions',
    'ai_interactions',
    'financial_health_snapshots',
  ]) {
    assert.match(service, new RegExp(`\\b${table}\\b`));
  }
  assert.match(service, /gc\.status = 'confirmed'/);
  assert.match(service, /posting_status = 'posted'/);
  assert.match(service, /duplicate_status/);
  assert.match(service, /funded_paise >= target_amount_paise/);
});

test('legacy client-driven badge and milestone mutation cannot award progress', () => {
  assert.match(controller, /SERVER_MANAGED_ACHIEVEMENT/);
  assert.doesNotMatch(controller, /UPDATE gamification_badges SET earned/);
  assert.doesNotMatch(controller, /UPDATE gamification_milestones SET progress/);
});

test('badges are handcrafted responsive SVG medallions, not emoji placeholders', () => {
  assert.match(hub, /viewBox="0 0 64 64"/);
  assert.match(hub, /preserveAspectRatio="xMidYMid meet"/);
  assert.match(hub, /grid-cols-3 gap-2 sm:grid-cols-6/);
  for (const iconKey of ['money-map','budget-shield','streak-flame','ai-orbit','goal-flag','smart-saver']) {
    assert.match(hub, new RegExp(`case "${iconKey}"`));
  }
  assert.doesNotMatch(hub, /🥷|🧠|🚀|🎯|💎|📅/u);
});

test('You page uses AchievementHub and no longer renders legacy hardcoded achievement UI', () => {
  assert.match(youPage, /<AchievementHub data=\{gamification\}/);
  assert.doesNotMatch(youPage, /showAllAchievements/);
  assert.doesNotMatch(youPage, /nextMilestone\.icon/);
  assert.doesNotMatch(youPage, /grid grid-cols-6 gap-2/);
});
