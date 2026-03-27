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
