import { requireAdminSession } from '@/lib/auth/guards';
import { AdminUserDetailPage } from '@/modules/admin-shell/admin-user-detail-page';

type AdminUserDetailRouteProps = {
  params: Promise<{ userId: string }>;
};

export default async function AdminUserDetailRoute({ params }: AdminUserDetailRouteProps) {
  const { userId } = await params;
  const session = await requireAdminSession(`/admin/users/${userId}`);

  return <AdminUserDetailPage session={session} userId={userId} />;
}
