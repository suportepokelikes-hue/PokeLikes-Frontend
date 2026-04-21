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
        await (0, customer_1.updateCustomerProfile)({ accessToken: 'token' }, { name: 'Maria Souza', phone: '(31) 99999-0000', taxId: '123.456.789-09' });
        await (0, customer_1.getCustomerReferralSummary)({ accessToken: 'token' });
        await (0, customer_1.getCustomerAffiliateProfile)({ accessToken: 'token' });
        await (0, customer_1.getCustomerAffiliatePix)({ accessToken: 'token' });
        await (0, customer_1.updateCustomerAffiliatePix)({ accessToken: 'token' }, { pixKeyType: 'email', pixKey: 'afiliado@example.com' });
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
    ]);
    const updateProfileRequest = requests[2];
    const affiliatePixUpdateRequest = requests[6];
    const pixRequest = requests[13];
    const orderRequest = requests[15];
    strict_1.default.equal(updateProfileRequest.init?.body, JSON.stringify({ name: 'Maria Souza', phone: '(31) 99999-0000', taxId: '123.456.789-09' }));
    strict_1.default.equal(affiliatePixUpdateRequest.init?.body, JSON.stringify({ pixKeyType: 'email', pixKey: 'afiliado@example.com' }));
    strict_1.default.equal(new Headers(pixRequest.init?.headers).get('Authorization'), 'Bearer token');
    strict_1.default.equal(pixRequest.init?.body, JSON.stringify({ amount: '20' }));
    strict_1.default.equal(orderRequest.init?.body, JSON.stringify({ catalogServiceId: 7, link: 'https://instagram.com/perfil', quantity: 100, affiliateCode: 'AFILIA30' }));
});
(0, node_test_1.default)('customer affiliate api normalizes current backend aliases for profile, summary and commissions', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async (input) => {
        const url = String(input);
        if (url.endsWith('/me/affiliate')) {
            return new Response(JSON.stringify({
                id: 'aff-1',
                publicCode: 'PUB-123',
                status: 'active',
                createdAt: '2026-04-20T10:00:00.000Z',
                updatedAt: '2026-04-20T10:00:00.000Z',
                approvedAt: '2026-04-20T10:00:00.000Z',
                suspendedAt: null,
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        if (url.endsWith('/me/affiliate/summary')) {
            return new Response(JSON.stringify({
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
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        if (url.includes('/me/affiliate/commissions')) {
            return new Response(JSON.stringify({
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
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    });
    try {
        const profile = await (0, customer_1.getCustomerAffiliateProfile)({ accessToken: 'token' });
        const summary = await (0, customer_1.getCustomerAffiliateSummary)({ accessToken: 'token' });
        const commissions = await (0, customer_1.listCustomerAffiliateCommissions)({ accessToken: 'token' });
        strict_1.default.equal(profile?.affiliateCode, 'PUB-123');
        strict_1.default.equal(profile?.publicCode, 'PUB-123');
        strict_1.default.equal(summary.affiliateProfile?.affiliateCode, 'AFF-123');
        strict_1.default.equal(summary.affiliateProfile?.publicCode, 'AFF-123');
        strict_1.default.equal(commissions.items[0]?.commissionAmount.amount, '3.50');
        strict_1.default.equal(summary.totals.commissionsPendingAmount?.amount, '10.00');
        strict_1.default.equal(commissions.items[0]?.commissionAmount.amount, '3.50');
        strict_1.default.equal(commissions.items[0]?.orderId, 'ord-9');
        strict_1.default.equal(commissions.items[0]?.affiliateCommissionPercent, '12');
    }
    finally {
        globalThis.fetch = originalFetch;
    }
});
