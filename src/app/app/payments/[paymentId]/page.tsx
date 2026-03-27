import { requireCustomerSession } from '@/lib/auth/guards';
import { PaymentDetailPage } from '@/modules/customer-transactions/payment-detail-page';

type PaymentDetailRouteProps = {
  params: Promise<{ paymentId: string }>;
};

export default async function PaymentDetailRoute({ params }: PaymentDetailRouteProps) {
  const session = await requireCustomerSession();
  const { paymentId } = await params;

  return <PaymentDetailPage session={session} paymentId={paymentId} />;
}
