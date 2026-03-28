"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readRequiredString = readRequiredString;
exports.readOptionalInt = readOptionalInt;
exports.readOptionalStringArray = readOptionalStringArray;
exports.parseCreatePixPayload = parseCreatePixPayload;
exports.parseCreateOrderPayload = parseCreateOrderPayload;
exports.mapTransactionFormError = mapTransactionFormError;
const http_1 = require("../../lib/api/http");
function readRequiredString(formData, key) {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}
function readOptionalInt(formData, key) {
    const value = readRequiredString(formData, key);
    if (!value) {
        return undefined;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
}
function readOptionalStringArray(formData, key) {
    const value = readRequiredString(formData, key);
    if (!value) {
        return [];
    }
    return value
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
}
function parseCreatePixPayload(formData) {
    const amount = readRequiredString(formData, 'amount');
    if (!amount) {
        return {
            error: {
                status: 'error',
                message: 'Informe o valor para gerar a cobranca PIX.',
            },
        };
    }
    return {
        value: { amount },
    };
}
function parseCreateOrderPayload(formData) {
    const catalogServiceIdRaw = readRequiredString(formData, 'catalogServiceId');
    const catalogServiceId = Number.parseInt(catalogServiceIdRaw, 10);
    const link = readRequiredString(formData, 'link');
    const quantity = Number.parseInt(readRequiredString(formData, 'quantity'), 10);
    const runs = readOptionalInt(formData, 'runs');
    const interval = readOptionalInt(formData, 'interval');
    const comments = readOptionalStringArray(formData, 'comments');
    const answerNumberRaw = readRequiredString(formData, 'answerNumber');
    if (Number.isNaN(catalogServiceId)) {
        return {
            error: {
                status: 'error',
                message: 'O contrato atual de criacao de pedido exige catalogServiceId numerico. Este servico nao pode ser convertido de forma segura.',
            },
        };
    }
    if (!link || Number.isNaN(quantity)) {
        return {
            error: {
                status: 'error',
                message: 'Informe link e quantidade validos para criar o pedido.',
            },
        };
    }
    return {
        value: {
            catalogServiceId,
            link,
            quantity,
            ...(runs !== undefined ? { runs } : {}),
            ...(interval !== undefined ? { interval } : {}),
            ...(comments.length > 0 ? { comments } : {}),
            ...(answerNumberRaw ? { answerNumber: answerNumberRaw } : {}),
        },
    };
}
function mapTransactionFormError(error, fallbackMessage) {
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
