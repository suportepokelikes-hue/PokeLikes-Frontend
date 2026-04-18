"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerProfileEditContract = exports.initialCustomerProfileEditState = void 0;
exports.parseCustomerProfileEditDraft = parseCustomerProfileEditDraft;
exports.mapCustomerProfileEditError = mapCustomerProfileEditError;
const http_1 = require("../../lib/api/http");
const customer_fiscal_profile_1 = require("./customer-fiscal-profile");
exports.initialCustomerProfileEditState = {
    status: 'idle',
};
exports.customerProfileEditContract = {
    endpoint: 'PATCH /me',
    isAvailable: true,
    editableFields: ['name', 'phone', 'taxId'],
    readonlyFields: ['email'],
};
function parseCustomerProfileEditDraft(formData) {
    const name = readTrimmedString(formData, 'name');
    const phone = readTrimmedString(formData, 'phone');
    const taxId = readTrimmedString(formData, 'taxId');
    if (!name) {
        return {
            error: {
                status: 'error',
                message: 'Informe o nome que deve aparecer na sua conta.',
            },
        };
    }
    if (taxId && !(0, customer_fiscal_profile_1.isValidTaxIdInput)(taxId)) {
        return {
            error: {
                status: 'error',
                message: 'Informe um CPF ou CNPJ valido para liberar a geracao de PIX.',
            },
        };
    }
    return {
        value: {
            name,
            ...(phone ? { phone } : {}),
            ...(taxId ? { taxId } : {}),
        },
    };
}
function readTrimmedString(formData, key) {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}
function mapCustomerProfileEditError(error) {
    if (error instanceof http_1.ApiClientError) {
        return {
            status: 'error',
            message: error.message || 'Nao foi possivel atualizar seus dados agora.',
        };
    }
    return {
        status: 'error',
        message: 'Nao foi possivel atualizar seus dados agora.',
    };
}
