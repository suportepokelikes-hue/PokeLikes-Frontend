import { requireAdminSession } from '@/lib/auth/guards';
import { AdminUsersPage } from '@/modules/admin-shell/admin-users-page';

export default async function AdminUsersRoute() {
  const session = await requireAdminSession();

  return <AdminUsersPage session={session} />;
}
