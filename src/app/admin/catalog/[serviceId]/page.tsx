import { requireAdminSession } from '@/lib/auth/guards';
import { AdminCatalogDetailPage } from '@/modules/admin-shell/admin-catalog-detail-page';

type AdminCatalogDetailRouteProps = {
  params: Promise<{ serviceId: string }>;
};

export default async function AdminCatalogDetailRoute({ params }: AdminCatalogDetailRouteProps) {
  const { serviceId } = await params;
  const session = await requireAdminSession(`/admin/catalog/${serviceId}`);

  return <AdminCatalogDetailPage session={session} serviceId={serviceId} />;
}
