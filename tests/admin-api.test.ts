import test from 'node:test';
import assert from 'node:assert/strict';

import {
  listAdminCatalogAffiliateSettings,
  listAdminCatalogServices,
  updateAdminCatalogAffiliateSettings,
  updateAdminCatalogService,
} from '../src/lib/api/admin';

test('admin catalog api functions keep catalog and affiliate settings aligned with the validated contract', async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];

  globalThis.fetch = (async (input, init) => {
    requests.push({ url: String(input), init });

    return new Response(JSON.stringify({ ok: true, id: 'svc-1', items: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  try {
    await listAdminCatalogServices('token-123', { search: 'instagram', page: 2, pageSize: 25 });
    await updateAdminCatalogService('token-123', 'svc-1', {
      name: 'Instagram Likes',
      publicPrice: '19.90',
    });
    await listAdminCatalogAffiliateSettings('token-123', { search: 'instagram', page: 3, pageSize: 25 });
    await updateAdminCatalogAffiliateSettings('token-123', 'svc-1', {
      affiliateEnabled: true,
      affiliateCommissionPercent: '12.5',
    });
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(
    requests.map((request) => ({
      url: request.url,
      method: request.init?.method ?? 'GET',
    })),
    [
      { url: 'http://localhost:3001/v1/admin/catalog/services?page=2&pageSize=25&search=instagram', method: 'GET' },
      { url: 'http://localhost:3001/v1/admin/catalog/services/svc-1', method: 'PATCH' },
      {
        url: 'http://localhost:3001/v1/admin/catalog/affiliate-settings?page=3&pageSize=25&sortOrder=desc&search=instagram',
        method: 'GET',
      },
      { url: 'http://localhost:3001/v1/admin/catalog/svc-1/affiliate-settings', method: 'PATCH' },
    ],
  );

  assert.equal(new Headers(requests[0].init?.headers).get('Authorization'), 'Bearer token-123');
  assert.equal(new Headers(requests[2].init?.headers).get('Authorization'), 'Bearer token-123');
  assert.equal(
    requests[1].init?.body,
    JSON.stringify({
      name: 'Instagram Likes',
      publicPrice: '19.90',
    }),
  );
  assert.equal(
    requests[3].init?.body,
    JSON.stringify({
      affiliateEnabled: true,
      affiliateCommissionPercent: '12.5',
    }),
  );
});
