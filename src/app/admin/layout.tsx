import { requireAdminSession } from '@/lib/auth/guards';
import { AreaShell } from '@/modules/app-shell/area-shell';

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdminSession();

  return (
    <AreaShell area="admin" user={session.user} title="Admin">
      {children}
    </AreaShell>
  );
}
