import { requireAdminSession } from '@/lib/auth/guards';
import { AdminOrdersPage } from '@/modules/admin-shell/admin-orders-page';

export default async function AdminOrdersRoute() {
  const session = await requireAdminSession();

  return <AdminOrdersPage session={session} />;
}
