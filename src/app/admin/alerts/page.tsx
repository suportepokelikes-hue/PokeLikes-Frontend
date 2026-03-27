import { requireAdminSession } from '@/lib/auth/guards';
import { AdminAlertsPage } from '@/modules/admin-shell/admin-alerts-page';

export default async function AdminAlertsRoute() {
  const session = await requireAdminSession();

  return <AdminAlertsPage session={session} />;
}
