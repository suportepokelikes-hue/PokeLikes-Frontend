import type {
  CreateOrderRequest,
  CreatePixPaymentRequest,
  OrderResource,
  PaginatedResponse,
  PaymentResource,
  ReferralSummaryResponse,
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

export function getCustomerReferralSummary({ accessToken }: AuthOptions) {
  return apiRequest<ReferralSummaryResponse>({
    path: '/me/referral',
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
