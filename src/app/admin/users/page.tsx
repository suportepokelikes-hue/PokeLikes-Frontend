import { requireAdminSession } from '@/lib/auth/guards';
import { buildAdminPath, parseAdminUsersParams } from '@/modules/admin-shell/query';
import { AdminUsersPage } from '@/modules/admin-shell/admin-users-page';

type AdminUsersRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminUsersRoute({ searchParams }: AdminUsersRouteProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminUsersParams(resolvedSearchParams);
  const isCreateOpen = resolvedSearchParams.create === '1' || (Array.isArray(resolvedSearchParams.create) && resolvedSearchParams.create[0] === '1');
  const session = await requireAdminSession(buildAdminPath('/admin/users', filters));

  return <AdminUsersPage session={session} filters={filters} isCreateOpen={isCreateOpen} />;
}
