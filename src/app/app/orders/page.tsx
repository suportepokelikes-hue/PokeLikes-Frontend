import { requireCustomerSession } from '@/lib/auth/guards';
import { buildAdminPath } from '@/modules/admin-shell/query';
import { CustomerOrdersPage } from '@/modules/customer-dashboard/customer-orders-page';

type CustomerOrdersRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerOrdersRoute({ searchParams }: CustomerOrdersRouteProps) {
  const resolvedSearchParams = await searchParams;
  const rawOrderId = Array.isArray(resolvedSearchParams.orderId) ? resolvedSearchParams.orderId[0] : resolvedSearchParams.orderId;
  const activeOrderId = typeof rawOrderId === 'string' && rawOrderId.trim() ? rawOrderId.trim() : undefined;
  const session = await requireCustomerSession(
    activeOrderId ? buildAdminPath('/app/orders', { orderId: activeOrderId }) : undefined,
  );

  return <CustomerOrdersPage session={session} activeOrderId={activeOrderId} />;
}
