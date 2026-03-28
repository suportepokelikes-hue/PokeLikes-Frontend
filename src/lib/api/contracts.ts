export type UserRole = 'customer' | 'admin';

export type UserSummary = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  status: string;
};

export type UserReference = {
  id: string;
  name: string;
  email: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type AuthSessionResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserSummary;
};

export type Money = {
  amount: string;
  currency: string;
};

export type WalletSummary = {
  id: string;
  availableBalance: Money;
};

export type WalletTransactionResource = {
  id: string;
  type: string;
  direction: 'credit' | 'debit';
  amount: Money;
  createdAt: string;
};

export type CreatePixPaymentRequest = {
  amount: string | number;
};

export type CatalogAvailabilityResource = {
  providerStatus: 'unknown' | 'healthy' | 'degraded_low_balance' | 'unavailable';
  isPurchasable: boolean;
  reason:
    | 'provider_status_unknown'
    | 'provider_healthy'
    | 'provider_low_balance'
    | 'provider_unavailable';
};

export type ProviderStatusSummaryResource = CatalogAvailabilityResource & {
  lastCheckedAt: string | null;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
};

export type CatalogSupplierServiceReference = {
  supplierName: string;
  supplierServiceId: number;
  name?: string | null;
  category?: string | null;
  type?: string | null;
  rate?: string | null;
  refill?: boolean | null;
  cancel?: boolean | null;
  providerStatus?: ProviderStatusSummaryResource | null;
};

export type CatalogServiceResource = {
  id: string;
  name: string;
  description: string | null;
  publicPrice: Money;
  status: string;
  sortOrder: number;
  socialNetwork: string;
  category: string;
  type: string;
  minQuantity: number;
  maxQuantity: number;
  availability: CatalogAvailabilityResource;
  metadata: unknown;
  supplierService: CatalogSupplierServiceReference;
};

export type CatalogServiceReference = {
  id: string;
  name: string;
};

