import { requireCustomerSession } from '@/lib/auth/guards';
import { buildAdminPath } from '@/modules/admin-shell/query';
import { CustomerPaymentsPage } from '@/modules/customer-dashboard/customer-payments-page';

type CustomerPaymentsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerPaymentsRoute({ searchParams }: CustomerPaymentsRouteProps) {
  const resolvedSearchParams = await searchParams;
  const rawPaymentId = Array.isArray(resolvedSearchParams.paymentId) ? resolvedSearchParams.paymentId[0] : resolvedSearchParams.paymentId;
  const rawPage = Array.isArray(resolvedSearchParams.page) ? resolvedSearchParams.page[0] : resolvedSearchParams.page;
  const activePaymentId = typeof rawPaymentId === 'string' && rawPaymentId.trim() ? rawPaymentId.trim() : undefined;
  const page = parsePositivePage(rawPage);
  const session = await requireCustomerSession(
    activePaymentId ? buildAdminPath('/app/payments', { paymentId: activePaymentId, page }) : undefined,
  );

  return <CustomerPaymentsPage session={session} activePaymentId={activePaymentId} page={page} />;
}

function parsePositivePage(value: string | undefined) {
  if (!value) {
    return 1;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
