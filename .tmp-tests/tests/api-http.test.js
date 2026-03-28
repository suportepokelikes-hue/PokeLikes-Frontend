"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const http_1 = require("../src/lib/api/http");
(0, node_test_1.default)('apiRequest builds the request with auth, json body and default cache', async () => {
    const originalFetch = globalThis.fetch;
    let capturedUrl = '';
    let capturedInit;
    globalThis.fetch = (async (input, init) => {
        capturedUrl = String(input);
        capturedInit = init;
        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    });
    try {
        const result = await (0, http_1.apiRequest)({
            path: '/admin/users?page=2',
            method: 'POST',
            body: { hello: 'world' },
            accessToken: 'token-123',
        });
        strict_1.default.deepEqual(result, { ok: true });
        strict_1.default.equal(capturedUrl, 'http://localhost:3001/v1/admin/users?page=2');
        strict_1.default.equal(capturedInit?.method, 'POST');
        strict_1.default.equal(capturedInit?.cache, 'no-store');
        strict_1.default.equal(capturedInit?.body, JSON.stringify({ hello: 'world' }));
        const headers = new Headers(capturedInit?.headers);
        strict_1.default.equal(headers.get('Authorization'), 'Bearer token-123');
        strict_1.default.equal(headers.get('Content-Type'), 'application/json');
    }
    finally {
        globalThis.fetch = originalFetch;
    }
});
(0, node_test_1.default)('apiRequest returns undefined for 204 responses', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => new Response(null, { status: 204 }));
    try {
        const result = await (0, http_1.apiRequest)({ path: '/auth/logout', method: 'POST' });
        strict_1.default.equal(result, undefined);
    }
    finally {
        globalThis.fetch = originalFetch;
    }
});
(0, node_test_1.default)('apiRequest surfaces backend error payload in ApiClientError', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => new Response(JSON.stringify({
        error: {
            code: 'validation_error',
            message: 'Payload invalido',
            details: { field: 'email' },
        },
    }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
    }));
    try {
        await strict_1.default.rejects(() => (0, http_1.apiRequest)({ path: '/admin/users', method: 'POST', body: {} }), (error) => {
            strict_1.default.ok(error instanceof http_1.ApiClientError);
            strict_1.default.equal(error.status, 400);
            strict_1.default.equal(error.code, 'validation_error');
            strict_1.default.equal(error.message, 'Payload invalido');
            strict_1.default.deepEqual(error.details, { field: 'email' });
            return true;
        });
    }
    finally {
        globalThis.fetch = originalFetch;
    }
});
