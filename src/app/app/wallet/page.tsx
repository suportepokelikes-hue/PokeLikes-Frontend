import { requireCustomerSession } from '@/lib/auth/guards';
import { CustomerWalletPage } from '@/modules/customer-dashboard/customer-wallet-page';

export default async function CustomerWalletRoute() {
  const session = await requireCustomerSession();

  return <CustomerWalletPage session={session} />;
}
