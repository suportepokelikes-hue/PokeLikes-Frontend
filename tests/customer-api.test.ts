import test from 'node:test';
import assert from 'node:assert/strict';

import {
  applyToAffiliateProgram,
  createCustomerSupportTicket,
  createCustomerSupportTicketMessage,
  getCustomerAffiliatePix,
  getCustomerAffiliateProfile,
  getCustomerAffiliateSummary,
  getCustomerSupportTicketDetail,
  createCustomerOrder,
  createPixPayment,
  listCustomerAffiliateCommissions,
  getCustomerOrderDetail,
  getCustomerPaymentDetail,
  getCustomerProfile,
  getCustomerReferralSummary,
  getWalletSummary,
  listCustomerOrders,
  listCustomerPayments,
  listCustomerSupportTickets,
  listWalletTransactions,
  updateCustomerAffiliatePix,
  updateCustomerProfile,
} from '../src/lib/api/customer';

test('customer api functions target the expected endpoints and methods', async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];

  globalThis.fetch = (async (input, init) => {
    requests.push({ url: String(input), init });

    return new Response(JSON.stringify({ ok: true, id: '1', items: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  try {
    await getWalletSummary({ accessToken: 'token' });
    await getCustomerProfile({ accessToken: 'token' });
    await updateCustomerProfile(
      { accessToken: 'token' },
      { name: 'Maria Souza', phone: '(31) 99999-0000', taxId: '123.456.789-09' },
    );
    await getCustomerReferralSummary({ accessToken: 'token' });
    await getCustomerAffiliateProfile({ accessToken: 'token' });
    await getCustomerAffiliatePix({ accessToken: 'token' });
    await updateCustomerAffiliatePix({ accessToken: 'token' }, { pixKeyType: 'email', pixKey: 'afiliado@example.com' });
    await applyToAffiliateProgram({ accessToken: 'token' });
    await getCustomerAffiliateSummary({ accessToken: 'token' });
    await listCustomerAffiliateCommissions({ accessToken: 'token' });
    await listCustomerPayments({ accessToken: 'token' });
    await listCustomerOrders({ accessToken: 'token' });
    await listWalletTransactions({ accessToken: 'token' });
    await createPixPayment({ accessToken: 'token' }, { amount: '20' });
    await getCustomerPaymentDetail({ accessToken: 'token' }, 'pay-1');
    await createCustomerOrder(
      { accessToken: 'token' },
      { catalogServiceId: 7, link: 'https://instagram.com/perfil', quantity: 100, affiliateCode: 'AFILIA30' },
    );
    await getCustomerOrderDetail({ accessToken: 'token' }, 'ord-1');
    await listCustomerSupportTickets(
      { accessToken: 'token' },
      { page: 2, pageSize: 8, sortOrder: 'asc', search: 'pedido', status: 'waiting_customer' },
    );
    await createCustomerSupportTicket(
      { accessToken: 'token' },
      { subject: 'Ajuda no pedido', message: 'Meu pedido parou.' },
    );
    await getCustomerSupportTicketDetail({ accessToken: 'token' }, 'tick-1');
    await createCustomerSupportTicketMessage(
      { accessToken: 'token' },
      'tick-1',
      { message: 'Consegui enviar mais detalhes.' },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(
    requests.map((request) => ({
      url: request.url,
      method: request.init?.method ?? 'GET',
    })),
    [
      { url: 'http://localhost:3001/v1/me/wallet', method: 'GET' },
      { url: 'http://localhost:3001/v1/me', method: 'GET' },
      { url: 'http://localhost:3001/v1/me', method: 'PATCH' },
      { url: 'http://localhost:3001/v1/me/referral', method: 'GET' },
      { url: 'http://localhost:3001/v1/me/affiliate', method: 'GET' },
      { url: 'http://localhost:3001/v1/me/affiliate/pix-key', method: 'GET' },
      { url: 'http://localhost:3001/v1/me/affiliate/pix-key', method: 'PATCH' },
      { url: 'http://localhost:3001/v1/me/affiliate/apply', method: 'POST' },
      { url: 'http://localhost:3001/v1/me/affiliate/summary', method: 'GET' },
      { url: 'http://localhost:3001/v1/me/affiliate/commissions?page=1&pageSize=10&sortOrder=desc', method: 'GET' },
      { url: 'http://localhost:3001/v1/me/payments?page=1&pageSize=5&sortOrder=desc', method: 'GET' },
      { url: 'http://localhost:3001/v1/me/orders?page=1&pageSize=5&sortOrder=desc', method: 'GET' },
      { url: 'http://localhost:3001/v1/me/wallet/transactions?page=1&pageSize=10&sortOrder=desc', method: 'GET' },
      { url: 'http://localhost:3001/v1/me/payments/pix', method: 'POST' },
      { url: 'http://localhost:3001/v1/me/payments/pay-1', method: 'GET' },
      { url: 'http://localhost:3001/v1/me/orders', method: 'POST' },
      { url: 'http://localhost:3001/v1/me/orders/ord-1', method: 'GET' },
      {
        url: 'http://localhost:3001/v1/me/support/tickets?page=2&pageSize=8&sortOrder=asc&search=pedido&status=waiting_customer',
        method: 'GET',
      },
      { url: 'http://localhost:3001/v1/me/support/tickets', method: 'POST' },
      { url: 'http://localhost:3001/v1/me/support/tickets/tick-1', method: 'GET' },
      { url: 'http://localhost:3001/v1/me/support/tickets/tick-1/messages', method: 'POST' },
    ],
  );

  const updateProfileRequest = requests[2];
  const affiliatePixUpdateRequest = requests[6];
  const pixRequest = requests[13];
  const orderRequest = requests[15];
  const supportTicketRequest = requests[18];
  const supportMessageRequest = requests[20];

  assert.equal(
    updateProfileRequest.init?.body,
    JSON.stringify({ name: 'Maria Souza', phone: '(31) 99999-0000', taxId: '123.456.789-09' }),
  );
  assert.equal(affiliatePixUpdateRequest.init?.body, JSON.stringify({ pixKeyType: 'email', pixKey: 'afiliado@example.com' }));
  assert.equal(new Headers(pixRequest.init?.headers).get('Authorization'), 'Bearer token');
  assert.equal(pixRequest.init?.body, JSON.stringify({ amount: '20' }));
  assert.equal(
    orderRequest.init?.body,
    JSON.stringify({ catalogServiceId: 7, link: 'https://instagram.com/perfil', quantity: 100, affiliateCode: 'AFILIA30' }),
  );
  assert.equal(
    supportTicketRequest.init?.body,
    JSON.stringify({ subject: 'Ajuda no pedido', message: 'Meu pedido parou.' }),
  );
  assert.equal(supportMessageRequest.init?.body, JSON.stringify({ message: 'Consegui enviar mais detalhes.' }));
});

test('customer affiliate api normalizes current backend aliases for profile, summary and commissions', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async (input) => {
    const url = String(input);

    if (url.endsWith('/me/affiliate')) {
      return new Response(
        JSON.stringify({
          id: 'aff-1',
          publicCode: 'PUB-123',
          status: 'active',
          createdAt: '2026-04-20T10:00:00.000Z',
          updatedAt: '2026-04-20T10:00:00.000Z',
          approvedAt: '2026-04-20T10:00:00.000Z',
          suspendedAt: null,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (url.endsWith('/me/affiliate/summary')) {
      return new Response(
        JSON.stringify({
          affiliateProfile: {
            id: 'aff-1',
            affiliateCode: 'AFF-123',
            publicCode: 'AFF-123',
            status: 'active',
            createdAt: '2026-04-20T10:00:00.000Z',
            updatedAt: '2026-04-20T10:00:00.000Z',
            approvedAt: '2026-04-20T10:00:00.000Z',
            suspendedAt: null,
          },
          totals: {
            commissionsPendingCount: 2,
            commissionsApprovedCount: 1,
            commissionsRejectedCount: 0,
            commissionsPaidCount: 3,
            commissionsPendingAmount: '10.00',
            commissionsApprovedAmount: '4.50',
            commissionsPaidAmount: '5.00',
            totalRevenueAttributed: '99.90',
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (url.includes('/me/affiliate/commissions')) {
      return new Response(
        JSON.stringify({
          items: [
            {
              id: 'com-1',
              orderId: 'ord-9',
              catalogServiceId: 'svc-4',
              publicPriceSnapshot: '20.00',
              supplierCostSnapshot: '10.00',
              grossMarginSnapshot: '10.00',
              commissionPercentSnapshot: '12',
              commissionAmount: '3.50',
              status: 'approved',
              createdAt: '2026-04-20T10:00:00.000Z',
              approvedAt: '2026-04-20T11:00:00.000Z',
              rejectedAt: null,
              paidAt: null,
            },
          ],
          page: 1,
          pageSize: 10,
          totalItems: 1,
          totalPages: 1,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  try {
    const profile = await getCustomerAffiliateProfile({ accessToken: 'token' });
    const summary = await getCustomerAffiliateSummary({ accessToken: 'token' });
    const commissions = await listCustomerAffiliateCommissions({ accessToken: 'token' });

    assert.equal(profile?.affiliateCode, 'PUB-123');
    assert.equal(profile?.publicCode, 'PUB-123');
    assert.equal(summary.affiliateProfile?.affiliateCode, 'AFF-123');
    assert.equal(summary.affiliateProfile?.publicCode, 'AFF-123');
    assert.equal(commissions.items[0]?.commissionAmount.amount, '3.50');
    assert.equal((summary.totals.commissionsPendingAmount as { amount: string } | undefined)?.amount, '10.00');
    assert.equal(commissions.items[0]?.commissionAmount.amount, '3.50');
    assert.equal(commissions.items[0]?.orderId, 'ord-9');
    assert.equal(commissions.items[0]?.affiliateCommissionPercent, '12');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
