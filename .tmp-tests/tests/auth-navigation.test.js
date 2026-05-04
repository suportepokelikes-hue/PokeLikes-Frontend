"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const navigation_1 = require("../src/lib/auth/navigation");
(0, node_test_1.default)('normalizeReturnTo rejects unsafe or auth entry paths', () => {
    strict_1.default.equal((0, navigation_1.normalizeReturnTo)('https://evil.example'), null);
    strict_1.default.equal((0, navigation_1.normalizeReturnTo)('//evil.example'), null);
    strict_1.default.equal((0, navigation_1.normalizeReturnTo)('/login?reason=required'), null);
    strict_1.default.equal((0, navigation_1.normalizeReturnTo)('/register'), null);
    strict_1.default.equal((0, navigation_1.normalizeReturnTo)('/admin/users?page=2'), '/admin/users?page=2');
});
(0, node_test_1.default)('getLoginPath preserves safe returnTo and reason', () => {
    strict_1.default.equal((0, navigation_1.getLoginPath)({ reason: 'required', returnTo: '/admin/users?page=2' }), '/login?reason=required&returnTo=%2Fadmin%2Fusers%3Fpage%3D2');
    strict_1.default.equal((0, navigation_1.getLoginPath)({ reason: 'logged_out', returnTo: '/login' }), '/login?reason=logged_out');
});
(0, node_test_1.default)('auth entry paths preserve a normalized referral code when present', () => {
    strict_1.default.equal((0, navigation_1.getRegisterPath)({ referralCode: ' INDICA123 ' }), '/register?ref=INDICA123');
    strict_1.default.equal((0, navigation_1.getLoginPath)({ reason: 'required', referralCode: 'ABC' }), '/login?reason=required&ref=ABC');
    strict_1.default.equal((0, navigation_1.normalizeReferralCode)('   '), null);
});
(0, node_test_1.default)('getPostAuthRedirectPath prevents crossing protected areas', () => {
    strict_1.default.equal((0, navigation_1.getPostAuthRedirectPath)('customer', '/admin/users/123'), '/app/new-order');
    strict_1.default.equal((0, navigation_1.getPostAuthRedirectPath)('customer'), '/app/new-order');
    strict_1.default.equal((0, navigation_1.getPostAuthRedirectPath)('admin', '/app/orders/1'), '/admin');
    strict_1.default.equal((0, navigation_1.getPostAuthRedirectPath)('admin', '/admin/catalog/10'), '/admin/catalog/10');
});
(0, node_test_1.default)('getAuthNotice maps reason and returnTo into the correct notice copy', () => {
    strict_1.default.deepEqual((0, navigation_1.getAuthNotice)({ reason: 'required', returnTo: '/catalog/10' }), {
        tone: 'info',
        title: 'Acesso necessario',
        description: 'Entre para continuar exatamente na rota protegida que originou este redirecionamento.',
    });
    strict_1.default.deepEqual((0, navigation_1.getAuthNotice)({ reason: 'expired' }), {
        tone: 'warning',
        title: 'Sessao expirada',
        description: 'Sua sessao nao pode ser renovada. Entre novamente para continuar.',
    });
});
