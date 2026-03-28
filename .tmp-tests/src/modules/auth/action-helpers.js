"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTrimmedString = readTrimmedString;
exports.mapAuthError = mapAuthError;
exports.mapLoginError = mapLoginError;
exports.mapRegisterError = mapRegisterError;
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
    if (error instanceof http_1.ApiClientError && error.status === 400) {
        return {
            status: 'error',
            message: error.message || 'Revise nome, email, telefone e senha antes de enviar o cadastro.',
        };
    }
    return mapAuthError(error, 'Nao foi possivel concluir o cadastro agora. Tente novamente em instantes.');
}
