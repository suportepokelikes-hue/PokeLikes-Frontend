import { requireCustomerSession } from '@/lib/auth/guards';
import { CustomerOrdersPage } from '@/modules/customer-dashboard/customer-orders-page';

export default async function CustomerOrdersRoute() {
  const session = await requireCustomerSession();

  return <CustomerOrdersPage session={session} />;
}
