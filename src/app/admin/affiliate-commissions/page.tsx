import { requireAdminSession } from '@/lib/auth/guards';
import { AdminAffiliateCommissionsPage } from '@/modules/admin-shell/admin-affiliate-commissions-page';
import { buildAdminPath, parseAdminAffiliateCommissionsParams } from '@/modules/admin-shell/query';

type AdminAffiliateCommissionsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminAffiliateCommissionsRoute({ searchParams }: AdminAffiliateCommissionsRouteProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminAffiliateCommissionsParams(resolvedSearchParams);
  const session = await requireAdminSession(buildAdminPath('/admin/affiliate-commissions', filters));

  return <AdminAffiliateCommissionsPage session={session} filters={filters} />;
}
