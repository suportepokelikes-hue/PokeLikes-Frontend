"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const admin_action_form_content_1 = require("../src/modules/admin-shell/admin-action-form-content");
(0, node_test_1.default)('getAdminActionFormView exposes default tone, labels and hidden fields', () => {
    const view = (0, admin_action_form_content_1.getAdminActionFormView)({
        submitLabel: 'Resolver alerta',
        hiddenFields: [
            { name: 'alertId', value: '42' },
            { name: 'scope', value: 'orders' },
        ],
        returnTo: '/admin/alerts?page=2',
    }, { status: 'idle' });
    strict_1.default.equal(view.submitLabel, 'Resolver alerta');
    strict_1.default.equal(view.pendingLabel, 'Processando...');
    strict_1.default.equal(view.tone, 'secondary');
    strict_1.default.equal(view.hiddenReturnTo, '/admin/alerts?page=2');
    strict_1.default.deepEqual(view.hiddenFields, [
        { name: 'alertId', value: '42' },
        { name: 'scope', value: 'orders' },
    ]);
    strict_1.default.equal(view.message, null);
});
(0, node_test_1.default)('getAdminActionFormView exposes success and error messages from action state', () => {
    const successState = {
        status: 'success',
        message: 'Alerta resolvido.',
    };
    const errorState = {
        status: 'error',
        message: 'Nao foi possivel reconciliar.',
    };
    strict_1.default.deepEqual((0, admin_action_form_content_1.getAdminActionFormView)({
        submitLabel: 'Salvar',
        pendingLabel: 'Salvando...',
        tone: 'primary',
    }, successState).message, {
        status: 'success',
        text: 'Alerta resolvido.',
    });
    strict_1.default.deepEqual((0, admin_action_form_content_1.getAdminActionFormView)({
        submitLabel: 'Salvar',
        tone: 'danger',
    }, errorState).message, {
        status: 'error',
        text: 'Nao foi possivel reconciliar.',
    });
});
