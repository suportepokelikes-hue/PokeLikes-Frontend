import { requireCustomerSession } from '@/lib/auth/guards';
import { buildAdminPath } from '@/modules/admin-shell/query';
import { CustomerOrdersPage } from '@/modules/customer-dashboard/customer-orders-page';

type CustomerOrdersRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerOrdersRoute({ searchParams }: CustomerOrdersRouteProps) {
  const resolvedSearchParams = await searchParams;
  const rawOrderId = Array.isArray(resolvedSearchParams.orderId) ? resolvedSearchParams.orderId[0] : resolvedSearchParams.orderId;
  const rawPage = Array.isArray(resolvedSearchParams.page) ? resolvedSearchParams.page[0] : resolvedSearchParams.page;
  const activeOrderId = typeof rawOrderId === 'string' && rawOrderId.trim() ? rawOrderId.trim() : undefined;
  const page = parsePositivePage(rawPage);
  const session = await requireCustomerSession(
    activeOrderId ? buildAdminPath('/app/orders', { orderId: activeOrderId, page }) : undefined,
  );

  return <CustomerOrdersPage session={session} activeOrderId={activeOrderId} page={page} />;
}

function parsePositivePage(value: string | undefined) {
  if (!value) {
    return 1;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
