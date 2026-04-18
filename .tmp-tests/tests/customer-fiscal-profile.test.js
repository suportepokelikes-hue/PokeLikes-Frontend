"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const customer_fiscal_profile_1 = require("../src/modules/customer-dashboard/customer-fiscal-profile");
(0, node_test_1.default)('customer fiscal profile prefers nested fiscalProfile and exposes label helpers', () => {
    const user = {
        taxId: '11122233344',
        fiscalProfile: {
            taxId: '12.345.678/0001-90',
            taxIdType: 'cnpj',
        },
    };
    strict_1.default.deepEqual((0, customer_fiscal_profile_1.getUserFiscalProfile)(user), {
        taxId: '12.345.678/0001-90',
        taxIdType: 'cnpj',
    });
    strict_1.default.equal((0, customer_fiscal_profile_1.getUserTaxId)(user), '12.345.678/0001-90');
    strict_1.default.equal((0, customer_fiscal_profile_1.getFiscalIdentityLabel)(user), 'CNPJ');
    strict_1.default.equal((0, customer_fiscal_profile_1.hasUserFiscalIdentity)(user), true);
});
(0, node_test_1.default)('customer fiscal profile infers top-level taxId when nested payload is absent', () => {
    const user = {
        taxId: '12345678909',
        fiscalProfile: null,
    };
    strict_1.default.deepEqual((0, customer_fiscal_profile_1.getUserFiscalProfile)(user), {
        taxId: '12345678909',
        taxIdType: 'cpf',
    });
    strict_1.default.equal((0, customer_fiscal_profile_1.getFiscalIdentityLabel)(user), 'CPF');
    strict_1.default.equal((0, customer_fiscal_profile_1.formatTaxIdForDisplay)((0, customer_fiscal_profile_1.getUserTaxId)(user)), '123.456.789-09');
});
(0, node_test_1.default)('customer fiscal profile handles empty state and basic tax id validation', () => {
    const user = {
        taxId: undefined,
        fiscalProfile: null,
    };
    strict_1.default.equal((0, customer_fiscal_profile_1.getUserFiscalProfile)(user), null);
    strict_1.default.equal((0, customer_fiscal_profile_1.hasUserFiscalIdentity)(user), false);
    strict_1.default.equal((0, customer_fiscal_profile_1.getFiscalIdentityLabel)(user), 'CPF/CNPJ');
    strict_1.default.equal((0, customer_fiscal_profile_1.formatTaxIdForDisplay)(null), 'Nao informado');
    strict_1.default.equal((0, customer_fiscal_profile_1.isValidTaxIdInput)('123.456.789-09'), true);
    strict_1.default.equal((0, customer_fiscal_profile_1.isValidTaxIdInput)('12.345.678/0001-90'), true);
    strict_1.default.equal((0, customer_fiscal_profile_1.isValidTaxIdInput)('12345'), false);
});
