"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTrimmedString = readTrimmedString;
exports.mapAuthError = mapAuthError;
exports.mapLoginError = mapLoginError;
exports.mapRegisterError = mapRegisterError;
exports.mapEmailVerificationRequestError = mapEmailVerificationRequestError;
const http_1 = require("../../lib/api/http");
function readTrimmedString(formData, key) {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}
function mapAuthError(error, fallbackMessage) {
    if (error instanceof http_1.ApiClientError) {
        return {
            status: 'error',
            message: error.message || fallbackMessage,
        };
    }
    return {
        status: 'error',
        message: fallbackMessage,
    };
}
function mapLoginError(error) {
    if (error instanceof http_1.ApiClientError && error.status === 401) {
        return {
            status: 'error',
            message: 'Email ou senha invalidos. Revise as credenciais e tente novamente.',
        };
    }
    return mapAuthError(error, 'Nao foi possivel autenticar agora. Tente novamente em instantes.');
}
function mapRegisterError(error) {
    if (error instanceof http_1.ApiClientError && error.status === 400 && hasReferralCodeHint(error)) {
        return {
            status: 'error',
            message: 'Codigo de indicacao invalido. Revise o codigo ou continue o cadastro sem ele.',
        };
    }
    if (error instanceof http_1.ApiClientError && error.status === 400) {
        return {
            status: 'error',
            message: error.message || 'Revise nome, email, telefone e senha antes de enviar o cadastro.',
        };
    }
    return mapAuthError(error, 'Nao foi possivel concluir o cadastro agora. Tente novamente em instantes.');
}
function mapEmailVerificationRequestError(error) {
    if (error instanceof http_1.ApiClientError && error.status === 503) {
        return {
            status: 'error',
            message: 'A verificacao por email nao esta disponivel agora. Tente novamente mais tarde.',
        };
    }
    return {
        status: 'error',
        message: error instanceof http_1.ApiClientError && error.message
            ? error.message
            : 'Nao foi possivel solicitar a verificacao de email agora.',
    };
}
function hasReferralCodeHint(error) {
    const haystack = [error.code, error.message, safeStringify(error.details)].join(' ').toLowerCase();
    return haystack.includes('referral');
}
function safeStringify(value) {
    try {
        return JSON.stringify(value);
    }
    catch {
        return '';
    }
}
