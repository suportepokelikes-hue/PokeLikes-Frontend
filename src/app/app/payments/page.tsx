import { requireCustomerSession } from '@/lib/auth/guards';
import { CustomerPaymentsPage } from '@/modules/customer-dashboard/customer-payments-page';

export default async function CustomerPaymentsRoute() {
  const session = await requireCustomerSession();

  return <CustomerPaymentsPage session={session} />;
}
