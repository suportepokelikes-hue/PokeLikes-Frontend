import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listAdminUsers } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';

type AdminUsersPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function AdminUsersPage({ session }: AdminUsersPageProps) {
  try {
    const users = await listAdminUsers(session.accessToken);

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / usuarios"
          title="Usuarios da plataforma."
          description="A listagem administrativa respeita os papeis e status vindos do backend."
        />

        {users.items.length === 0 ? (
          <EmptyState title="Nenhum usuario encontrado" description="O backend nao retornou usuarios para a listagem atual." />
        ) : (
          <DataTable columns={['Nome', 'Email', 'Papel', 'Status']}>
            {users.items.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <StatusBadge label={user.role} tone={user.role === 'admin' ? 'info' : 'neutral'} />
                </td>
                <td>
                  <StatusBadge label={user.status} tone={user.status === 'active' ? 'success' : 'danger'} />
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar os usuarios"
          description={error instanceof ApiClientError ? error.message : 'A API nao retornou a lista de usuarios.'}
        />
      </main>
    );
  }
}
