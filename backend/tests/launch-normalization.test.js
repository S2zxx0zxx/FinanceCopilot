import test from 'node:test';
import assert from 'node:assert/strict';
import { MoneyNormalizer } from '../domains/normalization/amount/money.normalizer.js';
import { DateNormalizer } from '../domains/normalization/date/date.normalizer.js';
import { CSVParser } from '../domains/ingestion/parsers/csv.parser.js';
import { NormalizationPipeline } from '../domains/normalization/pipeline/normalization.pipeline.js';
import { ConsentService } from '../domains/consent/consent.service.js';

test('exact paise and Indian grouping without malformed input guessing', () => {
  assert.equal(MoneyNormalizer.normalizeToPaise('₹1,23,456.78').amount_paise, 12345678);
  assert.equal(MoneyNormalizer.normalizeToPaise('0.29').amount_paise, 29);
  for (const raw of ['1.2.3', '1.234', '12,34', '900719925474099.99', 'abc12']) {
    assert.equal(MoneyNormalizer.normalizeToPaise(raw).is_valid, false, raw);
  }
});
test('calendar validation and ambiguous day/month dates', () => {
  for (const raw of ['2025-02-29', '2026-04-31', '31/02/2026']) assert.equal(DateNormalizer.normalizeDate(raw).date, null);
  assert.equal(DateNormalizer.normalizeDate('03/04/2026').is_ambiguous, true);
  assert.equal(DateNormalizer.normalizeDate('03/04/2026', {dateOrder:'DMY'}).date.toISOString(), '2026-04-03T00:00:00.000Z');
});
test('CSV debit columns take priority over generic amount, malformed rows fail', async () => {
  const parser = new CSVParser();
  const [row] = await parser.parseRawStatement(Buffer.from('Date,Description,Amount,Debit,Credit\n2026-04-03,Shop,0,12.34,0'));
  assert.equal(row.raw_amount_text, '12.34');
  assert.equal(row.raw_direction_text, 'debit');
  await assert.rejects(parser.parseRawStatement(Buffer.from('Date,Description,Debit,Credit\n2026-04-03,Shop,oops,12')), /invalid debit/);
  await assert.rejects(parser.parseRawStatement(Buffer.from('Date,Description,Debit,Credit\n2026-04-03,Shop,12,12')), /both debit/);
});
test('zero confidence and uncertain direction cannot auto-post', () => {
  const raw = {raw_amount_text:'100',raw_date_text:'2026-04-03',raw_description_text:'Shop',resolved_account_id:'account',extraction_confidence:0};
  assert.equal(NormalizationPipeline.run(raw).overall_confidence,0);
  assert.equal(NormalizationPipeline.run({...raw,extraction_confidence:1}).needs_review,true);
  assert.equal(NormalizationPipeline.run({...raw,raw_direction_text:'debit',raw_date_text:'2026-02-30',extraction_confidence:1}).needs_review,true);
});
test('denied, pending and expired consent never authorizes processing', async () => {
  const grant = {consented:true,status:'active',version:'2026-01-01',granted_at:'2026-01-01'};
  for(const override of [{consented:false},{status:'pending'},{expires_at:'2020-01-01'},{expires_at:'invalid'}]) {
    const service = new ConsentService({getLatestConsent:async()=>({...grant,...override})},{});
    assert.equal(await service.hasConsent('u','p','2026-01-01'),false);
  }
  assert.equal(await new ConsentService({getLatestConsent:async()=>grant},{}).hasConsent('u','p','2026-01-01'),true);
});
