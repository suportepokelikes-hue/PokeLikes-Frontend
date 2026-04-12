import { requireAdminSession } from '@/lib/auth/guards';
import { AdminAffiliatesPage } from '@/modules/admin-shell/admin-affiliates-page';
import { buildAdminPath, parseAdminAffiliatesParams } from '@/modules/admin-shell/query';

type AdminAffiliatesRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminAffiliatesRoute({ searchParams }: AdminAffiliatesRouteProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminAffiliatesParams(resolvedSearchParams);
  const session = await requireAdminSession(buildAdminPath('/admin/affiliates', filters));

  return <AdminAffiliatesPage session={session} filters={filters} />;
}
