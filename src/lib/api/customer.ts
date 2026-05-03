import type {
  AffiliateCommissionResource,
  AffiliateProfileResource,
  AffiliateSummaryResponse,
  CreateOrderRequest,
  CreatePixPaymentRequest,
  OrderResource,
  PaginatedResponse,
  PaymentResource,
  ReferralSummaryResponse,
  UpdateAffiliatePixRequest,
  UpdateCurrentUserProfileRequest,
  UserSummary,
  WalletSummary,
  WalletTransactionResource,
} from './contracts';
import {
  normalizeAffiliateCommissionsResponse,
  normalizeAffiliatePixKey,
  normalizeAffiliateProfile,
  normalizeAffiliateSummary,
} from './affiliate-normalizers';
import { apiRequest } from './http';

type AuthOptions = {
  accessToken: string;
};

type CustomerListParams = {
  page?: number;
  pageSize?: number;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: string;
};

export function getWalletSummary({ accessToken }: AuthOptions) {
  return apiRequest<WalletSummary>({
    path: '/me/wallet',
    accessToken,
  });
}

export function getCustomerProfile({ accessToken }: AuthOptions) {
  return apiRequest<UserSummary>({
    path: '/me',
    accessToken,
  });
}

export function updateCustomerProfile({ accessToken }: AuthOptions, payload: UpdateCurrentUserProfileRequest) {
  return apiRequest<UserSummary>({
    path: '/me',
    method: 'PATCH',
    accessToken,
    body: payload,
  });
}

export function getCustomerReferralSummary({ accessToken }: AuthOptions) {
  return apiRequest<ReferralSummaryResponse>({
    path: '/me/referral',
    accessToken,
  });
}

export function getCustomerAffiliateProfile({ accessToken }: AuthOptions) {
  return apiRequest<unknown>({
    path: '/me/affiliate',
    accessToken,
  }).then(normalizeAffiliateProfile);
}

export function getCustomerAffiliatePix({ accessToken }: AuthOptions) {
  return apiRequest<unknown>({
    path: '/me/affiliate/pix-key',
    accessToken,
  }).then(normalizeAffiliatePixKey);
}

export function applyToAffiliateProgram({ accessToken }: AuthOptions) {
  return apiRequest<unknown>({
    path: '/me/affiliate/apply',
    method: 'POST',
    accessToken,
  }).then((response) => normalizeAffiliateProfile(response) as AffiliateProfileResource);
}

export function updateCustomerAffiliatePix({ accessToken }: AuthOptions, payload: UpdateAffiliatePixRequest) {
  return apiRequest<unknown>({
    path: '/me/affiliate/pix-key',
    method: 'PATCH',
    accessToken,
    body: payload,
  }).then(normalizeAffiliatePixKey);
}

export function getCustomerAffiliateSummary({ accessToken }: AuthOptions) {
  return apiRequest<unknown>({
    path: '/me/affiliate/summary',
    accessToken,
  }).then(normalizeAffiliateSummary);
}

export function listCustomerAffiliateCommissions({ accessToken }: AuthOptions) {
  return apiRequest<unknown>({
    path: '/me/affiliate/commissions?page=1&pageSize=10&sortOrder=desc',
    accessToken,
  }).then(normalizeAffiliateCommissionsResponse);
}

export function listCustomerPayments(
  { accessToken }: AuthOptions,
  { page = 1, pageSize = 5, sortOrder = 'desc' }: CustomerListParams = {},
) {
  return apiRequest<PaginatedResponse<PaymentResource>>({
    path: `/me/payments?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`,
    accessToken,
  });
}

export function listCustomerOrders(
  { accessToken }: AuthOptions,
  { page = 1, pageSize = 5, sortOrder = 'desc', search, status }: CustomerListParams = {},
) {
  const searchParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sortOrder,
  });

  if (search) {
    searchParams.set('search', search);
  }

  if (status) {
    searchParams.set('status', status);
  }

  return apiRequest<PaginatedResponse<OrderResource>>({
    path: `/me/orders?${searchParams.toString()}`,
    accessToken,
  });
}

export function listWalletTransactions({ accessToken }: AuthOptions) {
  return apiRequest<PaginatedResponse<WalletTransactionResource>>({
    path: '/me/wallet/transactions?page=1&pageSize=10&sortOrder=desc',
    accessToken,
  });
}

export function createPixPayment({ accessToken }: AuthOptions, payload: CreatePixPaymentRequest) {
  return apiRequest<PaymentResource>({
    path: '/me/payments/pix',
    method: 'POST',
    accessToken,
    body: payload,
  });
}

export function getCustomerPaymentDetail({ accessToken }: AuthOptions, paymentId: string) {
  return apiRequest<PaymentResource>({
    path: `/me/payments/${paymentId}`,
    accessToken,
  });
}

export function createCustomerOrder({ accessToken }: AuthOptions, payload: CreateOrderRequest) {
  return apiRequest<OrderResource>({
    path: '/me/orders',
    method: 'POST',
    accessToken,
    body: payload,
  });
}

export function getCustomerOrderDetail({ accessToken }: AuthOptions, orderId: string) {
  return apiRequest<OrderResource>({
    path: `/me/orders/${orderId}`,
    accessToken,
  });
}
