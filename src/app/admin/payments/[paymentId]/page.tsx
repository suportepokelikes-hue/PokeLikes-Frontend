import type { Metadata } from 'next';

import { requireAdminSession } from '@/lib/auth/guards';
import { AdminPaymentDetailPage } from '@/modules/admin-shell/admin-payment-detail-page';

export const metadata: Metadata = {
  title: 'Pagamento admin | Pokelike',
};

type AdminPaymentDetailRouteProps = {
  params: Promise<{ paymentId: string }>;
};

export default async function AdminPaymentDetailRoute({ params }: AdminPaymentDetailRouteProps) {
  const session = await requireAdminSession();
  const { paymentId } = await params;

  return <AdminPaymentDetailPage session={session} paymentId={paymentId} />;
}
