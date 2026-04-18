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
  UpdateCurrentUserProfileRequest,
  UserSummary,
  WalletSummary,
  WalletTransactionResource,
} from './contracts';
import { apiRequest } from './http';

type AuthOptions = {
  accessToken: string;
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
  return apiRequest<AffiliateProfileResource | null>({
    path: '/me/affiliate',
    accessToken,
  });
}

export function applyToAffiliateProgram({ accessToken }: AuthOptions) {
  return apiRequest<AffiliateProfileResource>({
    path: '/me/affiliate/apply',
    method: 'POST',
    accessToken,
  });
}

export function getCustomerAffiliateSummary({ accessToken }: AuthOptions) {
  return apiRequest<AffiliateSummaryResponse>({
    path: '/me/affiliate/summary',
    accessToken,
  });
}

export function listCustomerAffiliateCommissions({ accessToken }: AuthOptions) {
  return apiRequest<PaginatedResponse<AffiliateCommissionResource>>({
    path: '/me/affiliate/commissions?page=1&pageSize=10&sortOrder=desc',
    accessToken,
  });
}

export function listCustomerPayments({ accessToken }: AuthOptions) {
  return apiRequest<PaginatedResponse<PaymentResource>>({
    path: '/me/payments?page=1&pageSize=5&sortOrder=desc',
    accessToken,
  });
}

export function listCustomerOrders({ accessToken }: AuthOptions) {
  return apiRequest<PaginatedResponse<OrderResource>>({
    path: '/me/orders?page=1&pageSize=5&sortOrder=desc',
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
