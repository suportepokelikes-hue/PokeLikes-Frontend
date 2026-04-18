"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFiscalProfile = getUserFiscalProfile;
exports.getUserTaxId = getUserTaxId;
exports.hasUserFiscalIdentity = hasUserFiscalIdentity;
exports.getUserTaxIdType = getUserTaxIdType;
exports.getFiscalIdentityLabel = getFiscalIdentityLabel;
exports.formatTaxIdForDisplay = formatTaxIdForDisplay;
exports.isValidTaxIdInput = isValidTaxIdInput;
function getUserFiscalProfile(user) {
    if (user.fiscalProfile?.taxId) {
        return user.fiscalProfile;
    }
    if (!user.taxId) {
        return null;
    }
    const inferredType = inferTaxIdType(user.taxId);
    return {
        taxId: user.taxId,
        taxIdType: inferredType ?? 'cpf',
    };
}
function getUserTaxId(user) {
    return getUserFiscalProfile(user)?.taxId ?? null;
}
function hasUserFiscalIdentity(user) {
    return Boolean(getUserTaxId(user));
}
function getUserTaxIdType(user) {
    return getUserFiscalProfile(user)?.taxIdType ?? null;
}
function getFiscalIdentityLabel(user) {
    const taxIdType = getUserTaxIdType(user);
    if (taxIdType === 'cpf') {
        return 'CPF';
    }
    if (taxIdType === 'cnpj') {
        return 'CNPJ';
    }
    return 'CPF/CNPJ';
}
function formatTaxIdForDisplay(value) {
    if (!value) {
        return 'Nao informado';
    }
    const digits = value.replace(/\D/g, '');
    if (digits.length === 11) {
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (digits.length === 14) {
        return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
}
function isValidTaxIdInput(value) {
    const digits = value.replace(/\D/g, '');
    return digits.length === 11 || digits.length === 14;
}
function inferTaxIdType(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 11) {
        return 'cpf';
    }
    if (digits.length === 14) {
        return 'cnpj';
    }
    return null;
}
