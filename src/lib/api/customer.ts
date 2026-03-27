import type {
  OrderResource,
  PaginatedResponse,
  PaymentResource,
  WalletSummary,
  WalletTransactionResource,
} from '@/lib/api/contracts';
import { apiRequest } from '@/lib/api/http';

type AuthOptions = {
  accessToken: string;
};

export function getWalletSummary({ accessToken }: AuthOptions) {
  return apiRequest<WalletSummary>({
    path: '/me/wallet',
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
