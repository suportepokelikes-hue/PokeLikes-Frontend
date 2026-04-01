import test from 'node:test';
import assert from 'node:assert/strict';

import {
  confirmEmailVerification,
  getAuthMe,
  getCurrentUser,
  login,
  logout,
  refreshSession,
  registerCustomer,
  requestEmailVerification,
} from '../src/lib/api/auth';

test('auth api functions target the expected endpoints and methods', async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];

  globalThis.fetch = (async (input, init) => {
    requests.push({ url: String(input), init });

    return new Response(JSON.stringify({ ok: true, accessToken: 'a', refreshToken: 'r' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  try {
    await registerCustomer({
      name: 'Alice',
      email: 'alice@likesuai.com',
      phone: '31999999999',
      password: 'secret',
      referralCode: 'INDIQUE123',
    });
    await login({ email: 'alice@likesuai.com', password: 'secret' });
    await refreshSession({ refreshToken: 'refresh-token' });
    await logout({ refreshToken: 'refresh-token' });
    await getAuthMe('token-123');
    await getCurrentUser('token-123');
    await requestEmailVerification('token-123');
    await confirmEmailVerification({ token: 'preview-token' });
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(
    requests.map((request) => ({
      url: request.url,
      method: request.init?.method ?? 'GET',
    })),
    [
      { url: 'http://localhost:3001/v1/auth/register', method: 'POST' },
      { url: 'http://localhost:3001/v1/auth/login', method: 'POST' },
      { url: 'http://localhost:3001/v1/auth/refresh', method: 'POST' },
      { url: 'http://localhost:3001/v1/auth/logout', method: 'POST' },
      { url: 'http://localhost:3001/v1/auth/me', method: 'GET' },
      { url: 'http://localhost:3001/v1/me', method: 'GET' },
      { url: 'http://localhost:3001/v1/auth/email-verification/request', method: 'POST' },
      { url: 'http://localhost:3001/v1/auth/email-verification/confirm', method: 'POST' },
    ],
  );

  assert.equal(requests[0].init?.body, JSON.stringify({
    name: 'Alice',
    email: 'alice@likesuai.com',
    phone: '31999999999',
    password: 'secret',
    referralCode: 'INDIQUE123',
  }));
  assert.equal(requests[1].init?.body, JSON.stringify({ email: 'alice@likesuai.com', password: 'secret' }));
  assert.equal(requests[2].init?.body, JSON.stringify({ refreshToken: 'refresh-token' }));
  assert.equal(requests[3].init?.body, JSON.stringify({ refreshToken: 'refresh-token' }));
  assert.equal(new Headers(requests[4].init?.headers).get('Authorization'), 'Bearer token-123');
  assert.equal(new Headers(requests[5].init?.headers).get('Authorization'), 'Bearer token-123');
  assert.equal(new Headers(requests[6].init?.headers).get('Authorization'), 'Bearer token-123');
  assert.equal(requests[7].init?.body, JSON.stringify({ token: 'preview-token' }));
});
