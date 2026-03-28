import { requireCustomerSession } from '@/lib/auth/guards';
import { CustomerProfilePage } from '@/modules/customer-dashboard/customer-profile-page';

export default async function CustomerProfileRoute() {
  const session = await requireCustomerSession('/app/profile');

  return <CustomerProfilePage session={session} />;
}
