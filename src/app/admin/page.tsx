import { requireAdminSession } from '@/lib/auth/guards';
import { AdminDashboardPage } from '@/modules/admin-shell/admin-dashboard-page';

export default async function AdminPage() {
  const session = await requireAdminSession();

  return <AdminDashboardPage session={session} />;
}
