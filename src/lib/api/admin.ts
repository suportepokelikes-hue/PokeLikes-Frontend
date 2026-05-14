import type {
  AdminAffiliateCommissionsListParams,
  AdminAffiliatePayoutsListParams,
  AdminAffiliateProfileListParams,
  AdminAlertsListParams,
  AdminAuditsListParams,
  AdminCatalogAffiliateSettingsListParams,
  AdminCatalogAffiliateSettingsResource,
  AdminCatalogAffiliateSettingsUpdateRequest,
  AdminCatalogServiceUpdateRequest,
  AdminCatalogServiceUpsertRequest,
  AdminCreateAffiliatePayoutRequest,
  AdminCreateTestOrderRequest,
  AdminCreateUserRequest,
  AdminWalletAdjustmentRequest,
  AdminWalletAdjustmentResponse,
  AdminCatalogListParams,
  AdminOrdersListParams,
  AdminPaymentsListParams,
  AdminSupportTicketResource,
  AdminSupportTicketsListParams,
  AdminTransactionsListParams,
  AdminUpdateUserRequest,
  AdminUpdateAffiliatePayoutStatusRequest,
  AdminUsersListParams,
  AdminPaymentDetailResource,
  AdminPaymentsSummaryResponse,
  AdminWalletTransactionResource,
  AffiliateCommissionResource,
  AffiliatePayoutResource,
  AffiliateProfileResource,
  AlertResource,
  AuditResource,
  AdminOrderResource,
  AdminPaymentResource,
  CatalogServiceResource,
  CreateSupportTicketMessageRequest,
  DashboardSummaryResponse,
  PaginatedResponse,
  PaymentReconciliationResponse,
  SinglePaymentReconciliationResponse,
  SupplierProviderStatusesResponse,
  SupplierServiceResource,
  SupplierSyncName,
  SupplierSyncLogResource,
  SyncOrdersRequest,
  SyncOrdersResponse,
  SupplierServicesListParams,
  SupplierSyncLogsListParams,
  UserSummary,
} from './contracts';
import {
  normalizeAffiliateCommissionsResponse,
  normalizeAffiliatePayout,
  normalizeAffiliatePayoutsResponse,
  normalizeAffiliateProfile,
  normalizeAffiliateProfilesResponse,
} from './affiliate-normalizers';
import { apiRequest } from './http';

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

