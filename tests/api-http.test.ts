import test from 'node:test';
import assert from 'node:assert/strict';

import { ApiClientError, apiRequest } from '../src/lib/api/http';

test('apiRequest builds the request with auth, json body and default cache', async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = '';
  let capturedInit: RequestInit | undefined;

  globalThis.fetch = (async (input, init) => {
    capturedUrl = String(input);
    capturedInit = init;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  try {
    const result = await apiRequest<{ ok: boolean }>({
      path: '/admin/users?page=2',
      method: 'POST',
      body: { hello: 'world' },
      accessToken: 'token-123',
    });

    assert.deepEqual(result, { ok: true });
    assert.equal(capturedUrl, 'http://localhost:3001/v1/admin/users?page=2');
    assert.equal(capturedInit?.method, 'POST');
    assert.equal(capturedInit?.cache, 'no-store');
    assert.equal(capturedInit?.body, JSON.stringify({ hello: 'world' }));

    const headers = new Headers(capturedInit?.headers);
    assert.equal(headers.get('Authorization'), 'Bearer token-123');
    assert.equal(headers.get('Content-Type'), 'application/json');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('apiRequest returns undefined for 204 responses', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => new Response(null, { status: 204 })) as typeof fetch;

  try {
    const result = await apiRequest<void>({ path: '/auth/logout', method: 'POST' });
    assert.equal(result, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('apiRequest surfaces backend error payload in ApiClientError', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () =>
    new Response(
      JSON.stringify({
        error: {
          code: 'validation_error',
          message: 'Payload invalido',
          details: { field: 'email' },
        },
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    )) as typeof fetch;

  try {
    await assert.rejects(
      () => apiRequest({ path: '/admin/users', method: 'POST', body: {} }),
      (error: unknown) => {
        assert.ok(error instanceof ApiClientError);
        assert.equal(error.status, 400);
        assert.equal(error.code, 'validation_error');
        assert.equal(error.message, 'Payload invalido');
        assert.deepEqual(error.details, { field: 'email' });
        return true;
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
