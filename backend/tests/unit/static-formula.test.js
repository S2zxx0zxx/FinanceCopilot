import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ENUMS } from '../../src/core/enums.js';

const DOC07 = readFileSync(new URL('../../../07_LEDGER_RECONCILIATION_SPEC.md', import.meta.url), 'utf8');
const CANONICAL = {
  transaction_type: ['expense','income','transfer_out','transfer_in','refund','reversal','card_settlement','emi','interest','fee','cash_withdrawal','unknown'],
  transfer_role: ['source','destination','partial_transfer'],
  settlement_role: ['purchase','settlement'],
};

test('INV-ENUM-001: code mirror matches canonical registry (no drift)', () => {
  for (const [k, v] of Object.entries(CANONICAL)) assert.deepEqual([...ENUMS[k]].sort(), [...v].sort(), `drift in ${k}`);
});

test('F-A2: phantom value purchase_only never reappears in financial spec', () => {
  assert.ok(!DOC07.includes('purchase_only'), 'phantom enum found in 07 spec');
});

test('F-A1: no unparenthesized mixed AND/OR in ledger formulas', () => {
  const bad = /AND[^\n()]*\bOR\b(?![^\n]*\))/.exec(DOC07.replace(/```sql[\s\S]*?```/g, m => m)); // formulas are fenced blocks
  const fenced = DOC07.match(/```\n[\s\S]*?\n```/g) ?? [];
  for (const block of fenced) {
    if (!block.includes('SUM(')) continue;
    const lines = block.split('\n').filter((l) => l.includes('AND') && l.includes('OR') && !l.trim().startsWith('--'));
    for (const l of lines) assert.ok(/\(/.test(l), `unparenthesized predicate: ${l.trim()}`);
  }
});

test('F-A3: salary/bonus are sub_types, never top-level types in formulas', () => {
  assert.ok(!/IN \('income',\s*'salary'/.test(DOC07), 'salary as type detected');
  assert.ok(!/type = 'salary'/.test(DOC07));
});

test('F-B10: refund offset semantics present; refunds not in income', () => {
  assert.ok(DOC07.includes('net_spending = gross_spending - refund_offset'));
  assert.ok(!DOC07.includes("'income', 'salary', 'bonus', 'refund'"));
});
