import type { Metadata } from 'next';

import { requireAdminSession } from '@/lib/auth/guards';
import { AdminOrderDetailPage } from '@/modules/admin-shell/admin-order-detail-page';

export const metadata: Metadata = {
  title: 'Pedido admin | Pokelike',
};

type AdminOrderDetailRouteProps = {
  params: Promise<{ orderId: string }>;
};

export default async function AdminOrderDetailRoute({ params }: AdminOrderDetailRouteProps) {
  const session = await requireAdminSession();
  const { orderId } = await params;

  return <AdminOrderDetailPage session={session} orderId={orderId} />;
}
