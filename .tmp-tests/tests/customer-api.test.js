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
        await (0, customer_1.updateCustomerProfile)({ accessToken: 'token' }, { name: 'Maria Souza', phone: '(31) 99999-0000' });
        await (0, customer_1.getCustomerReferralSummary)({ accessToken: 'token' });
        await (0, customer_1.getCustomerAffiliateProfile)({ accessToken: 'token' });
        await (0, customer_1.applyToAffiliateProgram)({ accessToken: 'token' });
        await (0, customer_1.getCustomerAffiliateSummary)({ accessToken: 'token' });
        await (0, customer_1.listCustomerAffiliateCommissions)({ accessToken: 'token' });
        await (0, customer_1.listCustomerPayments)({ accessToken: 'token' });
        await (0, customer_1.listCustomerOrders)({ accessToken: 'token' });
        await (0, customer_1.listWalletTransactions)({ accessToken: 'token' });
        await (0, customer_1.createPixPayment)({ accessToken: 'token' }, { amount: '20' });
        await (0, customer_1.getCustomerPaymentDetail)({ accessToken: 'token' }, 'pay-1');
        await (0, customer_1.createCustomerOrder)({ accessToken: 'token' }, { catalogServiceId: 7, link: 'https://instagram.com/perfil', quantity: 100, affiliateCode: 'AFILIA30' });
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
        { url: 'http://localhost:3001/v1/me', method: 'PATCH' },
        { url: 'http://localhost:3001/v1/me/referral', method: 'GET' },
        { url: 'http://localhost:3001/v1/me/affiliate', method: 'GET' },
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
    ]);
    const updateProfileRequest = requests[2];
    const pixRequest = requests[11];
    const orderRequest = requests[13];
    strict_1.default.equal(updateProfileRequest.init?.body, JSON.stringify({ name: 'Maria Souza', phone: '(31) 99999-0000' }));
    strict_1.default.equal(new Headers(pixRequest.init?.headers).get('Authorization'), 'Bearer token');
    strict_1.default.equal(pixRequest.init?.body, JSON.stringify({ amount: '20' }));
    strict_1.default.equal(orderRequest.init?.body, JSON.stringify({ catalogServiceId: 7, link: 'https://instagram.com/perfil', quantity: 100, affiliateCode: 'AFILIA30' }));
});
