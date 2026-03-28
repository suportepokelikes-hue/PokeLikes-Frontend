import type {
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
  UserSummary,
} from '@/lib/api/contracts';
import { apiRequest } from '@/lib/api/http';

export function getAdminDashboardSummary(accessToken: string) {
  return apiRequest<DashboardSummaryResponse>({
    path: '/admin/dashboard/summary',
    accessToken,
  });
}

export function listAdminUsers(accessToken: string) {
  return apiRequest<PaginatedResponse<UserSummary>>({
    path: '/admin/users?page=1&pageSize=10&sortOrder=desc',
    accessToken,
  });
}

export function listAdminPayments(accessToken: string) {
  return apiRequest<PaginatedResponse<AdminPaymentResource>>({
    path: '/admin/payments?page=1&pageSize=10&sortOrder=desc',
    accessToken,
  });
}

export function getAdminPaymentsSummary(accessToken: string) {
  return apiRequest<AdminPaymentsSummaryResponse>({
    path: '/admin/payments/summary',
    accessToken,
  });
}

export function listAdminOrders(accessToken: string) {
  return apiRequest<PaginatedResponse<AdminOrderResource>>({
    path: '/admin/orders?page=1&pageSize=10&sortOrder=desc',
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

export function listAdminCatalogServices(accessToken: string) {
  return apiRequest<PaginatedResponse<CatalogServiceResource>>({
    path: '/admin/catalog/services?page=1&pageSize=10&sortOrder=desc',
    accessToken,
  });
}

export function listAdminTransactions(accessToken: string) {
  return apiRequest<PaginatedResponse<AdminWalletTransactionResource>>({
    path: '/admin/transactions?page=1&pageSize=10&sortOrder=desc',
    accessToken,
  });
}

export function listSupplierProviders(accessToken: string) {
  return apiRequest<SupplierProviderStatusesResponse>({
    path: '/admin/supplier/providers',
    accessToken,
  });
}

export function listSupplierServices(accessToken: string) {
  return apiRequest<PaginatedResponse<SupplierServiceResource>>({
    path: '/admin/supplier/services?page=1&pageSize=10',
    accessToken,
  });
}

export function listSupplierSyncLogs(accessToken: string) {
  return apiRequest<PaginatedResponse<SupplierSyncLogResource>>({
    path: '/admin/supplier/sync-logs?page=1&pageSize=10',
    accessToken,
  });
}

export function listAdminAlerts(accessToken: string) {
  return apiRequest<PaginatedResponse<AlertResource>>({
    path: '/admin/alerts?page=1&pageSize=10&sortOrder=desc',
    accessToken,
  });
}

export function listAdminAudits(accessToken: string) {
  return apiRequest<PaginatedResponse<AuditResource>>({
    path: '/admin/audits?page=1&pageSize=10&sortOrder=desc',
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
