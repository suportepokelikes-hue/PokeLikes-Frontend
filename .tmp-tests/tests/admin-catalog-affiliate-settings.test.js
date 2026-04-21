"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const action_helpers_1 = require("../src/modules/admin-shell/action-helpers");
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
