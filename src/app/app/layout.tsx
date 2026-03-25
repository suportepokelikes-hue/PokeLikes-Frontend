import { requireCustomerSession } from '@/lib/auth/guards';
import { AreaShell } from '@/modules/app-shell/area-shell';

export default async function CustomerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireCustomerSession();

  return (
    <AreaShell area="customer" user={session.user} title="Workspace do cliente">
      {children}
    </AreaShell>
  );
}
