import { requireAdminSession } from '@/lib/auth/guards';
import { buildAdminPath, parseAdminPaymentsParams } from '@/modules/admin-shell/query';
import { AdminPaymentsPage } from '@/modules/admin-shell/admin-payments-page';

type AdminPaymentsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPaymentsRoute({ searchParams }: AdminPaymentsRouteProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminPaymentsParams(resolvedSearchParams);
  const session = await requireAdminSession(buildAdminPath('/admin/payments', filters));

  return <AdminPaymentsPage session={session} filters={filters} />;
}
