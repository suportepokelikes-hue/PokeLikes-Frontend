import { requireCustomerSession } from '@/lib/auth/guards';
import { buildAdminPath } from '@/modules/admin-shell/query';
import { CustomerPaymentsPage } from '@/modules/customer-dashboard/customer-payments-page';

type CustomerPaymentsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerPaymentsRoute({ searchParams }: CustomerPaymentsRouteProps) {
  const resolvedSearchParams = await searchParams;
  const rawPaymentId = Array.isArray(resolvedSearchParams.paymentId) ? resolvedSearchParams.paymentId[0] : resolvedSearchParams.paymentId;
  const activePaymentId = typeof rawPaymentId === 'string' && rawPaymentId.trim() ? rawPaymentId.trim() : undefined;
  const session = await requireCustomerSession(
    activePaymentId ? buildAdminPath('/app/payments', { paymentId: activePaymentId }) : undefined,
  );

  return <CustomerPaymentsPage session={session} activePaymentId={activePaymentId} />;
}
