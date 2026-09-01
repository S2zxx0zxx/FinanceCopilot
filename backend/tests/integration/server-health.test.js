import { test } from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../../config/env.js';

test('env config is loaded correctly', () => {
  assert.ok(config.db.url, 'DATABASE_URL should be loaded');
});
