import { requireAdminSession } from '@/lib/auth/guards';
import { buildAdminPath, parseAdminAlertsParams } from '@/modules/admin-shell/query';
import { AdminAlertsPage } from '@/modules/admin-shell/admin-alerts-page';

type AdminAlertsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminAlertsRoute({ searchParams }: AdminAlertsRouteProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminAlertsParams(resolvedSearchParams);
  const session = await requireAdminSession(buildAdminPath('/admin/alerts', filters));

  return <AdminAlertsPage session={session} filters={filters} />;
}
