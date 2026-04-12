"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const http_1 = require("../src/lib/api/http");
const action_helpers_1 = require("../src/modules/customer-transactions/action-helpers");
(0, node_test_1.default)('parseCreatePixPayload requires amount', () => {
    const empty = new FormData();
    strict_1.default.deepEqual((0, action_helpers_1.parseCreatePixPayload)(empty), {
        error: {
            status: 'error',
            message: 'Informe o valor para gerar a cobranca PIX.',
        },
    });
    const valid = new FormData();
    valid.set('amount', ' 25.50 ');
    strict_1.default.deepEqual((0, action_helpers_1.parseCreatePixPayload)(valid), {
        value: { amount: '25.50' },
    });
});
(0, node_test_1.default)('parseCreateOrderPayload builds supported optional fields', () => {
    const formData = new FormData();
    formData.set('catalogServiceId', '10');
    formData.set('link', 'https://instagram.com/perfil');
    formData.set('quantity', '250');
    formData.set('affiliateCode', ' AFILIA30 ');
    formData.set('runs', '3');
    formData.set('interval', '15');
    formData.set('comments', 'primeiro\n\nsegundo');
    formData.set('answerNumber', '7');
    const parsed = (0, action_helpers_1.parseCreateOrderPayload)(formData);
    strict_1.default.ok('value' in parsed);
    strict_1.default.deepEqual(parsed.value, {
        catalogServiceId: 10,
        link: 'https://instagram.com/perfil',
        quantity: 250,
        affiliateCode: 'AFILIA30',
        runs: 3,
        interval: 15,
        comments: ['primeiro', 'segundo'],
        answerNumber: '7',
    });
});
(0, node_test_1.default)('parseCreateOrderPayload rejects invalid catalog service id and quantity/link', () => {
    const invalidService = new FormData();
    invalidService.set('catalogServiceId', 'abc');
    invalidService.set('link', 'https://instagram.com/perfil');
    invalidService.set('quantity', '10');
    strict_1.default.deepEqual((0, action_helpers_1.parseCreateOrderPayload)(invalidService), {
        error: {
            status: 'error',
            message: 'O contrato atual de criacao de pedido exige catalogServiceId numerico. Este servico nao pode ser convertido de forma segura.',
        },
    });
    const invalidFields = new FormData();
    invalidFields.set('catalogServiceId', '10');
    invalidFields.set('link', '');
    invalidFields.set('quantity', 'abc');
    strict_1.default.deepEqual((0, action_helpers_1.parseCreateOrderPayload)(invalidFields), {
        error: {
            status: 'error',
            message: 'Informe link e quantidade validos para criar o pedido.',
        },
    });
});
(0, node_test_1.default)('readOptionalStringArray normalizes multiline comments', () => {
    const formData = new FormData();
    formData.set('comments', ' one \r\n\r\n two \n three ');
    strict_1.default.deepEqual((0, action_helpers_1.readOptionalStringArray)(formData, 'comments'), ['one', 'two', 'three']);
});
(0, node_test_1.default)('mapTransactionFormError preserves backend message and fallback', () => {
    strict_1.default.deepEqual((0, action_helpers_1.mapTransactionFormError)(new http_1.ApiClientError('Saldo insuficiente', 402), 'fallback'), {
        status: 'error',
        message: 'Saldo insuficiente',
    });
    strict_1.default.deepEqual((0, action_helpers_1.mapTransactionFormError)(new Error('boom'), 'fallback'), {
        status: 'error',
        message: 'fallback',
    });
});