export type PaymentResource = {
  id: string;
  provider: string;
  amount: Money;
  status: 'pending' | 'confirmed' | 'expired' | 'failed' | 'cancelled';
  brCode: string | null;
  brCodeBase64: string | null;
  expiresAt: string | null;
  confirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminPaymentResource = PaymentResource & {
  providerPaymentId: string;
  walletCreditedAt: string | null;
  user: UserReference | null;
};

export type SupplierOrderStateResource = {
  provider: string;
  serviceId: number;
  apiOrderId: number | null;
  serviceType: string | null;
  estimatedCharge: Money | null;
  actualCharge: Money | null;
  remains: number | null;
  errorCode: string | null;
  errorMessage: string | null;
};

export type OrderEventResource = {
  id: string;
  eventType: string;
  fromStatus: string | null;
  toStatus: string | null;
  metadata: unknown;
  createdAt: string;
};

export type OrderResource = {
  id: string;
  status:
    | 'pending'
    | 'submitted'
    | 'queued_supplier_balance'
    | 'in_progress'
    | 'completed'
    | 'partial'
    | 'canceled'
    | 'failed';
  link: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  catalogService: CatalogServiceReference | null;
  customerCharge: Money | null;
  supplier: SupplierOrderStateResource;
  events?: OrderEventResource[];
};

export type AdminOrderResource = OrderResource & {
  user: UserReference | null;
};

export type CreateOrderRequest = {
  catalogServiceId: number;
  link: string;
  quantity: number;
  runs?: number;
  interval?: number;
  comments?: string[];
  answerNumber?: string | number;
};

export type AlertSummary = {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  occurrenceCount: number;
  lastOccurredAt: string;
};

export type SupplierProviderSummary = {
  supplierName: string;
  isDefaultProvider: boolean;
  operationalStatus: 'healthy' | 'degraded_low_balance' | 'unavailable';
  balance: Money | null;
  lastCheckedAt: string | null;
  lastSuccessAt: string | null;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
};

export type AdminWalletTransactionResource = {
  id: string;
  type: string;
  direction: 'credit' | 'debit';
  amount: Money;
  balanceBefore: Money;
  balanceAfter: Money;
  referenceType: string | null;
  referenceId: string | null;
  metadata: unknown;
  createdAt: string;
  wallet: {
    id: string;
  };
  user: UserReference;
};

export type SupplierMinimumBalance = {
  amount: string;
} | null;

export type SupplierProviderStatusResource = {
  supplierName: string;
  isDefaultProvider: boolean;
  isAvailable: boolean;
  isLowBalance: boolean;
  operationalStatus: 'healthy' | 'degraded_low_balance' | 'unavailable';
  balance: Money | null;
  minimumBalance: SupplierMinimumBalance;
  lastCheckedAt: string | null;
  lastSuccessAt: string | null;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  updatedAt: string;
};

export type SupplierProviderStatusesResponse = {
  items: SupplierProviderStatusResource[];
};

export type SupplierBalanceResource = {
  supplierName: string;
  balance: string;
  currency: string;
};

export type SupplierServiceResource = {
  id: string;
  supplierName: string;
  supplierServiceId: number;
  name: string;
  category: string;
  type: string;
  rate: string;
  min: number;
  max: number;
  refill: boolean;
  cancel: boolean;
  isActiveAtSupplier: boolean;
  syncedAt: string;
};

export type SupplierSyncLogResource = {
  id: string;
  supplierName: string | null;
  syncType: string;
  targetType: string;
  targetId: string | null;
  status: 'success' | 'failed';
  requestPayload: unknown;
  responsePayload: unknown;
  errorMessage: string | null;
  startedAt: string;
  finishedAt: string | null;
  createdAt: string;
};

export type AlertResource = {
  id: string;
  type: string;
  severity: 'info' | 'warning' | 'critical' | string;
  status: 'open' | 'resolved';
  fingerprint: string;
  title: string;
  message: string;
  context: unknown;
  occurrenceCount: number;
  firstOccurredAt: string;
  lastOccurredAt: string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuditResource = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  payloadSummary: unknown;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  admin: UserReference;
};

export type SyncOrdersRequest = {
  limit?: number;
};

export type SyncOrdersResponse = {
  found: number;
  synced: number;
  skipped: number;
};

export type AdminPaymentsSummaryResponse = {
  counts: Record<'pending' | 'confirmed' | 'expired' | 'failed' | 'cancelled', number>;
  confirmedVolume: Money;
};

export type PaymentReconciliationResponse = {
  found: number;
  reconciled: number;
  unchanged: number;
  errors: number;
  statusCounts: Record<'pending' | 'confirmed' | 'expired' | 'failed' | 'cancelled', number>;
};

export type SinglePaymentReconciliationResponse = {
  paymentId: string;
  provider: string;
  providerPaymentId: string;
  status: 'pending' | 'confirmed' | 'expired' | 'failed' | 'cancelled';
  reconciled: boolean;
  unchanged: boolean;
};

export type DashboardSummaryResponse = {
  generatedAt: string;
  users: {
    total: number;
    customers: number;
    admins: number;
    active: number;
    disabled: number;
  };
  catalog: {
    total: number;
    active: number;
    inactive: number;
  };
  wallet: {
    totalAvailableBalance: Money;
  };
  orders: {
    counts: Record<
      | 'pending'
      | 'submitted'
      | 'queued_supplier_balance'
      | 'in_progress'
      | 'completed'
      | 'partial'
      | 'canceled'
      | 'failed',
      number
    >;
    mutableCount: number;
  };
  payments: {
    counts: Record<'pending' | 'confirmed' | 'expired' | 'failed' | 'cancelled', number>;
    confirmedVolume: Money;
  };
  alerts: {
    counts: Record<'open' | 'resolved', number>;
    openBySeverity: Record<'info' | 'warning' | 'critical', number>;
    latestOpen: AlertSummary[];
  };
  suppliers: {
    counts: Record<'total' | 'healthy' | 'degraded' | 'unavailable', number>;
    providers: SupplierProviderSummary[];
  };
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};
