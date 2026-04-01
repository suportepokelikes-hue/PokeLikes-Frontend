import { redirect } from 'next/navigation';

type PaymentDetailRouteProps = {
  params: Promise<{ paymentId: string }>;
};

export default async function PaymentDetailRoute({ params }: PaymentDetailRouteProps) {
  const { paymentId } = await params;
  redirect(`/app/payments?paymentId=${encodeURIComponent(paymentId)}`);
}
