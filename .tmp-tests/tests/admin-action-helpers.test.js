"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const http_1 = require("../src/lib/api/http");
const action_helpers_1 = require("../src/modules/admin-shell/action-helpers");
(0, node_test_1.default)('catalog create parser builds a valid payload from supported fields', () => {
    const formData = new FormData();
    formData.set('name', 'Instagram Likes');
    formData.set('publicPrice', '12.50');
    formData.set('socialNetwork', 'instagram');
    formData.set('category', 'likes');
    formData.set('type', 'default');
    formData.set('minQuantity', '100');
    formData.set('maxQuantity', '5000');
    formData.set('supplierServiceId', '123');
    formData.set('supplierName', 'main-supplier');
    formData.set('metadata', '{"speed":"fast"}');
    const parsed = (0, action_helpers_1.parseCatalogCreatePayload)(formData);
    strict_1.default.ok('value' in parsed);
    strict_1.default.deepEqual(parsed.value, {
        name: 'Instagram Likes',
        publicPrice: '12.50',
        socialNetwork: 'instagram',
        category: 'likes',
        type: 'default',
        minQuantity: 100,
        maxQuantity: 5000,
        supplierServiceId: 123,
        supplierName: 'main-supplier',
        metadata: { speed: 'fast' },
    });
});
(0, node_test_1.default)('affiliate payout status parser targets the payout status mutation contract', () => {
    const formData = new FormData();
    formData.set('payoutId', 'payout-123');
    formData.set('status', 'paid');
    formData.set('statusReason', 'PIX manual confirmado');
    formData.set('notes', 'Fechamento validado');
    const parsed = (0, action_helpers_1.parseAffiliatePayoutStatusPayload)(formData);
    strict_1.default.ok('value' in parsed);
    strict_1.default.deepEqual(parsed, {
        payoutId: 'payout-123',
        value: {
            status: 'paid',
            notes: 'Fechamento validado',
            statusReason: 'PIX manual confirmado',
        },
    });
    const invalid = new FormData();
    invalid.set('payoutId', 'payout-123');
    invalid.set('status', 'requested');
    strict_1.default.deepEqual((0, action_helpers_1.parseAffiliatePayoutStatusPayload)(invalid), {
        error: {
            status: 'error',
            message: 'Escolha um status valido para o payout.',
        },
    });
});
(0, node_test_1.default)('catalog create parser rejects invalid ranges and malformed metadata', () => {
    const invalidRange = new FormData();
    invalidRange.set('name', 'Service');
    invalidRange.set('publicPrice', '9.99');
    invalidRange.set('socialNetwork', 'instagram');
    invalidRange.set('category', 'likes');
    invalidRange.set('type', 'default');
    invalidRange.set('minQuantity', '1000');
    invalidRange.set('maxQuantity', '10');
    invalidRange.set('supplierServiceId', '4');
    strict_1.default.deepEqual((0, action_helpers_1.parseCatalogCreatePayload)(invalidRange), {
        error: {
            status: 'error',
            message: 'A quantidade maxima nao pode ser menor que a minima.',
        },
    });
    const invalidJson = new FormData();
    invalidJson.set('name', 'Service');
    invalidJson.set('publicPrice', '9.99');
    invalidJson.set('socialNetwork', 'instagram');
    invalidJson.set('category', 'likes');
    invalidJson.set('type', 'default');
    invalidJson.set('minQuantity', '10');
    invalidJson.set('maxQuantity', '100');
    invalidJson.set('supplierServiceId', '4');
    invalidJson.set('metadata', '{broken');
    strict_1.default.deepEqual((0, action_helpers_1.parseCatalogCreatePayload)(invalidJson), {
        error: {
            status: 'error',
            message: 'Metadata precisa ser um JSON valido quando preenchido.',
        },
    });
});
(0, node_test_1.default)('catalog update parser supports explicit clearing of nullable fields', () => {
    const formData = new FormData();
    formData.set('clearDescription', 'true');
    formData.set('clearMetadata', 'true');
    formData.set('status', 'inactive');
    const parsed = (0, action_helpers_1.parseCatalogUpdatePayload)(formData);
    strict_1.default.ok('value' in parsed);
    strict_1.default.deepEqual(parsed.value, {
        description: null,
        metadata: null,
        status: 'inactive',
    });
});
(0, node_test_1.default)('catalog affiliate settings parser enforces a human commission percent only when enabled', () => {
    const enabledForm = new FormData();
    enabledForm.set('affiliateEnabled', 'true');
    enabledForm.set('affiliateCommissionPercent', '12,5');
    const enabledParsed = (0, action_helpers_1.parseCatalogAffiliateSettingsUpdatePayload)(enabledForm);
    strict_1.default.ok('value' in enabledParsed);
    strict_1.default.deepEqual(enabledParsed.value, {
        isAffiliateEnabled: true,
        affiliateCommissionPercent: '12.5',
    });
    const disabledForm = new FormData();
    disabledForm.set('affiliateEnabled', 'false');
    const disabledParsed = (0, action_helpers_1.parseCatalogAffiliateSettingsUpdatePayload)(disabledForm);
    strict_1.default.ok('value' in disabledParsed);
    strict_1.default.deepEqual(disabledParsed.value, {
        isAffiliateEnabled: false,
    });
    const invalidEnabledForm = new FormData();
    invalidEnabledForm.set('affiliateEnabled', 'true');
    invalidEnabledForm.set('affiliateCommissionPercent', '0');
    strict_1.default.deepEqual((0, action_helpers_1.parseCatalogAffiliateSettingsUpdatePayload)(invalidEnabledForm), {
        error: {
            status: 'error',
            message: 'Informe um percentual maior que zero para ativar a afiliacao.',
        },
    });
});
(0, node_test_1.default)('admin helper readers and error mapping keep only supported values', () => {
    const formData = new FormData();
    formData.set('role', 'admin');
    formData.set('status', 'disabled');
    formData.set('direction', 'credit');
    formData.set('type', 'wallet_reversal_admin');
    strict_1.default.equal((0, action_helpers_1.readRole)(formData), 'admin');
    strict_1.default.equal((0, action_helpers_1.readStatus)(formData), 'disabled');
    strict_1.default.equal((0, action_helpers_1.readWalletDirection)(formData), 'credit');
    strict_1.default.equal((0, action_helpers_1.readWalletAdjustmentType)(formData), 'wallet_reversal_admin');
    strict_1.default.equal((0, action_helpers_1.readSupplierSyncName)(formData), undefined);
    formData.set('supplierName', 'cheapsmmglobal');
    strict_1.default.equal((0, action_helpers_1.readSupplierSyncName)(formData), 'cheapsmmglobal');
    strict_1.default.deepEqual((0, action_helpers_1.mapAdminActionError)(new http_1.ApiClientError('Falha operacional', 500), 'fallback'), {
        status: 'error',
        message: 'Falha operacional',
    });
    strict_1.default.deepEqual((0, action_helpers_1.mapAdminActionError)(new Error('boom'), 'fallback'), {
        status: 'error',
        message: 'fallback',
    });
});
(0, node_test_1.default)('affiliate payout parser sends affiliateProfileId, commissionIds and notes according to the current contract', () => {
    const formData = new FormData();
    formData.set('affiliateProfileId', '123');
    formData.set('commissionIds', ' 1,\n2\n1 ');
    formData.set('notes', 'Validado pelo financeiro');
    const parsed = (0, action_helpers_1.parseAffiliatePayoutPayload)(formData);
    strict_1.default.ok('value' in parsed);
    strict_1.default.deepEqual(parsed.commissionIds, [1, 2]);
    strict_1.default.deepEqual(parsed.value, {
        affiliateProfileId: 123,
        commissionIds: [1, 2],
        notes: 'Validado pelo financeiro',
    });
    const missingIds = new FormData();
    strict_1.default.deepEqual((0, action_helpers_1.parseAffiliatePayoutPayload)(missingIds), {
        error: {
            status: 'error',
            message: 'Informe um ID numerico de perfil afiliado para registrar o payout.',
        },
    });
    const missingCommissions = new FormData();
    missingCommissions.set('affiliateProfileId', '123');
    strict_1.default.deepEqual((0, action_helpers_1.parseAffiliatePayoutPayload)(missingCommissions), {
        error: {
            status: 'error',
            message: 'Informe ao menos um ID numerico de comissao aprovada.',
        },
    });
});
