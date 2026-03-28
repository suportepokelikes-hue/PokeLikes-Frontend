import type {
  AdminAlertsListParams,
  AdminAuditsListParams,
  AdminCatalogServiceUpdateRequest,
  AdminCatalogServiceUpsertRequest,
  AdminCreateUserRequest,
  AdminWalletAdjustmentRequest,
  AdminWalletAdjustmentResponse,
  AdminCatalogListParams,
  AdminOrdersListParams,
  AdminPaymentsListParams,
  AdminTransactionsListParams,
  AdminUpdateUserRequest,
  AdminUsersListParams,
  AdminPaymentDetailResource,
  AdminPaymentsSummaryResponse,
  AdminWalletTransactionResource,
  AlertResource,
  AuditResource,
  AdminOrderResource,
  AdminPaymentResource,
  CatalogServiceResource,
  DashboardSummaryResponse,
  PaginatedResponse,
  PaymentReconciliationResponse,
  SinglePaymentReconciliationResponse,
  SupplierProviderStatusesResponse,
  SupplierServiceResource,
  SupplierSyncLogResource,
  SyncOrdersRequest,
  SyncOrdersResponse,
  SupplierServicesListParams,
  SupplierSyncLogsListParams,
  UserSummary,
} from '@/lib/api/contracts';
import { apiRequest } from '@/lib/api/http';

export function getAdminDashboardSummary(accessToken: string) {
  return apiRequest<DashboardSummaryResponse>({
    path: '/admin/dashboard/summary',
    accessToken,
  });
}

