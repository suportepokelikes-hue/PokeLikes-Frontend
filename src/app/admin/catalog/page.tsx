import { requireAdminSession } from '@/lib/auth/guards';
import { AdminCatalogPage } from '@/modules/admin-shell/admin-catalog-page';

export default async function AdminCatalogRoute() {
  const session = await requireAdminSession();

  return <AdminCatalogPage session={session} />;
}
