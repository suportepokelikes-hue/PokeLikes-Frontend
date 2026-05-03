"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const auth_1 = require("../src/lib/api/auth");
(0, node_test_1.default)('auth api functions target the expected endpoints and methods', async () => {
    const originalFetch = globalThis.fetch;
    const requests = [];
    globalThis.fetch = (async (input, init) => {
        requests.push({ url: String(input), init });
        return new Response(JSON.stringify({ ok: true, accessToken: 'a', refreshToken: 'r' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    });
    try {
        await (0, auth_1.registerCustomer)({
            name: 'Alice',
            email: 'alice@exemplo.com',
            phone: '31999999999',
            password: 'secret',
            referralCode: 'INDIQUE123',
        });
        await (0, auth_1.login)({ email: 'alice@exemplo.com', password: 'secret' });
        await (0, auth_1.loginWithGoogle)({ idToken: 'google-id-token', referralCode: 'INDIQUE123' });
        await (0, auth_1.refreshSession)({ refreshToken: 'refresh-token' });
        await (0, auth_1.logout)({ refreshToken: 'refresh-token' });
        await (0, auth_1.getAuthMe)('token-123');
        await (0, auth_1.getCurrentUser)('token-123');
        await (0, auth_1.requestEmailVerification)('token-123');
        await (0, auth_1.confirmEmailVerification)({ token: 'preview-token' });
    }
    finally {
        globalThis.fetch = originalFetch;
    }
    strict_1.default.deepEqual(requests.map((request) => ({
        url: request.url,
        method: request.init?.method ?? 'GET',
    })), [
        { url: 'http://localhost:3001/v1/auth/register', method: 'POST' },
        { url: 'http://localhost:3001/v1/auth/login', method: 'POST' },
        { url: 'http://localhost:3001/v1/auth/google', method: 'POST' },
        { url: 'http://localhost:3001/v1/auth/refresh', method: 'POST' },
        { url: 'http://localhost:3001/v1/auth/logout', method: 'POST' },
        { url: 'http://localhost:3001/v1/auth/me', method: 'GET' },
        { url: 'http://localhost:3001/v1/me', method: 'GET' },
        { url: 'http://localhost:3001/v1/auth/email-verification/request', method: 'POST' },
        { url: 'http://localhost:3001/v1/auth/email-verification/confirm', method: 'POST' },
    ]);
    strict_1.default.equal(requests[0].init?.body, JSON.stringify({
        name: 'Alice',
        email: 'alice@exemplo.com',
        phone: '31999999999',
        password: 'secret',
        referralCode: 'INDIQUE123',
    }));
    strict_1.default.equal(requests[1].init?.body, JSON.stringify({ email: 'alice@exemplo.com', password: 'secret' }));
    strict_1.default.equal(requests[2].init?.body, JSON.stringify({ idToken: 'google-id-token', referralCode: 'INDIQUE123' }));
    strict_1.default.equal(requests[3].init?.body, JSON.stringify({ refreshToken: 'refresh-token' }));
    strict_1.default.equal(requests[4].init?.body, JSON.stringify({ refreshToken: 'refresh-token' }));
    strict_1.default.equal(new Headers(requests[5].init?.headers).get('Authorization'), 'Bearer token-123');
    strict_1.default.equal(new Headers(requests[6].init?.headers).get('Authorization'), 'Bearer token-123');
    strict_1.default.equal(new Headers(requests[7].init?.headers).get('Authorization'), 'Bearer token-123');
    strict_1.default.equal(requests[8].init?.body, JSON.stringify({ token: 'preview-token' }));
});
