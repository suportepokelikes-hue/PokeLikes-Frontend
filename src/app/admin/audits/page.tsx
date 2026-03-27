import { requireAdminSession } from '@/lib/auth/guards';
import { AdminAuditsPage } from '@/modules/admin-shell/admin-audits-page';

export default async function AdminAuditsRoute() {
  const session = await requireAdminSession();

  return <AdminAuditsPage session={session} />;
}
