"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const customer_1 = require("../src/lib/api/customer");
(0, node_test_1.default)('customer api functions target the expected endpoints and methods', async () => {
    const originalFetch = globalThis.fetch;
    const requests = [];
    globalThis.fetch = (async (input, init) => {
        requests.push({ url: String(input), init });
        return new Response(JSON.stringify({ ok: true, id: '1', items: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    });
    try {
        await (0, customer_1.getWalletSummary)({ accessToken: 'token' });
        await (0, customer_1.getCustomerProfile)({ accessToken: 'token' });
        await (0, customer_1.listCustomerPayments)({ accessToken: 'token' });
        await (0, customer_1.listCustomerOrders)({ accessToken: 'token' });
        await (0, customer_1.listWalletTransactions)({ accessToken: 'token' });
        await (0, customer_1.createPixPayment)({ accessToken: 'token' }, { amount: '20' });
        await (0, customer_1.getCustomerPaymentDetail)({ accessToken: 'token' }, 'pay-1');
        await (0, customer_1.createCustomerOrder)({ accessToken: 'token' }, { catalogServiceId: 7, link: 'https://instagram.com/perfil', quantity: 100 });
        await (0, customer_1.getCustomerOrderDetail)({ accessToken: 'token' }, 'ord-1');
    }
    finally {
        globalThis.fetch = originalFetch;
    }
    strict_1.default.deepEqual(requests.map((request) => ({
        url: request.url,
        method: request.init?.method ?? 'GET',
    })), [
        { url: 'http://localhost:3001/v1/me/wallet', method: 'GET' },
        { url: 'http://localhost:3001/v1/me', method: 'GET' },
        { url: 'http://localhost:3001/v1/me/payments?page=1&pageSize=5&sortOrder=desc', method: 'GET' },
        { url: 'http://localhost:3001/v1/me/orders?page=1&pageSize=5&sortOrder=desc', method: 'GET' },
        { url: 'http://localhost:3001/v1/me/wallet/transactions?page=1&pageSize=10&sortOrder=desc', method: 'GET' },
        { url: 'http://localhost:3001/v1/me/payments/pix', method: 'POST' },
        { url: 'http://localhost:3001/v1/me/payments/pay-1', method: 'GET' },
        { url: 'http://localhost:3001/v1/me/orders', method: 'POST' },
        { url: 'http://localhost:3001/v1/me/orders/ord-1', method: 'GET' },
    ]);
    const pixRequest = requests[5];
    const orderRequest = requests[7];
    strict_1.default.equal(new Headers(pixRequest.init?.headers).get('Authorization'), 'Bearer token');
    strict_1.default.equal(pixRequest.init?.body, JSON.stringify({ amount: '20' }));
    strict_1.default.equal(orderRequest.init?.body, JSON.stringify({ catalogServiceId: 7, link: 'https://instagram.com/perfil', quantity: 100 }));
});
