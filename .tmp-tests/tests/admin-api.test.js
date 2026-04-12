"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const admin_1 = require("../src/lib/api/admin");
(0, node_test_1.default)('admin catalog api functions keep catalog and affiliate settings aligned with the validated contract', async () => {
    const originalFetch = globalThis.fetch;
    const requests = [];
    globalThis.fetch = (async (input, init) => {
        requests.push({ url: String(input), init });
        return new Response(JSON.stringify({ ok: true, id: 'svc-1', items: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    });
    try {
        await (0, admin_1.listAdminCatalogServices)('token-123', { search: 'instagram', page: 2, pageSize: 25 });
        await (0, admin_1.updateAdminCatalogService)('token-123', 'svc-1', {
            name: 'Instagram Likes',
            publicPrice: '19.90',
        });
        await (0, admin_1.listAdminCatalogAffiliateSettings)('token-123', { search: 'instagram', page: 3, pageSize: 25 });
        await (0, admin_1.updateAdminCatalogAffiliateSettings)('token-123', 'svc-1', {
            affiliateEnabled: true,
            affiliateCommissionPercent: '12.5',
        });
    }
    finally {
        globalThis.fetch = originalFetch;
    }
    strict_1.default.deepEqual(requests.map((request) => ({
        url: request.url,
        method: request.init?.method ?? 'GET',
    })), [
        { url: 'http://localhost:3001/v1/admin/catalog/services?page=2&pageSize=25&search=instagram', method: 'GET' },
        { url: 'http://localhost:3001/v1/admin/catalog/services/svc-1', method: 'PATCH' },
        {
            url: 'http://localhost:3001/v1/admin/catalog/affiliate-settings?page=3&pageSize=25&sortOrder=desc&search=instagram',
            method: 'GET',
        },
        { url: 'http://localhost:3001/v1/admin/catalog/svc-1/affiliate-settings', method: 'PATCH' },
    ]);
    strict_1.default.equal(new Headers(requests[0].init?.headers).get('Authorization'), 'Bearer token-123');
    strict_1.default.equal(new Headers(requests[2].init?.headers).get('Authorization'), 'Bearer token-123');
    strict_1.default.equal(requests[1].init?.body, JSON.stringify({
        name: 'Instagram Likes',
        publicPrice: '19.90',
    }));
    strict_1.default.equal(requests[3].init?.body, JSON.stringify({
        affiliateEnabled: true,
        affiliateCommissionPercent: '12.5',
    }));
});