export function listAdminUsers(accessToken: string, params: AdminUsersListParams = {}) {
  return apiRequest<PaginatedResponse<UserSummary>>({
    path: buildAdminPath('/admin/users', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
    accessToken,
  });
}

export function createAdminUser(accessToken: string, body: AdminCreateUserRequest) {
  return apiRequest<UserSummary>({
    path: '/admin/users',
    method: 'POST',
    accessToken,
    body,
  });
}

export function getAdminUserDetail(accessToken: string, userId: string) {
  return apiRequest<UserSummary>({
    path: `/admin/users/${userId}`,
    accessToken,
  });
}

export function updateAdminUser(accessToken: string, userId: string, body: AdminUpdateUserRequest) {
  return apiRequest<UserSummary>({
    path: `/admin/users/${userId}`,
    method: 'PATCH',
    accessToken,
    body,
  });
}

export function listAdminPayments(accessToken: string, params: AdminPaymentsListParams = {}) {
  return apiRequest<PaginatedResponse<AdminPaymentResource>>({
    path: buildAdminPath('/admin/payments', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
    accessToken,
  });
}

export function getAdminPaymentsSummary(accessToken: string, params: Omit<AdminPaymentsListParams, 'page' | 'pageSize' | 'sortBy' | 'sortOrder'> = {}) {
  return apiRequest<AdminPaymentsSummaryResponse>({
    path: buildAdminPath('/admin/payments/summary', params),
    accessToken,
  });
}

export function getAdminPaymentDetail(accessToken: string, paymentId: string) {
  return apiRequest<AdminPaymentDetailResource>({
    path: `/admin/payments/${paymentId}`,
    accessToken,
  });
}

export function listAdminOrders(accessToken: string, params: AdminOrdersListParams = {}) {
  return apiRequest<PaginatedResponse<AdminOrderResource>>({
    path: buildAdminPath('/admin/orders', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
    accessToken,
  });
}

export function getAdminOrderDetail(accessToken: string, orderId: string) {
  return apiRequest<AdminOrderResource>({
    path: `/admin/orders/${orderId}`,
    accessToken,
  });
}

export function reconcileAdminPayments(accessToken: string, body?: { limit?: number; provider?: string }) {
  return apiRequest<PaymentReconciliationResponse>({
    path: '/admin/payments/reconcile',
    method: 'POST',
    accessToken,
    ...(body ? { body } : {}),
  });
}

export function reconcileAdminPayment(accessToken: string, paymentId: string) {
  return apiRequest<SinglePaymentReconciliationResponse>({
    path: `/admin/payments/${paymentId}/reconcile`,
    method: 'POST',
    accessToken,
  });
}

export function syncAdminOrders(accessToken: string, body?: SyncOrdersRequest) {
  return apiRequest<SyncOrdersResponse>({
    path: '/admin/orders/sync',
    method: 'POST',
    accessToken,
    ...(body ? { body } : {}),
  });
}

export function syncAdminOrder(accessToken: string, orderId: string) {
  return apiRequest<SyncOrdersResponse>({
    path: `/admin/orders/${orderId}/sync`,
    method: 'POST',
    accessToken,
  });
}

export function listAdminCatalogServices(accessToken: string, params: AdminCatalogListParams = {}) {
  return apiRequest<PaginatedResponse<CatalogServiceResource>>({
    path: buildAdminPath('/admin/catalog/services', { page: 1, pageSize: 10, ...params }),
    accessToken,
  });
}

export function createAdminCatalogService(accessToken: string, body: AdminCatalogServiceUpsertRequest) {
  return apiRequest<CatalogServiceResource>({
    path: '/admin/catalog/services',
    method: 'POST',
    accessToken,
    body,
  });
}

export function updateAdminCatalogService(accessToken: string, serviceId: string, body: AdminCatalogServiceUpdateRequest) {
  return apiRequest<CatalogServiceResource>({
    path: `/admin/catalog/services/${serviceId}`,
    method: 'PATCH',
    accessToken,
    body,
  });
}

export function listAdminTransactions(accessToken: string, params: AdminTransactionsListParams = {}) {
  return apiRequest<PaginatedResponse<AdminWalletTransactionResource>>({
    path: buildAdminPath('/admin/transactions', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
    accessToken,
  });
}

export function createAdminWalletAdjustment(accessToken: string, userId: string, body: AdminWalletAdjustmentRequest) {
  return apiRequest<AdminWalletAdjustmentResponse>({
    path: `/admin/wallets/${userId}/adjustments`,
    method: 'POST',
    accessToken,
    body,
  });
}

export function listSupplierProviders(accessToken: string) {
  return apiRequest<SupplierProviderStatusesResponse>({
    path: '/admin/supplier/providers',
    accessToken,
  });
}

export function listSupplierServices(accessToken: string, params: SupplierServicesListParams = {}) {
  return apiRequest<PaginatedResponse<SupplierServiceResource>>({
    path: buildAdminPath('/admin/supplier/services', { page: 1, pageSize: 10, ...params }),
    accessToken,
  });
}

export function listSupplierSyncLogs(accessToken: string, params: SupplierSyncLogsListParams = {}) {
  return apiRequest<PaginatedResponse<SupplierSyncLogResource>>({
    path: buildAdminPath('/admin/supplier/sync-logs', { page: 1, pageSize: 10, ...params }),
    accessToken,
  });
}

export function listAdminAlerts(accessToken: string, params: AdminAlertsListParams = {}) {
  return apiRequest<PaginatedResponse<AlertResource>>({
    path: buildAdminPath('/admin/alerts', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
    accessToken,
  });
}

export function listAdminAudits(accessToken: string, params: AdminAuditsListParams = {}) {
  return apiRequest<PaginatedResponse<AuditResource>>({
    path: buildAdminPath('/admin/audits', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
    accessToken,
  });
}

export function resolveAdminAlert(accessToken: string, alertId: string) {
  return apiRequest<AlertResource>({
    path: `/admin/alerts/${alertId}/resolve`,
    method: 'PATCH',
    accessToken,
  });
}

export function refreshSupplierProviders(accessToken: string) {
  return apiRequest<SupplierProviderStatusesResponse>({
    path: '/admin/supplier/providers/refresh',
    method: 'POST',
    accessToken,
  });
}

export function syncSupplierServices(accessToken: string, supplierName?: string) {
  return apiRequest({
    path: '/admin/supplier/services/sync',
    method: 'POST',
    accessToken,
    ...(supplierName ? { body: { supplierName } } : {}),
  });
}

function buildAdminPath(path: string, params: Record<string, string | number | boolean | null | undefined>) {
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
