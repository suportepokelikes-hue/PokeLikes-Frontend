"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const http_1 = require("../src/lib/api/http");
const action_helpers_1 = require("../src/modules/auth/action-helpers");
(0, node_test_1.default)('readTrimmedString trims values and returns empty string for missing entries', () => {
    const formData = new FormData();
    formData.set('email', '  alice@likesuai.com  ');
    strict_1.default.equal((0, action_helpers_1.readTrimmedString)(formData, 'email'), 'alice@likesuai.com');
    strict_1.default.equal((0, action_helpers_1.readTrimmedString)(formData, 'missing'), '');
});
(0, node_test_1.default)('mapLoginError specializes unauthorized errors', () => {
    const mapped = (0, action_helpers_1.mapLoginError)(new http_1.ApiClientError('Backend unauthorized', 401));
    strict_1.default.deepEqual(mapped, {
        status: 'error',
        message: 'Email ou senha invalidos. Revise as credenciais e tente novamente.',
    });
});
(0, node_test_1.default)('mapRegisterError preserves backend validation messages for 400', () => {
    const mapped = (0, action_helpers_1.mapRegisterError)(new http_1.ApiClientError('Email ja cadastrado', 400));
    strict_1.default.deepEqual(mapped, {
        status: 'error',
        message: 'Email ja cadastrado',
    });
});
(0, node_test_1.default)('auth error mappers fall back for unexpected failures', () => {
    strict_1.default.deepEqual((0, action_helpers_1.mapLoginError)(new Error('network')), {
        status: 'error',
        message: 'Nao foi possivel autenticar agora. Tente novamente em instantes.',
    });
    strict_1.default.deepEqual((0, action_helpers_1.mapRegisterError)(new Error('network')), {
        status: 'error',
        message: 'Nao foi possivel concluir o cadastro agora. Tente novamente em instantes.',
    });
});
