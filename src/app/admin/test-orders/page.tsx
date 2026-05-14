import { requireAdminSession } from '@/lib/auth/guards';
import { AdminTestOrdersPage } from '@/modules/admin-shell/admin-test-orders-page';
import { buildAdminPath, parseAdminCatalogParams } from '@/modules/admin-shell/query';

type AdminTestOrdersRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminTestOrdersRoute({ searchParams }: AdminTestOrdersRouteProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminCatalogParams(resolvedSearchParams);
  const selectedServiceId = readString(resolvedSearchParams.serviceId);
  const session = await requireAdminSession(buildAdminPath('/admin/test-orders', { ...filters, serviceId: selectedServiceId }));

  return <AdminTestOrdersPage session={session} filters={filters} selectedServiceId={selectedServiceId} />;
}

function readString(value: string | string[] | undefined) {
  const single = Array.isArray(value) ? value[0] : value;

  if (typeof single !== 'string') {
    return undefined;
  }

  const trimmed = single.trim();
  return trimmed ? trimmed : undefined;
}
