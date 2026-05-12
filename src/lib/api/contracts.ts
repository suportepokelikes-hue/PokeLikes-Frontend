export type UserRole = 'customer' | 'admin';

export type FiscalTaxIdType = 'cpf' | 'cnpj';

export type FiscalProfileResource = {
  taxId: string;
  taxIdType: FiscalTaxIdType;
};

export type UserSummary = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  taxId?: string;
  fiscalProfile?: FiscalProfileResource | null;
  status: string;
  referralCode?: string;
  emailVerified?: boolean;
};

export type UserStatus = 'active' | 'disabled';

export type UpdateCurrentUserProfileRequest = {
  name?: string;
  phone?: string;
  taxId?: string;
};

export type AdminCreateUserRequest = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
};

export type AdminUpdateUserRequest = {
  name?: string;
  password?: string;
  phone?: string | null;
  role?: UserRole;
  status?: UserStatus;
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
  taxId?: string;
  referralCode?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type GoogleAuthRequest = {
  idToken: string;
  referralCode?: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type AuthSessionResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserSummary;
};

export type EmailVerificationConfirmRequest = {
  token: string;
};

export type EmailVerificationRequestResponse = {
  status: 'already_verified' | 'verification_requested';
  expiresAt: string | null;
  delivery: 'email' | 'preview';
  previewToken?: string;
};

export type Money = {
  amount: string;
  currency: string;
};

export type SupplierRateInfo = {
  originalAmount: string;
  originalCurrency: string;
  convertedToBrl: {
    amount: string;
    currency: 'BRL';
    conversionRate: string;
  } | null;
};

export type ReferralRewardStatus =
  | 'not_referred'
  | 'pending_email_verification'
  | 'pending_first_qualifying_topup'
  | 'rewarded';

export type ReferralRewardRules = {
  minimumTopupAmount: Money;
  referredBonusAmount: Money;
  referrerBonusAmount: Money;
};

export type ReferralOwnReward = {
  id: string;
  status: 'pending' | 'rewarded' | 'blocked';
  qualifyingPaymentId: string | null;
  qualifyingAmount: Money;
  referredBonusAmount: Money;
  processedAt: string | null;
};

export type ReferralProgramSummary = {
  invitedUsers: number;
  rewardedUsers: number;
  earnedAmount: Money;
};

export type ReferralSummaryResponse = {
  referralCode: string;
  referralLink: string;
  emailVerified: boolean;
  rewardRules: ReferralRewardRules;
  rewardStatus: ReferralRewardStatus;
  ownReferralReward: ReferralOwnReward | null;
  summary: ReferralProgramSummary;
};

export type AffiliateProfileStatus = string;

export type AffiliateCommissionStatus = string;

export type AffiliatePayoutStatus = string;

export type AffiliatePixKeyResource = {
  pixKeyType: string;
  pixKey: string;
  updatedAt: string;
};

export type AffiliateProfileResource = {
  id: string;
  affiliateCode?: string | null;
  publicCode?: string | null;
  status: AffiliateProfileStatus;
  affiliateCommissionPercent?: string | null;
  pixKeyType?: string | null;
  pixKey?: string | null;
  approvedAt: string | null;
  suspendedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: UserReference | null;
};

export type UpdateAffiliatePixRequest = {
  pixKeyType: string;
  pixKey: string;
};

export type AffiliateSummaryResponse = {
  affiliateProfile: AffiliateProfileResource | null;
  totals: Record<string, number | Money>;
};

export type AffiliateCommissionResource = {
  id: string;
  status: AffiliateCommissionStatus;
  affiliateCommissionPercent?: string | null;
  commissionAmount: Money;
  createdAt: string;
  updatedAt: string;
  affiliateProfileId?: string;
  orderId?: string | null;
  payoutId?: string | null;
  paidAt?: string | null;
};

export type AffiliatePayoutResource = {
  id: string;
  affiliateProfileId: string;
  amount: string;
  status: AffiliatePayoutStatus;
  createdAt: string;
  processedAt: string | null;
  processedByUserId: string | null;
  notes: string | null;
  statusReason: string | null;
  provider: string | null;
  externalReference: string | null;
  providerTransactionId: string | null;
  providerStatus: string | null;
  providerErrorCode: string | null;
  providerErrorMessage: string | null;
  providerSyncedAt: string | null;
  pixKey: {
    type: string;
    key: string;
  } | null;
  requestedAt: string;
  processingAt: string | null;
  paidAt: string | null;
  failedAt: string | null;
  cancelledAt: string | null;
  affiliate: {
    userId: string;
    publicCode: string;
    affiliateCode: string;
  };
  commissionIds?: string[];
  commissionCount?: number;
};

export type WalletSummary = {
  id: string;
  availableBalance: Money;
};

export type AdminWalletAdjustmentRequest = {
  amount: string;
  direction: 'credit' | 'debit';
  type?: 'wallet_adjustment_admin' | 'wallet_reversal_admin';
  reason?: string;
};

export type AdminWalletAdjustmentResponse = {
  wallet: WalletSummary;
  transaction: WalletTransactionResource;
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
  rateInfo?: SupplierRateInfo | null;
  estimatedDeliveryTime?: string | null;
  refill?: boolean | null;
  cancel?: boolean | null;
  providerStatus?: ProviderStatusSummaryResource | null;
};

export type CatalogServiceResource = {
  id: string;
  name: string;
  description: string | null;
  estimatedDeliveryTime?: string | null;
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

export type CatalogServiceStatus = 'active' | 'inactive';

export type AdminCatalogServiceUpsertRequest = {
  name: string;
  description?: string | null;
  estimatedDeliveryTime?: string | null;
  publicPrice: string;
  status?: CatalogServiceStatus;
  sortOrder?: number;
  socialNetwork: string;
  category: string;
  type: string;
  minQuantity: number;
  maxQuantity: number;
  supplierName?: string;
  supplierServiceId: number;
  metadata?: unknown;
};

export type AdminCatalogServiceUpdateRequest = {
  name?: string;
  description?: string | null;
  estimatedDeliveryTime?: string | null;
  publicPrice?: string;
  status?: CatalogServiceStatus;
  sortOrder?: number;
  socialNetwork?: string;
  category?: string;
  type?: string;
  minQuantity?: number;
  maxQuantity?: number;
  supplierName?: string;
  supplierServiceId?: number;
  metadata?: unknown;
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

export type PaymentEventResource = {
  id: string;
  eventType: string;
  providerEventId: string | null;
  providerPaymentId: string | null;
  processingStatus: string;
  processedAt: string | null;
  createdAt: string;
};

export type AdminPaymentDetailResource = AdminPaymentResource & {
  events: PaymentEventResource[];
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

export type SupportTicketStatus = 'open' | 'waiting_customer' | 'closed';

export type SupportTicketMessageResource = {
  id: string;
  ticketId: string;
  senderUserId: string;
  senderRole: UserRole;
  message: string;
  createdAt: string;
};

export type SupportTicketResource = {
  id: string;
  userId: string;
  subject: string;
  status: SupportTicketStatus;
  lastMessageAt: string;
  closedAt: string | null;
  closedByAdminId: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: SupportTicketMessageResource[];
};

export type CreateSupportTicketRequest = {
  subject: string;
  message: string;
};

export type CreateSupportTicketMessageRequest = {
  message: string;
};

export type AdminOrderResource = OrderResource & {
  user: UserReference | null;
};

export type CreateOrderRequest = {
  catalogServiceId: number;
  link: string;
  quantity: number;
  affiliateCode?: string;
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

export type SupplierSyncName = 'cheapsmmglobal' | 'instabarato';

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
  rateInfo?: SupplierRateInfo | null;
  estimatedDeliveryTime: string | null;
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

export type AdminUsersListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type AdminCatalogListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  socialNetwork?: string;
  category?: string;
  type?: string;
};

export type AdminPaymentsListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  provider?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type AdminOrdersListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  userId?: string;
};

export type AdminTransactionsListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortOrder?: 'asc' | 'desc';
  userId?: string;
  type?: string;
  direction?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type AdminAffiliateProfileListParams = {
  page?: number;
  pageSize?: number;
  sortOrder?: 'asc' | 'desc';
  status?: AffiliateProfileStatus;
};

export type AdminAffiliateCommissionsListParams = {
  page?: number;
  pageSize?: number;
  sortOrder?: 'asc' | 'desc';
  status?: AffiliateCommissionStatus;
  affiliateProfileId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type AdminAffiliatePayoutsListParams = {
  page?: number;
  pageSize?: number;
  sortOrder?: 'asc' | 'desc';
  status?: AffiliatePayoutStatus;
  affiliateProfileId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type AdminCreateAffiliatePayoutRequest = {
  affiliateProfileId: number;
  commissionIds: number[];
  notes?: string;
};

export type AdminUpdateAffiliatePayoutStatusRequest = {
  status: 'processing' | 'paid' | 'failed' | 'cancelled';
  notes?: string;
  statusReason?: string;
};

export type AdminCatalogAffiliateSettingsResource = {
  catalogServiceId: string;
  affiliateEnabled: boolean;
  affiliateCommissionPercent: string | null;
  catalogService?: CatalogServiceReference | null;
};

export type AdminCatalogAffiliateSettingsListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortOrder?: 'asc' | 'desc';
};

export type AdminCatalogAffiliateSettingsUpdateRequest = {
  isAffiliateEnabled?: boolean;
  affiliateCommissionPercent?: string | null;
};

export type SupplierServicesListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  supplierName?: string;
  category?: string;
  type?: string;
  isActiveAtSupplier?: 'true' | 'false';
};

export type SupplierSyncLogsListParams = {
  page?: number;
  pageSize?: number;
  supplierName?: string;
  syncType?: string;
  status?: string;
  targetType?: string;
};

export type AdminAlertsListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  severity?: string;
  type?: string;
};

export type AdminAuditsListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortOrder?: 'asc' | 'desc';
  adminId?: string;
  action?: string;
  entityType?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};
