import { requireCustomerSession } from '@/lib/auth/guards';
import { CustomerAffiliatePage } from '@/modules/customer-dashboard/customer-affiliate-page';

export default async function CustomerAffiliateRoute() {
  const session = await requireCustomerSession('/app/affiliate');

  return <CustomerAffiliatePage session={session} />;
}
