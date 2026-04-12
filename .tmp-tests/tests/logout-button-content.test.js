"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const logout_button_content_1 = require("../src/modules/auth/logout-button-content");
(0, node_test_1.default)('getLogoutButtonView keeps custom label when not pending', () => {
    strict_1.default.deepEqual((0, logout_button_content_1.getLogoutButtonView)('Encerrar sessao', false), {
        label: 'Encerrar sessao',
        disabled: false,
        visibleLabel: 'Encerrar sessao',
    });
});
(0, node_test_1.default)('getLogoutButtonView switches to pending copy and disables button', () => {
    strict_1.default.deepEqual((0, logout_button_content_1.getLogoutButtonView)('Sair', true), {
        label: 'Sair',
        disabled: true,
        visibleLabel: 'Saindo...',
    });
});
