"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readRequiredString = readRequiredString;
exports.readOptionalString = readOptionalString;
exports.readOptionalInt = readOptionalInt;
exports.readRole = readRole;
exports.readStatus = readStatus;
exports.readCatalogStatus = readCatalogStatus;
exports.readWalletDirection = readWalletDirection;
exports.readWalletAdjustmentType = readWalletAdjustmentType;
exports.readBooleanString = readBooleanString;
exports.readSupplierSyncName = readSupplierSyncName;
exports.parseCatalogCreatePayload = parseCatalogCreatePayload;
exports.parseCatalogUpdatePayload = parseCatalogUpdatePayload;
exports.parseAffiliatePayoutPayload = parseAffiliatePayoutPayload;
exports.parseCatalogAffiliateSettingsUpdatePayload = parseCatalogAffiliateSettingsUpdatePayload;
exports.mapAdminActionError = mapAdminActionError;
const http_1 = require("../../lib/api/http");
function readRequiredString(formData, key) {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}
function readOptionalString(formData, key) {
    return readRequiredString(formData, key) || undefined;
}
function readOptionalInt(formData, key) {
    const value = readRequiredString(formData, key);
    if (!value) {
        return undefined;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
}
function readRole(formData) {
    const value = readRequiredString(formData, 'role');
    return value === 'customer' || value === 'admin' ? value : undefined;
}
function readStatus(formData) {
    const value = readRequiredString(formData, 'status');
    return value === 'active' || value === 'disabled' ? value : undefined;
}
function readCatalogStatus(formData) {
    const value = readRequiredString(formData, 'status');
    return value === 'active' || value === 'inactive' ? value : undefined;
}
function readWalletDirection(formData) {
    const value = readRequiredString(formData, 'direction');
    return value === 'credit' || value === 'debit' ? value : undefined;
}
function readWalletAdjustmentType(formData) {
    const value = readRequiredString(formData, 'type');
    return value === 'wallet_adjustment_admin' || value === 'wallet_reversal_admin' ? value : undefined;
}
function readBooleanString(formData, key) {
    const value = readRequiredString(formData, key);
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    return undefined;
}
function readSupplierSyncName(formData) {
    const value = readRequiredString(formData, 'supplierName');
    if (value === 'cheapsmmglobal' || value === 'instabarato') {
        return value;
    }
    return undefined;
}
function parseCatalogCreatePayload(formData) {
    const base = parseCatalogFields(formData, true);
    if ('error' in base) {
        return base;
    }
    const { value } = base;
    return {
        value: {
            name: value.name,
            publicPrice: value.publicPrice,
            socialNetwork: value.socialNetwork,
            category: value.category,
            type: value.type,
            minQuantity: value.minQuantity,
            maxQuantity: value.maxQuantity,
            supplierServiceId: value.supplierServiceId,
            ...(value.description !== undefined ? { description: value.description } : {}),
            ...(value.status !== undefined ? { status: value.status } : {}),
            ...(value.sortOrder !== undefined ? { sortOrder: value.sortOrder } : {}),
            ...(value.supplierName !== undefined ? { supplierName: value.supplierName } : {}),
            ...(value.metadata !== undefined ? { metadata: value.metadata } : {}),
        },
    };
}
function parseCatalogUpdatePayload(formData) {
    const base = parseCatalogFields(formData, false);
    if ('error' in base) {
        return base;
    }
    return { value: base.value };
}
function parseAffiliatePayoutPayload(formData) {
    const affiliateProfileId = readRequiredString(formData, 'affiliateProfileId');
    const amount = readRequiredString(formData, 'amount');
    const commissionReferences = readRequiredString(formData, 'commissionIds');
    const note = readOptionalString(formData, 'note');
    const commissionIds = splitCommissionIds(commissionReferences);
    if (!affiliateProfileId || !amount) {
        return {
            error: {
                status: 'error',
                message: 'Perfil afiliado e valor sao obrigatorios para registrar o payout.',
            },
        };
    }
    if (commissionIds.length === 0) {
        return {
            error: {
                status: 'error',
                message: 'Informe ao menos um ID de comissao aprovada para rastreio operacional.',
            },
        };
    }
    const composedNote = [`Comissoes consideradas: ${commissionIds.join(', ')}`, ...(note ? [`Observacao: ${note}`] : [])].join('\n');
    return {
        value: {
            affiliateProfileId,
            amount,
            note: composedNote,
        },
        commissionIds,
    };
}
function parseCatalogAffiliateSettingsUpdatePayload(formData) {
    const affiliateEnabled = readBooleanString(formData, 'affiliateEnabled');
    const affiliateCommissionPercent = normalizePercentInput(readOptionalString(formData, 'affiliateCommissionPercent'));
    if (affiliateEnabled === undefined) {
        return {
            error: {
                status: 'error',
                message: 'Informe se o servico deve ficar afiliavel ou nao.',
            },
        };
    }
    if (affiliateEnabled) {
        if (!affiliateCommissionPercent) {
            return {
                error: {
                    status: 'error',
                    message: 'Informe um percentual maior que zero para ativar a afiliacao.',
                },
            };
        }
        return {
            value: {
                affiliateEnabled: true,
                affiliateCommissionPercent,
            },
        };
    }
    return {
        value: {
            affiliateEnabled: false,
        },
    };
}
function mapAdminActionError(error, fallback) {
    if (error instanceof http_1.ApiClientError) {
        return {
            status: 'error',
            message: error.message || fallback,
        };
    }
    return {
        status: 'error',
        message: fallback,
    };
}
function parseCatalogFields(formData, requireMandatory) {
    const name = readOptionalString(formData, 'name');
    const publicPrice = readOptionalString(formData, 'publicPrice');
    const socialNetwork = readOptionalString(formData, 'socialNetwork');
    const category = readOptionalString(formData, 'category');
    const type = readOptionalString(formData, 'type');
    const supplierName = readOptionalString(formData, 'supplierName');
    const description = readOptionalString(formData, 'description');
    const clearDescription = readRequiredString(formData, 'clearDescription') === 'true';
    const clearMetadata = readRequiredString(formData, 'clearMetadata') === 'true';
    const status = readCatalogStatus(formData);
    const sortOrder = readOptionalInt(formData, 'sortOrder');
    const minQuantity = readOptionalInt(formData, 'minQuantity');
    const maxQuantity = readOptionalInt(formData, 'maxQuantity');
    const supplierServiceId = readOptionalInt(formData, 'supplierServiceId');
    const metadataInput = readRequiredString(formData, 'metadata');
    if (requireMandatory &&
        (!name || !publicPrice || !socialNetwork || !category || !type || minQuantity === undefined || maxQuantity === undefined || supplierServiceId === undefined)) {
        return {
            error: {
                status: 'error',
                message: 'Nome, preco, rede, categoria, tipo, faixa e supplier service id sao obrigatorios na criacao.',
            },
        };
    }
    if ((minQuantity !== undefined && minQuantity < 1) || (maxQuantity !== undefined && maxQuantity < 1)) {
        return {
            error: {
                status: 'error',
                message: 'As quantidades minima e maxima devem ser inteiros positivos.',
            },
        };
    }
    if (minQuantity !== undefined && maxQuantity !== undefined && maxQuantity < minQuantity) {
        return {
            error: {
                status: 'error',
                message: 'A quantidade maxima nao pode ser menor que a minima.',
            },
        };
    }
    if (supplierServiceId !== undefined && supplierServiceId < 1) {
        return {
            error: {
                status: 'error',
                message: 'Informe um supplier service id valido.',
            },
        };
    }
    const metadata = parseOptionalJson(metadataInput);
    if (metadata.error) {
        return {
            error: {
                status: 'error',
                message: 'Metadata precisa ser um JSON valido quando preenchido.',
            },
        };
    }
    const value = {
        ...(name ? { name } : {}),
        ...(publicPrice ? { publicPrice } : {}),
        ...(status ? { status } : {}),
        ...(sortOrder !== undefined ? { sortOrder } : {}),
        ...(socialNetwork ? { socialNetwork } : {}),
        ...(category ? { category } : {}),
        ...(type ? { type } : {}),
        ...(minQuantity !== undefined ? { minQuantity } : {}),
        ...(maxQuantity !== undefined ? { maxQuantity } : {}),
        ...(supplierName ? { supplierName } : {}),
        ...(supplierServiceId !== undefined ? { supplierServiceId } : {}),
        ...(clearDescription ? { description: null } : description ? { description } : {}),
        ...(clearMetadata ? { metadata: null } : metadata.value !== undefined ? { metadata: metadata.value } : {}),
    };
    return { value };
}
function parseOptionalJson(value) {
    if (!value) {
        return {};
    }
    try {
        return { value: JSON.parse(value) };
    }
    catch {
        return { error: true };
    }
}
function splitCommissionIds(value) {
    if (!value) {
        return [];
    }
    return Array.from(new Set(value
        .split(/[\n,;]+/)
        .map((item) => item.trim())
        .filter(Boolean)));
}
function normalizePercentInput(value) {
    if (!value) {
        return undefined;
    }
    const normalized = value.replace(',', '.').trim();
    if (!/^\d+(\.\d+)?$/.test(normalized)) {
        return undefined;
    }
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return undefined;
    }
    return normalized;
}
