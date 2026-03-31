import { redirect } from 'next/navigation';

type AdminCatalogDetailRouteProps = {
  params: Promise<{ serviceId: string }>;
};

export default async function AdminCatalogDetailRoute({ params }: AdminCatalogDetailRouteProps) {
  const { serviceId } = await params;
  redirect(`/admin/catalog?editServiceId=${encodeURIComponent(serviceId)}`);
}
