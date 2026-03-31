import { requireAdminSession } from '@/lib/auth/guards';
import { buildAdminPath, parseAdminUsersParams } from '@/modules/admin-shell/query';
import { AdminUsersPage } from '@/modules/admin-shell/admin-users-page';

type AdminUsersRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminUsersRoute({ searchParams }: AdminUsersRouteProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminUsersParams(resolvedSearchParams);
  const rawCreate = Array.isArray(resolvedSearchParams.create) ? resolvedSearchParams.create[0] : resolvedSearchParams.create;
  const rawEditUserId = Array.isArray(resolvedSearchParams.editUserId)
    ? resolvedSearchParams.editUserId[0]
    : resolvedSearchParams.editUserId;
  const activeUserId = typeof rawEditUserId === 'string' && rawEditUserId.trim() ? rawEditUserId.trim() : undefined;
  const isCreateOpen = !activeUserId && rawCreate === '1';
  const session = await requireAdminSession(
    buildAdminPath('/admin/users', {
      ...filters,
      ...(isCreateOpen ? { create: 1 } : {}),
      ...(activeUserId ? { editUserId: activeUserId } : {}),
    }),
  );

  return <AdminUsersPage session={session} filters={filters} isCreateOpen={isCreateOpen} activeUserId={activeUserId} />;
}
