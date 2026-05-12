import { requireCustomerSession } from '@/lib/auth/guards';
import { CustomerSupportDetailPage } from '@/modules/customer-support/customer-support-detail-page';

type CustomerSupportDetailRouteProps = {
  params: Promise<{ ticketId: string }>;
};

export default async function CustomerSupportDetailRoute({ params }: CustomerSupportDetailRouteProps) {
  const { ticketId } = await params;
  const session = await requireCustomerSession(`/app/support/${encodeURIComponent(ticketId)}`);

  return <CustomerSupportDetailPage session={session} ticketId={ticketId} />;
}
