import { requireAdminSession } from '@/lib/auth/guards';
import { AdminPaymentsPage } from '@/modules/admin-shell/admin-payments-page';

export default async function AdminPaymentsRoute() {
  const session = await requireAdminSession();

  return <AdminPaymentsPage session={session} />;
}
