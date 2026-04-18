"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const customer_profile_edit_1 = require("../src/modules/customer-dashboard/customer-profile-edit");
const http_1 = require("../src/lib/api/http");
(0, node_test_1.default)('customer profile edit parser keeps only supported editable fields', () => {
    const formData = new FormData();
    formData.set('name', '  Maria Souza  ');
    formData.set('phone', '  (31) 99999-0000  ');
    formData.set('taxId', ' 123.456.789-09 ');
    formData.set('email', 'maria@example.com');
    const parsed = (0, customer_profile_edit_1.parseCustomerProfileEditDraft)(formData);
    strict_1.default.ok('value' in parsed);
    strict_1.default.deepEqual(parsed.value, {
        name: 'Maria Souza',
        phone: '(31) 99999-0000',
        taxId: '123.456.789-09',
    });
});
(0, node_test_1.default)('customer profile edit parser requires a visible account name', () => {
    const formData = new FormData();
    formData.set('name', '   ');
    strict_1.default.deepEqual((0, customer_profile_edit_1.parseCustomerProfileEditDraft)(formData), {
        error: {
            status: 'error',
            message: 'Informe o nome que deve aparecer na sua conta.',
        },
    });
});
(0, node_test_1.default)('customer profile edit contract exposes the supported editable fields', () => {
    strict_1.default.equal(customer_profile_edit_1.customerProfileEditContract.endpoint, 'PATCH /me');
    strict_1.default.equal(customer_profile_edit_1.customerProfileEditContract.isAvailable, true);
    strict_1.default.deepEqual(customer_profile_edit_1.customerProfileEditContract.editableFields, ['name', 'phone', 'taxId']);
    strict_1.default.deepEqual(customer_profile_edit_1.customerProfileEditContract.readonlyFields, ['email']);
});
(0, node_test_1.default)('customer profile edit parser rejects invalid tax ids before sending to backend', () => {
    const formData = new FormData();
    formData.set('name', 'Maria Souza');
    formData.set('taxId', '12345');
    strict_1.default.deepEqual((0, customer_profile_edit_1.parseCustomerProfileEditDraft)(formData), {
        error: {
            status: 'error',
            message: 'Informe um CPF ou CNPJ valido para liberar a geracao de PIX.',
        },
    });
});
(0, node_test_1.default)('customer profile edit maps backend errors to inline feedback', () => {
    const error = new http_1.ApiClientError('Telefone invalido para este cadastro.', 400, 'validation_error');
    strict_1.default.deepEqual((0, customer_profile_edit_1.mapCustomerProfileEditError)(error), {
        status: 'error',
        message: 'Telefone invalido para este cadastro.',
    });
});
(0, node_test_1.default)('customer profile edit falls back to a generic inline error when needed', () => {
    strict_1.default.deepEqual((0, customer_profile_edit_1.mapCustomerProfileEditError)(new Error('boom')), {
        status: 'error',
        message: 'Nao foi possivel atualizar seus dados agora.',
    });
});
