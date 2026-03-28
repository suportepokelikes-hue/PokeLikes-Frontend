"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboardSummary = getAdminDashboardSummary;
exports.listAdminUsers = listAdminUsers;
exports.createAdminUser = createAdminUser;
exports.getAdminUserDetail = getAdminUserDetail;
exports.updateAdminUser = updateAdminUser;
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
exports.listAdminTransactions = listAdminTransactions;
exports.createAdminWalletAdjustment = createAdminWalletAdjustment;
exports.listSupplierProviders = listSupplierProviders;
exports.listSupplierServices = listSupplierServices;
exports.listSupplierSyncLogs = listSupplierSyncLogs;
exports.listAdminAlerts = listAdminAlerts;
exports.listAdminAudits = listAdminAudits;
exports.resolveAdminAlert = resolveAdminAlert;
exports.refreshSupplierProviders = refreshSupplierProviders;
exports.syncSupplierServices = syncSupplierServices;
const http_1 = require("@/lib/api/http");
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
    return (0, http_1.apiRequest)({
        path: '/admin/supplier/services/sync',
        method: 'POST',
        accessToken,
        ...(supplierName ? { body: { supplierName } } : {}),
    });
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
