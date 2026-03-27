import { requireAdminSession } from '@/lib/auth/guards';
import { AdminSupplierPage } from '@/modules/admin-shell/admin-supplier-page';

export default async function AdminSupplierRoute() {
  const session = await requireAdminSession();

  return <AdminSupplierPage session={session} />;
}
