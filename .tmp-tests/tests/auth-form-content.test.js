"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const auth_form_content_1 = require("../src/modules/auth/auth-form-content");
const baseContent = {
    brandLabel: 'Pokelike',
    title: 'Entrar',
    eyebrow: 'Acesso',
    description: 'Descricao do fluxo.',
    notice: {
        tone: 'info',
        title: 'Sessao expirada',
        description: 'Entre novamente.',
    },
    returnTo: '/admin/orders',
    panelTitle: 'Painel',
    panelCopy: 'Resumo',
    panelItems: ['item 1', 'item 2'],
    footnote: 'Rodape operacional.',
    fields: [
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'voce@exemplo.com',
            autoComplete: 'email',
            inputMode: 'email',
            description: 'Campo principal.',
        },
        {
            name: 'password',
            label: 'Senha',
            type: 'password',
            placeholder: 'Sua senha',
            autoComplete: 'current-password',
        },
    ],
    submitLabel: 'Entrar',
    pendingLabel: 'Validando acesso...',
    alternateHref: '/register?returnTo=%2Fadmin%2Forders',
    alternateLabel: 'Criar conta',
    alternatePrompt: 'Ainda nao tem cadastro?',
};
(0, node_test_1.default)('getAuthFormView exposes notice, hidden returnTo and field descriptors', () => {
    const view = (0, auth_form_content_1.getAuthFormView)(baseContent, { status: 'idle' });
    strict_1.default.deepEqual(view.notice, baseContent.notice);
    strict_1.default.equal(view.hiddenReturnTo, '/admin/orders');
    strict_1.default.equal(view.fields.length, 2);
    strict_1.default.equal(view.fields[0]?.name, 'email');
    strict_1.default.equal(view.fields[0]?.description, 'Campo principal.');
    strict_1.default.equal(view.error, null);
    strict_1.default.equal(view.alternateHref, '/register?returnTo=%2Fadmin%2Forders');
});
(0, node_test_1.default)('getAuthFormView builds auth error copy and fallback message', () => {
    const explicitError = (0, auth_form_content_1.getAuthFormView)(baseContent, {
        status: 'error',
        message: 'Credenciais invalidas.',
    });
    strict_1.default.deepEqual(explicitError.error, {
        title: 'Falha na autenticacao',
        message: 'Credenciais invalidas.',
    });
    const fallbackError = (0, auth_form_content_1.getAuthFormView)({
        ...baseContent,
        notice: null,
        returnTo: null,
    }, { status: 'error' });
    strict_1.default.equal(fallbackError.notice, null);
    strict_1.default.equal(fallbackError.hiddenReturnTo, null);
    strict_1.default.deepEqual(fallbackError.error, {
        title: 'Falha na autenticacao',
        message: 'Nao foi possivel concluir a autenticacao.',
    });
});
