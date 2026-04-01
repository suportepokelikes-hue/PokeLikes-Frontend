import { redirect } from 'next/navigation';

type OrderDetailRouteProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderDetailRoute({ params }: OrderDetailRouteProps) {
  const { orderId } = await params;
  redirect(`/app/orders?orderId=${encodeURIComponent(orderId)}`);
}
