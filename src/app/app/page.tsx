import { requireCustomerSession } from '@/lib/auth/guards';
import { CustomerHome } from '@/modules/app-shell/customer-home';

export default async function CustomerPage() {
  const session = await requireCustomerSession();

  return <CustomerHome user={session.user} />;
}
