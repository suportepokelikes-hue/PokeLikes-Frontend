import { requireCustomerSession } from '@/lib/auth/guards';
import { OrderDetailPage } from '@/modules/customer-transactions/order-detail-page';

type OrderDetailRouteProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderDetailRoute({ params }: OrderDetailRouteProps) {
  const session = await requireCustomerSession();
  const { orderId } = await params;

  return <OrderDetailPage session={session} orderId={orderId} />;
}
