import { requireAdminSession } from '@/lib/auth/guards';
import { AdminHome } from '@/modules/admin-shell/admin-home';

export default async function AdminPage() {
  const session = await requireAdminSession();

  return <AdminHome user={session.user} />;
}
