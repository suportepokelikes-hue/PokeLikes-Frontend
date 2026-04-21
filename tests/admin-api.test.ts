import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createAdminAffiliatePayout,
  refreshAdminAffiliatePayout,
  listAdminCatalogAffiliateSettings,
  listAdminAffiliatePayouts,
  listAdminCatalogServices,
  updateAdminAffiliatePayoutStatus,
  updateAdminCatalogAffiliateSettings,
  updateAdminCatalogService,
} from '../src/lib/api/admin';

test('admin catalog api functions keep catalog and affiliate settings aligned with the validated contract', async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];

  globalThis.fetch = (async (input, init) => {
    requests.push({ url: String(input), init });

    const url = String(input);

    if (url.includes('/admin/catalog/affiliate-settings?')) {
      return new Response(
        JSON.stringify({
          items: [
            {
              id: 'svc-1',
              name: 'Instagram Likes',
              isAffiliateEnabled: true,
              affiliateCommissionPercent: '12.5',
            },
          ],
          page: 3,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (url.endsWith('/admin/catalog/svc-1/affiliate-settings')) {
      return new Response(
        JSON.stringify({
          id: 'svc-1',
          name: 'Instagram Likes',
          isAffiliateEnabled: true,
          affiliateCommissionPercent: '12.5',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

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
    const settingsList = await listAdminCatalogAffiliateSettings('token-123', { search: 'instagram', page: 3, pageSize: 25 });
    const updatedSettings = await updateAdminCatalogAffiliateSettings('token-123', 'svc-1', {
      isAffiliateEnabled: true,
      affiliateCommissionPercent: '12.5',
    });

    assert.deepEqual(settingsList.items[0], {
      catalogServiceId: 'svc-1',
      affiliateEnabled: true,
      affiliateCommissionPercent: '12.5',
      catalogService: { id: 'svc-1', name: 'Instagram Likes' },
    });
    assert.deepEqual(updatedSettings, {
      catalogServiceId: 'svc-1',
      affiliateEnabled: true,
      affiliateCommissionPercent: '12.5',
      catalogService: { id: 'svc-1', name: 'Instagram Likes' },
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
      isAffiliateEnabled: true,
      affiliateCommissionPercent: '12.5',
    }),
  );
});

test('admin affiliate payout api normalizes Asaas provider fields and sends payout mutations', async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];

  globalThis.fetch = (async (input, init) => {
    requests.push({ url: String(input), init });

    const url = String(input);

    if (url.includes('/admin/affiliate-payouts?')) {
      return new Response(
        JSON.stringify({
          items: [
            {
              id: 'payout-1',
              affiliateProfileId: 'aff-7',
              status: 'paid',
              amount: '42.00',
              processedByUserId: 'admin-1',
              notes: 'Pago no fechamento',
              statusReason: 'PIX confirmado',
              provider: 'asaas',
              externalReference: 'affiliate-payout-payout-1',
              providerTransactionId: 'tr_123',
              providerStatus: 'DONE',
              providerErrorCode: null,
              providerErrorMessage: null,
              providerSyncedAt: '2026-04-20T12:01:00.000Z',
              pixKey: { type: 'email', key: 'afiliado@example.com' },
              requestedAt: '2026-04-20T09:00:00.000Z',
              processingAt: '2026-04-20T11:00:00.000Z',
              paidAt: '2026-04-20T12:00:00.000Z',
              failedAt: null,
              cancelledAt: null,
              createdAt: '2026-04-20T10:00:00.000Z',
              processedAt: '2026-04-20T12:00:00.000Z',
              affiliate: {
                userId: 'user-7',
                publicCode: 'PUB-7',
                affiliateCode: 'PUB-7',
              },
            },
          ],
          page: 1,
          pageSize: 10,
          totalItems: 1,
          totalPages: 1,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (url.endsWith('/admin/affiliate-payouts/payout-2/status')) {
      return new Response(
        JSON.stringify({
          id: 'payout-2',
          affiliateProfileId: 'aff-7',
          status: 'paid',
          amount: '15.00',
          processedByUserId: 'admin-1',
          notes: 'Fechamento abril',
          statusReason: 'PIX manual confirmado',
          provider: 'asaas',
          externalReference: 'affiliate-payout-payout-2',
          providerTransactionId: 'tr_456',
          providerStatus: 'DONE',
          providerErrorCode: null,
          providerErrorMessage: null,
          providerSyncedAt: '2026-04-20T14:01:00.000Z',
          pixKey: { type: 'email', key: 'afiliado@example.com' },
          requestedAt: '2026-04-20T13:00:00.000Z',
          processingAt: '2026-04-20T13:30:00.000Z',
          paidAt: '2026-04-20T14:00:00.000Z',
          failedAt: null,
          cancelledAt: null,
          createdAt: '2026-04-20T13:00:00.000Z',
          processedAt: '2026-04-20T14:00:00.000Z',
          affiliate: {
            userId: 'user-7',
            publicCode: 'PUB-7',
            affiliateCode: 'PUB-7',
          },
          commissionIds: ['1', '2'],
          commissionCount: 2,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (url.endsWith('/admin/affiliate-payouts/payout-2/refresh')) {
      return new Response(
        JSON.stringify({
          id: 'payout-2',
          affiliateProfileId: 'aff-7',
          status: 'processing',
          amount: '15.00',
          processedByUserId: 'admin-1',
          notes: 'Fechamento abril',
          statusReason: null,
          provider: 'asaas',
          externalReference: 'affiliate-payout-payout-2',
          providerTransactionId: 'tr_456',
          providerStatus: 'PENDING',
          providerErrorCode: null,
          providerErrorMessage: null,
          providerSyncedAt: '2026-04-20T13:45:00.000Z',
          pixKey: { type: 'email', key: 'afiliado@example.com' },
          requestedAt: '2026-04-20T13:00:00.000Z',
          processingAt: '2026-04-20T13:30:00.000Z',
          paidAt: null,
          failedAt: null,
          cancelledAt: null,
          createdAt: '2026-04-20T13:00:00.000Z',
          processedAt: null,
          affiliate: {
            userId: 'user-7',
            publicCode: 'PUB-7',
            affiliateCode: 'PUB-7',
          },
          commissionIds: ['1', '2'],
          commissionCount: 2,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(
      JSON.stringify({
        id: 'payout-2',
        affiliateProfileId: 'aff-7',
        status: 'requested',
        amount: '15.00',
        processedByUserId: null,
        notes: 'Fechamento abril',
        createdAt: '2026-04-20T13:00:00.000Z',
        processedAt: null,
        affiliate: {
          userId: 'user-7',
          publicCode: 'PUB-7',
          affiliateCode: 'PUB-7',
        },
        commissionIds: ['1', '2'],
        commissionCount: 2,
        statusReason: null,
        provider: null,
        externalReference: 'affiliate-payout-payout-2',
        providerTransactionId: null,
        providerStatus: null,
        providerErrorCode: null,
        providerErrorMessage: null,
        providerSyncedAt: null,
        pixKey: { type: 'email', key: 'afiliado@example.com' },
        requestedAt: '2026-04-20T13:00:00.000Z',
        processingAt: null,
        paidAt: null,
        failedAt: null,
        cancelledAt: null,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }) as typeof fetch;

  try {
    const payouts = await listAdminAffiliatePayouts('token-123', { affiliateProfileId: 'aff-7' });
    const created = await createAdminAffiliatePayout('token-123', {
      affiliateProfileId: 7,
      commissionIds: [1, 2],
      notes: 'Fechamento abril',
    });
    const updated = await updateAdminAffiliatePayoutStatus('token-123', 'payout-2', {
      status: 'paid',
      statusReason: 'PIX manual confirmado',
    });
    const refreshed = await refreshAdminAffiliatePayout('token-123', 'payout-2');

    assert.equal(payouts.items[0]?.amount, '42.00');
    assert.equal(payouts.items[0]?.affiliateProfileId, 'aff-7');
    assert.equal(payouts.items[0]?.notes, 'Pago no fechamento');
    assert.equal(payouts.items[0]?.statusReason, 'PIX confirmado');
    assert.equal(payouts.items[0]?.provider, 'asaas');
    assert.equal(payouts.items[0]?.externalReference, 'affiliate-payout-payout-1');
    assert.equal(payouts.items[0]?.providerTransactionId, 'tr_123');
    assert.equal(payouts.items[0]?.providerStatus, 'DONE');
    assert.equal(payouts.items[0]?.providerSyncedAt, '2026-04-20T12:01:00.000Z');
    assert.deepEqual(payouts.items[0]?.pixKey, { type: 'email', key: 'afiliado@example.com' });
    assert.equal(payouts.items[0]?.requestedAt, '2026-04-20T09:00:00.000Z');
    assert.equal(payouts.items[0]?.paidAt, '2026-04-20T12:00:00.000Z');
    assert.equal(payouts.items[0]?.processedAt, '2026-04-20T12:00:00.000Z');
    assert.equal(created.amount, '15.00');
    assert.equal(created.status, 'requested');
    assert.equal(created.commissionCount, 2);
    assert.deepEqual(created.commissionIds, ['1', '2']);
    assert.equal(updated.status, 'paid');
    assert.equal(updated.statusReason, 'PIX manual confirmado');
    assert.equal(updated.paidAt, '2026-04-20T14:00:00.000Z');
    assert.equal(refreshed.status, 'processing');
    assert.equal(refreshed.providerStatus, 'PENDING');
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(
    requests.map((request) => ({
      url: request.url,
      method: request.init?.method ?? 'GET',
    })),
    [
      {
        url: 'http://localhost:3001/v1/admin/affiliate-payouts?page=1&pageSize=10&sortOrder=desc&affiliateProfileId=aff-7',
        method: 'GET',
      },
      { url: 'http://localhost:3001/v1/admin/affiliate-payouts', method: 'POST' },
      { url: 'http://localhost:3001/v1/admin/affiliate-payouts/payout-2/status', method: 'POST' },
      { url: 'http://localhost:3001/v1/admin/affiliate-payouts/payout-2/refresh', method: 'POST' },
    ],
  );

  assert.equal(
    requests[1].init?.body,
    JSON.stringify({
      affiliateProfileId: 7,
      commissionIds: [1, 2],
      notes: 'Fechamento abril',
    }),
  );
  assert.equal(
    requests[2].init?.body,
    JSON.stringify({
      status: 'paid',
      statusReason: 'PIX manual confirmado',
    }),
  );
});
