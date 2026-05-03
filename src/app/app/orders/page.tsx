import { requireCustomerSession } from '@/lib/auth/guards';
import { buildAdminPath } from '@/modules/admin-shell/query';
import { CustomerOrdersPage } from '@/modules/customer-dashboard/customer-orders-page';

const ORDER_STATUS_VALUES = ['pending', 'submitted', 'in_progress', 'completed', 'partial', 'canceled', 'failed'] as const;

type OrderStatusFilter = (typeof ORDER_STATUS_VALUES)[number];

type CustomerOrdersRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerOrdersRoute({ searchParams }: CustomerOrdersRouteProps) {
  const resolvedSearchParams = await searchParams;
  const rawOrderId = Array.isArray(resolvedSearchParams.orderId) ? resolvedSearchParams.orderId[0] : resolvedSearchParams.orderId;
  const rawPage = Array.isArray(resolvedSearchParams.page) ? resolvedSearchParams.page[0] : resolvedSearchParams.page;
  const rawStatus = Array.isArray(resolvedSearchParams.status) ? resolvedSearchParams.status[0] : resolvedSearchParams.status;
  const rawSearch = Array.isArray(resolvedSearchParams.search) ? resolvedSearchParams.search[0] : resolvedSearchParams.search;
  const activeOrderId = typeof rawOrderId === 'string' && rawOrderId.trim() ? rawOrderId.trim() : undefined;
  const page = parsePositivePage(rawPage);
  const status = parseOrderStatus(rawStatus);
  const search = typeof rawSearch === 'string' && rawSearch.trim() ? rawSearch.trim() : undefined;
  const session = await requireCustomerSession(
    activeOrderId
      ? buildAdminPath('/app/orders', {
          orderId: activeOrderId,
          page: page > 1 ? page : undefined,
          status,
          search,
        })
      : undefined,
  );

  return <CustomerOrdersPage session={session} activeOrderId={activeOrderId} page={page} status={status} search={search} />;
}

function parsePositivePage(value: string | undefined) {
  if (!value) {
    return 1;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseOrderStatus(value: string | undefined): OrderStatusFilter | undefined {
  if (!value) {
    return undefined;
  }

  return ORDER_STATUS_VALUES.includes(value as OrderStatusFilter) ? (value as OrderStatusFilter) : undefined;
}
