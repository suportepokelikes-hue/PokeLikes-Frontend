import { requireCustomerSession } from '@/lib/auth/guards';
import { CustomerDashboardPage } from '@/modules/customer-dashboard/customer-dashboard-page';

export default async function CustomerPage() {
  const session = await requireCustomerSession();

  return <CustomerDashboardPage session={session} />;
}