export function listAdminAffiliates(accessToken: string, params: AdminAffiliateProfileListParams = {}) {
  return apiRequest<unknown>({
    path: buildAdminPath('/admin/affiliates', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
    accessToken,
  }).then(normalizeAffiliateProfilesResponse);
}

export function approveAdminAffiliate(accessToken: string, affiliateProfileId: string) {
  return apiRequest<unknown>({
    path: `/admin/affiliates/${affiliateProfileId}/approve`,
    method: 'POST',
    accessToken,
  }).then((response) => normalizeAffiliateProfile(response) as AffiliateProfileResource);
}

export function suspendAdminAffiliate(accessToken: string, affiliateProfileId: string) {
  return apiRequest<unknown>({
    path: `/admin/affiliates/${affiliateProfileId}/suspend`,
    method: 'POST',
    accessToken,
  }).then((response) => normalizeAffiliateProfile(response) as AffiliateProfileResource);
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

export function createAdminTestOrder(accessToken: string, body: AdminCreateTestOrderRequest) {
  return apiRequest<AdminOrderResource>({
    path: '/admin/test-orders',
    method: 'POST',
    accessToken,
    body,
  });
}

export function listAdminSupportTickets(accessToken: string, params: AdminSupportTicketsListParams = {}) {
  return apiRequest<PaginatedResponse<AdminSupportTicketResource>>({
    path: buildAdminPath('/admin/support/tickets', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
    accessToken,
  });
}

export function getAdminSupportTicketDetail(accessToken: string, ticketId: string) {
  return apiRequest<AdminSupportTicketResource>({
    path: `/admin/support/tickets/${ticketId}`,
    accessToken,
  });
}

export function createAdminSupportTicketMessage(
  accessToken: string,
  ticketId: string,
  body: CreateSupportTicketMessageRequest,
) {
  return apiRequest<AdminSupportTicketResource>({
    path: `/admin/support/tickets/${ticketId}/messages`,
    method: 'POST',
    accessToken,
    body,
  });
}

export function closeAdminSupportTicket(accessToken: string, ticketId: string) {
  return apiRequest<AdminSupportTicketResource>({
    path: `/admin/support/tickets/${ticketId}/close`,
    method: 'POST',
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

export function listAdminCatalogAffiliateSettings(
  accessToken: string,
  params: AdminCatalogAffiliateSettingsListParams = {},
) {
  return apiRequest<unknown>({
    path: buildAdminPath('/admin/catalog/affiliate-settings', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
    accessToken,
  }).then(normalizeAdminCatalogAffiliateSettingsResponse);
}

export function updateAdminCatalogAffiliateSettings(
  accessToken: string,
  catalogServiceId: string,
  body: AdminCatalogAffiliateSettingsUpdateRequest,
) {
  return apiRequest<unknown>({
    path: `/admin/catalog/${catalogServiceId}/affiliate-settings`,
    method: 'PATCH',
    accessToken,
    body,
  }).then(normalizeAdminCatalogAffiliateSettings);
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

export function listAdminAffiliateCommissions(accessToken: string, params: AdminAffiliateCommissionsListParams = {}) {
  return apiRequest<unknown>({
    path: buildAdminPath('/admin/affiliate-commissions', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
    accessToken,
  }).then(normalizeAffiliateCommissionsResponse);
}

export function listAdminAffiliatePayouts(accessToken: string, params: AdminAffiliatePayoutsListParams = {}) {
  return apiRequest<unknown>({
    path: buildAdminPath('/admin/affiliate-payouts', { page: 1, pageSize: 10, sortOrder: 'desc', ...params }),
    accessToken,
  }).then(normalizeAffiliatePayoutsResponse);
}

export function createAdminAffiliatePayout(accessToken: string, body: AdminCreateAffiliatePayoutRequest) {
  return apiRequest<unknown>({
    path: '/admin/affiliate-payouts',
    method: 'POST',
    accessToken,
    body,
  }).then((response) => normalizeAffiliatePayout(response) as AffiliatePayoutResource);
}

export function updateAdminAffiliatePayoutStatus(
  accessToken: string,
  payoutId: string,
  body: AdminUpdateAffiliatePayoutStatusRequest,
) {
  return apiRequest<unknown>({
    path: `/admin/affiliate-payouts/${payoutId}/status`,
    method: 'POST',
    accessToken,
    body,
  }).then((response) => normalizeAffiliatePayout(response) as AffiliatePayoutResource);
}

export function refreshAdminAffiliatePayout(accessToken: string, payoutId: string) {
  return apiRequest<unknown>({
    path: `/admin/affiliate-payouts/${payoutId}/refresh`,
    method: 'POST',
    accessToken,
  }).then((response) => normalizeAffiliatePayout(response) as AffiliatePayoutResource);
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
  const normalizedSupplierName = normalizeSupplierSyncName(supplierName);

  return apiRequest({
    path: '/admin/supplier/services/sync',
    method: 'POST',
    accessToken,
    body: normalizedSupplierName ? { supplierName: normalizedSupplierName } : {},
  });
}

export function normalizeSupplierSyncName(value?: string | null): SupplierSyncName | undefined {
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

function normalizeAdminCatalogAffiliateSettingsResponse(input: unknown): PaginatedResponse<AdminCatalogAffiliateSettingsResource> {
  const source = isRecord(input) ? input : {};
  const itemsSource = Array.isArray(source.items) ? source.items : [];

  return {
    items: itemsSource.map(normalizeAdminCatalogAffiliateSettings).filter((item): item is AdminCatalogAffiliateSettingsResource => Boolean(item)),
    page: readNumber(source.page) ?? 1,
    pageSize: readNumber(source.pageSize) ?? itemsSource.length,
    totalItems: readNumber(source.totalItems) ?? itemsSource.length,
    totalPages: readNumber(source.totalPages) ?? 1,
  };
}

function normalizeAdminCatalogAffiliateSettings(input: unknown): AdminCatalogAffiliateSettingsResource {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function readNullableString(value: unknown) {
  if (value === null) {
    return null;
  }

  return readString(value) ?? null;
}

function readNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : undefined;
}
