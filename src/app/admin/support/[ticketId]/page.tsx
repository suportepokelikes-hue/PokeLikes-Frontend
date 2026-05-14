import { requireAdminSession } from '@/lib/auth/guards';
import { AdminSupportDetailPage } from '@/modules/admin-support/admin-support-detail-page';

type AdminSupportDetailRouteProps = {
  params: Promise<{ ticketId: string }>;
};

export default async function AdminSupportDetailRoute({ params }: AdminSupportDetailRouteProps) {
  const { ticketId } = await params;
  const session = await requireAdminSession(`/admin/support/${encodeURIComponent(ticketId)}`);

  return <AdminSupportDetailPage session={session} ticketId={ticketId} />;
}
