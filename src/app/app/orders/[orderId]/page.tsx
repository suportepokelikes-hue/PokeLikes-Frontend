import { requireCustomerSession } from '@/lib/auth/guards';
import { OrderDetailPage } from '@/modules/customer-transactions/order-detail-page';

type OrderDetailRouteProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderDetailRoute({ params }: OrderDetailRouteProps) {
  const { orderId } = await params;
  const session = await requireCustomerSession(`/app/orders/${orderId}`);

  return <OrderDetailPage session={session} orderId={orderId} />;
}
