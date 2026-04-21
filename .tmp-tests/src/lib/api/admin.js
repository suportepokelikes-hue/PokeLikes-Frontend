"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboardSummary = getAdminDashboardSummary;
exports.listAdminUsers = listAdminUsers;
exports.createAdminUser = createAdminUser;
exports.getAdminUserDetail = getAdminUserDetail;
exports.updateAdminUser = updateAdminUser;
exports.listAdminAffiliates = listAdminAffiliates;
exports.approveAdminAffiliate = approveAdminAffiliate;
exports.suspendAdminAffiliate = suspendAdminAffiliate;
exports.listAdminPayments = listAdminPayments;
exports.getAdminPaymentsSummary = getAdminPaymentsSummary;
exports.getAdminPaymentDetail = getAdminPaymentDetail;
exports.listAdminOrders = listAdminOrders;
exports.getAdminOrderDetail = getAdminOrderDetail;
exports.reconcileAdminPayments = reconcileAdminPayments;
exports.reconcileAdminPayment = reconcileAdminPayment;
exports.syncAdminOrders = syncAdminOrders;
exports.syncAdminOrder = syncAdminOrder;
exports.listAdminCatalogServices = listAdminCatalogServices;
exports.createAdminCatalogService = createAdminCatalogService;
exports.updateAdminCatalogService = updateAdminCatalogService;
exports.listAdminCatalogAffiliateSettings = listAdminCatalogAffiliateSettings;
exports.updateAdminCatalogAffiliateSettings = updateAdminCatalogAffiliateSettings;
exports.listAdminTransactions = listAdminTransactions;
exports.createAdminWalletAdjustment = createAdminWalletAdjustment;
exports.listAdminAffiliateCommissions = listAdminAffiliateCommissions;
exports.listAdminAffiliatePayouts = listAdminAffiliatePayouts;
exports.createAdminAffiliatePayout = createAdminAffiliatePayout;
exports.updateAdminAffiliatePayoutStatus = updateAdminAffiliatePayoutStatus;
exports.refreshAdminAffiliatePayout = refreshAdminAffiliatePayout;
exports.listSupplierProviders = listSupplierProviders;
exports.listSupplierServices = listSupplierServices;
exports.listSupplierSyncLogs = listSupplierSyncLogs;
exports.listAdminAlerts = listAdminAlerts;
exports.listAdminAudits = listAdminAudits;
exports.resolveAdminAlert = resolveAdminAlert;
exports.refreshSupplierProviders = refreshSupplierProviders;
exports.syncSupplierServices = syncSupplierServices;
exports.normalizeSupplierSyncName = normalizeSupplierSyncName;
const affiliate_normalizers_1 = require("./affiliate-normalizers");
const http_1 = require("./http");
function getAdminDashboardSummary(accessToken) {
    return (0, http_1.apiRequest)({
        path: '/admin/dashboard/summary',
        accessToken,
    });
}
function listAdminUsers(accessToken, params = {}) {
    return (0, http_1.apiRequest)({
        path: buildAdminPath('/admin/users', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
        accessToken,
    });
}
function createAdminUser(accessToken, body) {
    return (0, http_1.apiRequest)({
        path: '/admin/users',
        method: 'POST',
        accessToken,
        body,
    });
}
function getAdminUserDetail(accessToken, userId) {
    return (0, http_1.apiRequest)({
        path: `/admin/users/${userId}`,
        accessToken,
    });
}
function updateAdminUser(accessToken, userId, body) {
    return (0, http_1.apiRequest)({
        path: `/admin/users/${userId}`,
        method: 'PATCH',
        accessToken,
        body,
    });
}
function listAdminAffiliates(accessToken, params = {}) {
    return (0, http_1.apiRequest)({
        path: buildAdminPath('/admin/affiliates', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
        accessToken,
    }).then(affiliate_normalizers_1.normalizeAffiliateProfilesResponse);
}
function approveAdminAffiliate(accessToken, affiliateProfileId) {
    return (0, http_1.apiRequest)({
        path: `/admin/affiliates/${affiliateProfileId}/approve`,
        method: 'POST',
        accessToken,
    }).then((response) => (0, affiliate_normalizers_1.normalizeAffiliateProfile)(response));
}
function suspendAdminAffiliate(accessToken, affiliateProfileId) {
    return (0, http_1.apiRequest)({
        path: `/admin/affiliates/${affiliateProfileId}/suspend`,
        method: 'POST',
        accessToken,
    }).then((response) => (0, affiliate_normalizers_1.normalizeAffiliateProfile)(response));
}
function listAdminPayments(accessToken, params = {}) {
    return (0, http_1.apiRequest)({
        path: buildAdminPath('/admin/payments', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
        accessToken,
    });
}
function getAdminPaymentsSummary(accessToken, params = {}) {
    return (0, http_1.apiRequest)({
        path: buildAdminPath('/admin/payments/summary', params),
        accessToken,
    });
}
function getAdminPaymentDetail(accessToken, paymentId) {
    return (0, http_1.apiRequest)({
        path: `/admin/payments/${paymentId}`,
        accessToken,
    });
}
function listAdminOrders(accessToken, params = {}) {
    return (0, http_1.apiRequest)({
        path: buildAdminPath('/admin/orders', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
        accessToken,
    });
}
function getAdminOrderDetail(accessToken, orderId) {
    return (0, http_1.apiRequest)({
        path: `/admin/orders/${orderId}`,
        accessToken,
    });
}
function reconcileAdminPayments(accessToken, body) {
    return (0, http_1.apiRequest)({
        path: '/admin/payments/reconcile',
        method: 'POST',
        accessToken,
        ...(body ? { body } : {}),
    });
}
function reconcileAdminPayment(accessToken, paymentId) {
    return (0, http_1.apiRequest)({
        path: `/admin/payments/${paymentId}/reconcile`,
        method: 'POST',
        accessToken,
    });
}
function syncAdminOrders(accessToken, body) {
    return (0, http_1.apiRequest)({
        path: '/admin/orders/sync',
        method: 'POST',
        accessToken,
        ...(body ? { body } : {}),
    });
}
function syncAdminOrder(accessToken, orderId) {
    return (0, http_1.apiRequest)({
        path: `/admin/orders/${orderId}/sync`,
        method: 'POST',
        accessToken,
    });
}
function listAdminCatalogServices(accessToken, params = {}) {
    return (0, http_1.apiRequest)({
        path: buildAdminPath('/admin/catalog/services', { page: 1, pageSize: 10, ...params }),
        accessToken,
    });
}
function createAdminCatalogService(accessToken, body) {
    return (0, http_1.apiRequest)({
        path: '/admin/catalog/services',
        method: 'POST',
        accessToken,
        body,
    });
}
function updateAdminCatalogService(accessToken, serviceId, body) {
    return (0, http_1.apiRequest)({
        path: `/admin/catalog/services/${serviceId}`,
        method: 'PATCH',
        accessToken,
        body,
    });
}
function listAdminCatalogAffiliateSettings(accessToken, params = {}) {
    return (0, http_1.apiRequest)({
        path: buildAdminPath('/admin/catalog/affiliate-settings', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
        accessToken,
    }).then(normalizeAdminCatalogAffiliateSettingsResponse);
}
function updateAdminCatalogAffiliateSettings(accessToken, catalogServiceId, body) {
    return (0, http_1.apiRequest)({
        path: `/admin/catalog/${catalogServiceId}/affiliate-settings`,
        method: 'PATCH',
        accessToken,
        body,
    }).then(normalizeAdminCatalogAffiliateSettings);
}
function listAdminTransactions(accessToken, params = {}) {
    return (0, http_1.apiRequest)({
        path: buildAdminPath('/admin/transactions', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
        accessToken,
    });
}
function createAdminWalletAdjustment(accessToken, userId, body) {
    return (0, http_1.apiRequest)({
        path: `/admin/wallets/${userId}/adjustments`,
        method: 'POST',
        accessToken,
        body,
    });
}
function listAdminAffiliateCommissions(accessToken, params = {}) {
    return (0, http_1.apiRequest)({
        path: buildAdminPath('/admin/affiliate-commissions', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
        accessToken,
    }).then(affiliate_normalizers_1.normalizeAffiliateCommissionsResponse);
}
function listAdminAffiliatePayouts(accessToken, params = {}) {
    return (0, http_1.apiRequest)({
        path: buildAdminPath('/admin/affiliate-payouts', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
        accessToken,
    }).then(affiliate_normalizers_1.normalizeAffiliatePayoutsResponse);
}
function createAdminAffiliatePayout(accessToken, body) {
    return (0, http_1.apiRequest)({
        path: '/admin/affiliate-payouts',
        method: 'POST',
        accessToken,
        body,
    }).then((response) => (0, affiliate_normalizers_1.normalizeAffiliatePayout)(response));
}
function updateAdminAffiliatePayoutStatus(accessToken, payoutId, body) {
    return (0, http_1.apiRequest)({
        path: `/admin/affiliate-payouts/${payoutId}/status`,
        method: 'POST',
        accessToken,
        body,
    }).then((response) => (0, affiliate_normalizers_1.normalizeAffiliatePayout)(response));
}
function refreshAdminAffiliatePayout(accessToken, payoutId) {
    return (0, http_1.apiRequest)({
        path: `/admin/affiliate-payouts/${payoutId}/refresh`,
        method: 'POST',
        accessToken,
    }).then((response) => (0, affiliate_normalizers_1.normalizeAffiliatePayout)(response));
}
function listSupplierProviders(accessToken) {
    return (0, http_1.apiRequest)({
        path: '/admin/supplier/providers',
        accessToken,
    });
}
function listSupplierServices(accessToken, params = {}) {
    return (0, http_1.apiRequest)({
        path: buildAdminPath('/admin/supplier/services', { page: 1, pageSize: 10, ...params }),
        accessToken,
    });
}
function listSupplierSyncLogs(accessToken, params = {}) {
    return (0, http_1.apiRequest)({
        path: buildAdminPath('/admin/supplier/sync-logs', { page: 1, pageSize: 10, ...params }),
        accessToken,
    });
}
function listAdminAlerts(accessToken, params = {}) {
    return (0, http_1.apiRequest)({
        path: buildAdminPath('/admin/alerts', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
        accessToken,
    });
}
function listAdminAudits(accessToken, params = {}) {
    return (0, http_1.apiRequest)({
        path: buildAdminPath('/admin/audits', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
        accessToken,
    });
}
function resolveAdminAlert(accessToken, alertId) {
    return (0, http_1.apiRequest)({
        path: `/admin/alerts/${alertId}/resolve`,
        method: 'PATCH',
        accessToken,
    });
}
function refreshSupplierProviders(accessToken) {
    return (0, http_1.apiRequest)({
        path: '/admin/supplier/providers/refresh',
        method: 'POST',
        accessToken,
    });
}
function syncSupplierServices(accessToken, supplierName) {
    const normalizedSupplierName = normalizeSupplierSyncName(supplierName);
    return (0, http_1.apiRequest)({
        path: '/admin/supplier/services/sync',
        method: 'POST',
        accessToken,
        body: normalizedSupplierName ? { supplierName: normalizedSupplierName } : {},
    });
}
function normalizeSupplierSyncName(value) {
    if (!value) {
        return undefined;
    }
    const compact = value.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (!compact) {
        return undefined;
    }
    if (compact === 'cheapsmmglobal') {
        return 'cheapsmmglobal';
    }
    if (compact === 'instabarato') {
        return 'instabarato';
    }
    return undefined;
}
function buildAdminPath(path, params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '') {
            continue;
        }
        searchParams.set(key, String(value));
    }
    const query = searchParams.toString();
    return query ? `${path}?${query}` : path;
}
function normalizeAdminCatalogAffiliateSettingsResponse(input) {
    const source = isRecord(input) ? input : {};
    const itemsSource = Array.isArray(source.items) ? source.items : [];
    return {
        items: itemsSource.map(normalizeAdminCatalogAffiliateSettings).filter((item) => Boolean(item)),
        page: readNumber(source.page) ?? 1,
        pageSize: readNumber(source.pageSize) ?? itemsSource.length,
        totalItems: readNumber(source.totalItems) ?? itemsSource.length,
        totalPages: readNumber(source.totalPages) ?? 1,
    };
}
function normalizeAdminCatalogAffiliateSettings(input) {
    const source = isRecord(input) ? input : {};
    const serviceId = readString(source.id) ?? readString(source.catalogServiceId) ?? '';
    const affiliateEnabled = readBoolean(source.isAffiliateEnabled) ?? readBoolean(source.affiliateEnabled) ?? false;
    const affiliateCommissionPercent = readNullableString(source.affiliateCommissionPercent);
    const serviceName = readString(source.name);
    return {
        catalogServiceId: serviceId,
        affiliateEnabled,
        affiliateCommissionPercent,
        catalogService: serviceId && serviceName ? { id: serviceId, name: serviceName } : null,
    };
}
function isRecord(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
function readString(value) {
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
function readNullableString(value) {
    if (value === null) {
        return null;
    }
    return readString(value) ?? null;
}
function readNumber(value) {
    return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}
function readBoolean(value) {
    return typeof value === 'boolean' ? value : undefined;
}
