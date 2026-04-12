import test from 'node:test';
import assert from 'node:assert/strict';

import {
  appendAffiliateCodeToPath,
  normalizeAffiliateCode,
  readAffiliateCodeFromSearchParams,
} from '../src/lib/affiliate-code';

test('normalizeAffiliateCode keeps only non-empty trimmed values', () => {
  assert.equal(normalizeAffiliateCode(' AFILIA30 '), 'AFILIA30');
  assert.equal(normalizeAffiliateCode('   '), undefined);
  assert.equal(normalizeAffiliateCode(undefined), undefined);
});

test('readAffiliateCodeFromSearchParams reads only the aff parameter', () => {
  const searchParams = new URLSearchParams('search=likes&aff=CODIGO123&ref=OUTRO');

  assert.equal(readAffiliateCodeFromSearchParams(searchParams), 'CODIGO123');
});

test('appendAffiliateCodeToPath appends or preserves the affiliate code safely', () => {
  assert.equal(appendAffiliateCodeToPath('/catalog/10', 'AFF10'), '/catalog/10?aff=AFF10');
  assert.equal(appendAffiliateCodeToPath('/catalog?search=likes', 'AFF10'), '/catalog?search=likes&aff=AFF10');
  assert.equal(appendAffiliateCodeToPath('/catalog?search=likes', '   '), '/catalog?search=likes');
});
