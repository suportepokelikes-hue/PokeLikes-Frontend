import { requireAdminSession } from '@/lib/auth/guards';
import { buildAdminPath, parseAdminOrdersParams } from '@/modules/admin-shell/query';
import { AdminOrdersPage } from '@/modules/admin-shell/admin-orders-page';

type AdminOrdersRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrdersRoute({ searchParams }: AdminOrdersRouteProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminOrdersParams(resolvedSearchParams);
  const session = await requireAdminSession(buildAdminPath('/admin/orders', filters));

  return <AdminOrdersPage session={session} filters={filters} />;
}
