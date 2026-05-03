import { requireCustomerSession } from '@/lib/auth/guards';
import { getWalletSummary } from '@/lib/api/customer';
import { AreaShell } from '@/modules/app-shell/area-shell';

export default async function CustomerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireCustomerSession();
  let walletSummary = null;

  try {
    walletSummary = await getWalletSummary({ accessToken: session.accessToken });
  } catch {
    walletSummary = null;
  }

  return (
    <AreaShell area="customer" user={session.user} title="Minha conta" walletSummary={walletSummary}>
      {children}
    </AreaShell>
  );
}
