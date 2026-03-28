import { requireAdminSession } from '@/lib/auth/guards';
import { buildAdminPath, parseAdminAuditsParams } from '@/modules/admin-shell/query';
import { AdminAuditsPage } from '@/modules/admin-shell/admin-audits-page';

type AdminAuditsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminAuditsRoute({ searchParams }: AdminAuditsRouteProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminAuditsParams(resolvedSearchParams);
  const session = await requireAdminSession(buildAdminPath('/admin/audits', filters));

  return <AdminAuditsPage session={session} filters={filters} />;
}
