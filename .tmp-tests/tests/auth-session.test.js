"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const session_1 = require("../src/lib/auth/session");
const sampleUser = {
    id: '42',
    role: 'admin',
    name: 'Alice',
    email: 'alice@exemplo.com',
    phone: '31999999999',
    taxId: '123.456.789-09',
    fiscalProfile: {
        taxId: '123.456.789-09',
        taxIdType: 'cpf',
    },
    status: 'active',
    referralCode: 'LIKES42',
    emailVerified: true,
};
(0, node_test_1.default)('serializeUser and deserializeUser preserve supported fields', () => {
    const encoded = (0, session_1.serializeUser)(sampleUser);
    const decoded = (0, session_1.deserializeUser)(encoded);
    strict_1.default.deepEqual(decoded, sampleUser);
});
(0, node_test_1.default)('deserializeUser rejects malformed payloads', () => {
    strict_1.default.equal((0, session_1.deserializeUser)('not-base64'), null);
    const invalidRole = Buffer.from(JSON.stringify({ id: '1', role: 'operator', name: 'Bob', email: 'bob@exemplo.com', status: 'active' }), 'utf8')
        .toString('base64url');
    strict_1.default.equal((0, session_1.deserializeUser)(invalidRole), null);
});
(0, node_test_1.default)('readSession returns guest when any cookie is missing or invalid', () => {
    const missing = (0, session_1.readSession)({
        get(name) {
            return name === 'likes_uai_access_token' ? { value: 'token' } : undefined;
        },
    });
    strict_1.default.deepEqual(missing, (0, session_1.createGuestSession)());
    const invalid = (0, session_1.readSession)({
        get(name) {
            if (name === 'likes_uai_access_token') {
                return { value: 'token' };
            }
            if (name === 'likes_uai_refresh_token') {
                return { value: 'refresh' };
            }
            if (name === 'likes_uai_user') {
                return { value: 'broken' };
            }
            return undefined;
        },
    });
    strict_1.default.deepEqual(invalid, (0, session_1.createGuestSession)());
});
(0, node_test_1.default)('toSessionCookieValues prepares cookie payloads from auth session', () => {
    const session = {
        accessToken: 'access',
        refreshToken: 'refresh',
        user: sampleUser,
    };
    const values = (0, session_1.toSessionCookieValues)(session);
    strict_1.default.equal(values.accessToken, 'access');
    strict_1.default.equal(values.refreshToken, 'refresh');
    strict_1.default.deepEqual((0, session_1.deserializeUser)(values.user), sampleUser);
});
