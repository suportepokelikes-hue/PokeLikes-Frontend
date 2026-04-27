"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAdminUsersParams = parseAdminUsersParams;
exports.parseAdminCatalogParams = parseAdminCatalogParams;
exports.parseAdminCatalogCreationDraft = parseAdminCatalogCreationDraft;
exports.parseAdminCatalogCreateSupplierServiceId = parseAdminCatalogCreateSupplierServiceId;
exports.parseAdminPaymentsParams = parseAdminPaymentsParams;
exports.parseAdminOrdersParams = parseAdminOrdersParams;
exports.parseAdminTransactionsParams = parseAdminTransactionsParams;
exports.parseAdminAffiliatesParams = parseAdminAffiliatesParams;
exports.parseAdminAffiliateCommissionsParams = parseAdminAffiliateCommissionsParams;
exports.parseAdminAffiliatePayoutsParams = parseAdminAffiliatePayoutsParams;
exports.parseAdminAffiliatePayoutCreationDraft = parseAdminAffiliatePayoutCreationDraft;
exports.parseAdminAlertsParams = parseAdminAlertsParams;
exports.parseAdminAuditsParams = parseAdminAuditsParams;
exports.parseSupplierServicesParams = parseSupplierServicesParams;
exports.parseSupplierSyncLogsParams = parseSupplierSyncLogsParams;
exports.buildAdminPath = buildAdminPath;
function parseAdminUsersParams(searchParams) {
    return parseBaseListParams(searchParams);
}
function parseAdminCatalogParams(searchParams) {
    return {
        page: readPositiveInt(searchParams.page),
        pageSize: readPositiveInt(searchParams.pageSize),
        search: readString(searchParams.search),
        status: readString(searchParams.status),
        socialNetwork: readString(searchParams.socialNetwork),
        category: readString(searchParams.category),
        type: readString(searchParams.type),
    };
}
function parseAdminCatalogCreationDraft(searchParams) {
    const supplierServiceId = readPositiveInt(searchParams.createSupplierServiceId);
    const supplierName = readString(searchParams.createSupplierName);
    const name = readString(searchParams.createName);
    const category = readString(searchParams.createCategory);
    const type = readString(searchParams.createType);
    const minQuantity = readPositiveInt(searchParams.createMinQuantity);
    const maxQuantity = readPositiveInt(searchParams.createMaxQuantity);
    if (!supplierServiceId || !supplierName || !name || !category || !type || !minQuantity || !maxQuantity) {
        return undefined;
    }
    return {
        supplierServiceId,
        supplierName,
        name,
        category,
        type,
        minQuantity,
        maxQuantity,
    };
}
function parseAdminCatalogCreateSupplierServiceId(searchParams) {
    return readPositiveInt(searchParams.createSupplierServiceId);
}
function parseAdminPaymentsParams(searchParams) {
    return {
        ...parseBaseListParams(searchParams),
        status: readString(searchParams.status),
        provider: readString(searchParams.provider),
        userId: readString(searchParams.userId),
        dateFrom: readString(searchParams.dateFrom),
        dateTo: readString(searchParams.dateTo),
    };
}
function parseAdminOrdersParams(searchParams) {
    return {
        ...parseBaseListParams(searchParams),
        status: readString(searchParams.status),
        userId: readString(searchParams.userId),
    };
}
function parseAdminTransactionsParams(searchParams) {
    return {
        ...parseBaseListParams(searchParams),
        userId: readString(searchParams.userId),
        type: readString(searchParams.type),
        direction: readString(searchParams.direction),
        dateFrom: readString(searchParams.dateFrom),
        dateTo: readString(searchParams.dateTo),
    };
}
function parseAdminAffiliatesParams(searchParams) {
    const sortOrder = readString(searchParams.sortOrder);
    return {
        page: readPositiveInt(searchParams.page),
        pageSize: readPositiveInt(searchParams.pageSize),
        sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
        status: readString(searchParams.status),
    };
}
function parseAdminAffiliateCommissionsParams(searchParams) {
    const sortOrder = readString(searchParams.sortOrder);
    return {
        page: readPositiveInt(searchParams.page),
        pageSize: readPositiveInt(searchParams.pageSize),
        sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
        status: readString(searchParams.status),
        affiliateProfileId: readString(searchParams.affiliateProfileId),
        commissionIds: readStringList(searchParams.commissionIds).join(',') || undefined,
        userId: readString(searchParams.userId),
        dateFrom: readString(searchParams.dateFrom),
        dateTo: readString(searchParams.dateTo),
    };
}
function parseAdminAffiliatePayoutsParams(searchParams) {
    const sortOrder = readString(searchParams.sortOrder);
    return {
        page: readPositiveInt(searchParams.page),
        pageSize: readPositiveInt(searchParams.pageSize),
        sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
        status: readString(searchParams.status),
        affiliateProfileId: readString(searchParams.affiliateProfileId),
        userId: readString(searchParams.userId),
        dateFrom: readString(searchParams.dateFrom),
        dateTo: readString(searchParams.dateTo),
    };
}
function parseAdminAffiliatePayoutCreationDraft(searchParams) {
    return {
        affiliateProfileId: readString(searchParams.affiliateProfileId),
        commissionIds: readStringList(searchParams.commissionIds),
    };
}
function parseAdminAlertsParams(searchParams) {
    return {
        ...parseBaseListParams(searchParams),
        status: readString(searchParams.status),
        severity: readString(searchParams.severity),
        type: readString(searchParams.type),
    };
}
function parseAdminAuditsParams(searchParams) {
    return {
        ...parseBaseListParams(searchParams),
        adminId: readString(searchParams.adminId),
        action: readString(searchParams.action),
        entityType: readString(searchParams.entityType),
    };
}
function parseSupplierServicesParams(searchParams) {
    const isActiveAtSupplier = readString(searchParams.isActiveAtSupplier);
    return {
        page: readPositiveInt(searchParams.servicesPage ?? searchParams.page),
        pageSize: readPositiveInt(searchParams.servicesPageSize ?? searchParams.pageSize),
        search: readString(searchParams.servicesSearch ?? searchParams.search),
        supplierName: readString(searchParams.supplierName ?? searchParams.servicesSupplierName),
        category: readString(searchParams.servicesCategory ?? searchParams.category),
        type: readString(searchParams.servicesType ?? searchParams.type),
        isActiveAtSupplier: isActiveAtSupplier === 'true' || isActiveAtSupplier === 'false' ? isActiveAtSupplier : undefined,
    };
}
function parseSupplierSyncLogsParams(searchParams) {
    return {
        page: readPositiveInt(searchParams.logsPage),
        pageSize: readPositiveInt(searchParams.logsPageSize),
        supplierName: readString(searchParams.logSupplierName),
        syncType: readString(searchParams.syncType),
        status: readString(searchParams.logStatus),
        targetType: readString(searchParams.targetType),
    };
}
function buildAdminPath(pathname, params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '') {
            continue;
        }
        searchParams.set(key, String(value));
    }
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
}
function parseBaseListParams(searchParams) {
    const sortOrder = readString(searchParams.sortOrder);
    return {
        page: readPositiveInt(searchParams.page),
        pageSize: readPositiveInt(searchParams.pageSize),
        search: readString(searchParams.search),
        sortBy: readString(searchParams.sortBy),
        sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
    };
}
function readString(value) {
    const single = Array.isArray(value) ? value[0] : value;
    if (typeof single !== 'string') {
        return undefined;
    }
    const trimmed = single.trim();
    return trimmed ? trimmed : undefined;
}
function readStringList(value) {
    const values = Array.isArray(value) ? value : value ? [value] : [];
    return Array.from(new Set(values
        .flatMap((item) => item.split(/[\n,;]+/))
        .map((item) => item.trim())
        .filter(Boolean)));
}
function readPositiveInt(value) {
    const stringValue = readString(value);
    if (!stringValue) {
        return undefined;
    }
    const parsed = Number.parseInt(stringValue, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}
