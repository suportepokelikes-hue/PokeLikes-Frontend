import { requireAdminSession } from '@/lib/auth/guards';
import { AdminSupportPage } from '@/modules/admin-support/admin-support-page';
import { buildAdminPath, parseAdminSupportTicketsParams } from '@/modules/admin-shell/query';

type AdminSupportRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminSupportRoute({ searchParams }: AdminSupportRouteProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminSupportTicketsParams(resolvedSearchParams);
  const session = await requireAdminSession(buildAdminPath('/admin/support', filters));

  return <AdminSupportPage session={session} filters={filters} />;
}
