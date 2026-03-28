import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createCustomerOrder,
  createPixPayment,
  getCustomerOrderDetail,
  getCustomerPaymentDetail,
  getCustomerProfile,
  getWalletSummary,
  listCustomerOrders,
  listCustomerPayments,
  listWalletTransactions,
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
    await listCustomerPayments({ accessToken: 'token' });
    await listCustomerOrders({ accessToken: 'token' });
    await listWalletTransactions({ accessToken: 'token' });
    await createPixPayment({ accessToken: 'token' }, { amount: '20' });
    await getCustomerPaymentDetail({ accessToken: 'token' }, 'pay-1');
    await createCustomerOrder(
      { accessToken: 'token' },
      { catalogServiceId: 7, link: 'https://instagram.com/perfil', quantity: 100 },
    );
    await getCustomerOrderDetail({ accessToken: 'token' }, 'ord-1');
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
      { url: 'http://localhost:3001/v1/me/payments?page=1&pageSize=5&sortOrder=desc', method: 'GET' },
      { url: 'http://localhost:3001/v1/me/orders?page=1&pageSize=5&sortOrder=desc', method: 'GET' },
      { url: 'http://localhost:3001/v1/me/wallet/transactions?page=1&pageSize=10&sortOrder=desc', method: 'GET' },
      { url: 'http://localhost:3001/v1/me/payments/pix', method: 'POST' },
      { url: 'http://localhost:3001/v1/me/payments/pay-1', method: 'GET' },
      { url: 'http://localhost:3001/v1/me/orders', method: 'POST' },
      { url: 'http://localhost:3001/v1/me/orders/ord-1', method: 'GET' },
    ],
  );

  const pixRequest = requests[5];
  const orderRequest = requests[7];

  assert.equal(new Headers(pixRequest.init?.headers).get('Authorization'), 'Bearer token');
  assert.equal(pixRequest.init?.body, JSON.stringify({ amount: '20' }));
  assert.equal(orderRequest.init?.body, JSON.stringify({ catalogServiceId: 7, link: 'https://instagram.com/perfil', quantity: 100 }));
});
