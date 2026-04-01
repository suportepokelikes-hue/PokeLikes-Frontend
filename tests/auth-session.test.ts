import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createGuestSession,
  deserializeUser,
  readSession,
  serializeUser,
  toSessionCookieValues,
} from '../src/lib/auth/session';
import type { AuthSessionResponse, UserSummary } from '../src/lib/api/contracts';

const sampleUser: UserSummary = {
  id: '42',
  role: 'admin',
  name: 'Alice',
  email: 'alice@likesuai.com',
  phone: '31999999999',
  status: 'active',
  referralCode: 'LIKES42',
  emailVerified: true,
};

test('serializeUser and deserializeUser preserve supported fields', () => {
  const encoded = serializeUser(sampleUser);
  const decoded = deserializeUser(encoded);

  assert.deepEqual(decoded, sampleUser);
});

test('deserializeUser rejects malformed payloads', () => {
  assert.equal(deserializeUser('not-base64'), null);

  const invalidRole = Buffer.from(
    JSON.stringify({ id: '1', role: 'operator', name: 'Bob', email: 'bob@likesuai.com', status: 'active' }),
    'utf8',
  )
    .toString('base64url');

  assert.equal(deserializeUser(invalidRole), null);
});

test('readSession returns guest when any cookie is missing or invalid', () => {
  const missing = readSession({
    get(name: string) {
      return name === 'likes_uai_access_token' ? { value: 'token' } : undefined;
    },
  });

  assert.deepEqual(missing, createGuestSession());

  const invalid = readSession({
    get(name: string) {
      if (name === 'likes_uai_access_token') {
        return { value: 'token' };
      }

      if (name === 'likes_uai_refresh_token') {
        return { value: 'refresh' };
      }

      if (name === 'likes_uai_user') {
        return { value: 'broken' };
      }

      return undefined;
    },
  });

  assert.deepEqual(invalid, createGuestSession());
});

test('toSessionCookieValues prepares cookie payloads from auth session', () => {
  const session: AuthSessionResponse = {
    accessToken: 'access',
    refreshToken: 'refresh',
    user: sampleUser,
  };

  const values = toSessionCookieValues(session);

  assert.equal(values.accessToken, 'access');
  assert.equal(values.refreshToken, 'refresh');
  assert.deepEqual(deserializeUser(values.user), sampleUser);
});
