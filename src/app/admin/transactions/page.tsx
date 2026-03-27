import { requireAdminSession } from '@/lib/auth/guards';
import { AdminTransactionsPage } from '@/modules/admin-shell/admin-transactions-page';

export default async function AdminTransactionsRoute() {
  const session = await requireAdminSession();

  return <AdminTransactionsPage session={session} />;
}
