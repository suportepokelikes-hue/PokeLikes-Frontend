import { requireAdminSession } from '@/lib/auth/guards';
import { buildAdminPath, parseSupplierServicesParams, parseSupplierSyncLogsParams } from '@/modules/admin-shell/query';
import { AdminSupplierPage } from '@/modules/admin-shell/admin-supplier-page';

type AdminSupplierRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminSupplierRoute({ searchParams }: AdminSupplierRouteProps) {
  const resolvedSearchParams = await searchParams;
  const serviceFilters = parseSupplierServicesParams(resolvedSearchParams);
  const logFilters = parseSupplierSyncLogsParams(resolvedSearchParams);
  const session = await requireAdminSession(buildAdminPath('/admin/supplier', { ...serviceFilters, ...logFilters }));

  return <AdminSupplierPage session={session} serviceFilters={serviceFilters} logFilters={logFilters} />;
}
