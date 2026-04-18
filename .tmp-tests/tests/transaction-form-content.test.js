"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const transaction_form_content_1 = require("../src/modules/customer-transactions/transaction-form-content");
(0, node_test_1.default)('getTransactionFormView exposes returnTo and submit labels for happy path', () => {
    const child = 'campo';
    const view = (0, transaction_form_content_1.getTransactionFormView)({
        title: 'Criar PIX',
        description: 'Gera uma cobranca real.',
        children: child,
        submitLabel: 'Gerar PIX',
        returnTo: '/app/payments',
    }, { status: 'idle' });
    strict_1.default.equal(view.title, 'Criar PIX');
    strict_1.default.equal(view.description, 'Gera uma cobranca real.');
    strict_1.default.equal(view.children, child);
    strict_1.default.equal(view.hiddenReturnTo, '/app/payments');
    strict_1.default.equal(view.feedback, null);
    strict_1.default.equal(view.submitLabel, 'Gerar PIX');
    strict_1.default.equal(view.pendingLabel, 'Processando...');
});
(0, node_test_1.default)('getTransactionFormView builds fallback error when action returns no message', () => {
    const explicitError = (0, transaction_form_content_1.getTransactionFormView)({
        title: 'Criar pedido',
        description: 'Fluxo do cliente.',
        children: null,
        submitLabel: 'Enviar pedido',
    }, { status: 'error', message: 'Saldo insuficiente' });
    strict_1.default.equal(explicitError.hiddenReturnTo, null);
    strict_1.default.deepEqual(explicitError.feedback, {
        tone: 'error',
        message: 'Saldo insuficiente',
        actionHref: null,
        actionLabel: null,
    });
    const fallbackError = (0, transaction_form_content_1.getTransactionFormView)({
        title: 'Criar pedido',
        description: 'Fluxo do cliente.',
        children: null,
        submitLabel: 'Enviar pedido',
    }, { status: 'error' });
    strict_1.default.deepEqual(fallbackError.feedback, {
        tone: 'error',
        message: 'Nao foi possivel concluir a operacao.',
        actionHref: null,
        actionLabel: null,
    });
});
(0, node_test_1.default)('getTransactionFormView exposes blocked CTA for fiscal identity requirements', () => {
    const blocked = (0, transaction_form_content_1.getTransactionFormView)({
        title: 'Criar PIX',
        description: 'Fluxo do cliente.',
        children: null,
        submitLabel: 'Gerar PIX',
    }, {
        status: 'blocked',
        message: 'Voce precisa completar o perfil.',
        actionHref: '/app/profile?edit=1',
        actionLabel: 'Completar CPF/CNPJ',
    });
    strict_1.default.deepEqual(blocked.feedback, {
        tone: 'blocked',
        message: 'Voce precisa completar o perfil.',
        actionHref: '/app/profile?edit=1',
        actionLabel: 'Completar CPF/CNPJ',
    });
});
