import type {
  AdminOrderResource,
  AdminPaymentResource,
  DashboardSummaryResponse,
  PaginatedResponse,
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

export function listAdminOrders(accessToken: string) {
  return apiRequest<PaginatedResponse<AdminOrderResource>>({
    path: '/admin/orders?page=1&pageSize=10&sortOrder=desc',
    accessToken,
  });
}
