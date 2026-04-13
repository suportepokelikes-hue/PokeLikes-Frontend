import test from 'node:test';
import assert from 'node:assert/strict';

import {
  appendAffiliateCodeToPath,
  clearStoredAffiliateCode,
  getStoredAffiliateCode,
  normalizeAffiliateCode,
  persistAffiliateCode,
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

test('persistAffiliateCode keeps the latest valid code and ignores blank replacements', () => {
  const storage = new Map<string, string>();
  const target = globalThis as typeof globalThis & {
    window?: {
      localStorage: Storage;
    };
  };
  const originalWindow = target.window;
  const localStorageMock: Storage = {
    get length() {
      return storage.size;
    },
    clear() {
      storage.clear();
    },
    getItem(key) {
      return storage.has(key) ? storage.get(key) ?? null : null;
    },
    key(index) {
      return Array.from(storage.keys())[index] ?? null;
    },
    removeItem(key) {
      storage.delete(key);
    },
    setItem(key, value) {
      storage.set(key, value);
    },
  };

  target.window = { localStorage: localStorageMock } as unknown as Window & typeof globalThis;

  try {
    clearStoredAffiliateCode();

    persistAffiliateCode(' AFF01 ');
    assert.equal(getStoredAffiliateCode(), 'AFF01');

    persistAffiliateCode(' AFF02 ');
    assert.equal(getStoredAffiliateCode(), 'AFF02');

    persistAffiliateCode('   ');
    assert.equal(getStoredAffiliateCode(), 'AFF02');
  } finally {
    if (originalWindow) {
      target.window = originalWindow;
    } else {
      delete (target as { window?: typeof target.window }).window;
    }
  }
});
