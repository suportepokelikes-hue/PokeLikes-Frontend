"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const page_content_1 = require("../src/modules/auth/page-content");
(0, node_test_1.default)('getLoginPageContent preserves auth return flow and login-specific copy', () => {
    const content = (0, page_content_1.getLoginPageContent)({
        reason: 'required',
        returnTo: '/admin/users/42',
        referralCode: 'INDIQUE42',
        notice: {
            tone: 'info',
            title: 'Acesso necessario',
            description: 'Entre para continuar.',
        },
    });
    strict_1.default.equal(content.title, 'Entrar');
    strict_1.default.equal(content.mode, 'login');
    strict_1.default.equal(content.notice?.title, 'Acesso necessario');
    strict_1.default.equal(content.returnTo, '/admin/users/42');
    strict_1.default.equal(content.referralCode, 'INDIQUE42');
    strict_1.default.equal(content.alternateHref, '/register?reason=required&returnTo=%2Fadmin%2Fusers%2F42&ref=INDIQUE42');
    strict_1.default.equal(content.fields.length, 2);
    strict_1.default.deepEqual(content.fields.map((field) => field.name), ['email', 'password']);
});
(0, node_test_1.default)('getRegisterPageContent preserves register-specific fields and alternate login link', () => {
    const content = (0, page_content_1.getRegisterPageContent)({
        reason: 'expired',
        returnTo: '/catalog/10',
        referralCode: 'GANHE5',
        notice: {
            tone: 'warning',
            title: 'Sessao expirada',
            description: 'Entre novamente.',
        },
    });
    strict_1.default.equal(content.title, 'Criar conta');
    strict_1.default.equal(content.mode, 'register');
    strict_1.default.equal(content.notice?.tone, 'warning');
    strict_1.default.equal(content.referralCode, 'GANHE5');
    strict_1.default.equal(content.alternateHref, '/login?reason=expired&returnTo=%2Fcatalog%2F10&ref=GANHE5');
    strict_1.default.equal(content.fields.length, 5);
    strict_1.default.deepEqual(content.fields.map((field) => field.name), ['name', 'email', 'phone', 'password', 'referralCode']);
    strict_1.default.equal(content.fields[4]?.defaultValue, 'GANHE5');
    strict_1.default.equal(content.fields[4]?.required, false);
});
