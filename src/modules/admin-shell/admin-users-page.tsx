import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listAdminUsers } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import type { AdminUsersListParams } from '@/modules/admin-shell/query';
import { AdminFilterBar, PaginationSummary } from '@/modules/admin-shell/shared';

type AdminUsersPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminUsersListParams;
};

export async function AdminUsersPage({ session, filters }: AdminUsersPageProps) {
  try {
    const users = await listAdminUsers(session.accessToken, filters);

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / usuarios"
          title="Usuarios da plataforma."
          description="A listagem administrativa respeita os papeis e status vindos do backend."
          actions={
            <AdminFilterBar
              pathname="/admin/users"
              fields={[
                {
                  name: 'search',
                  label: 'Busca',
                  type: 'search',
                  placeholder: 'Nome ou email',
                  defaultValue: filters.search,
                },
                {
                  name: 'sortBy',
                  label: 'Ordenar por',
                  type: 'select',
                  defaultValue: filters.sortBy,
                  options: [
                    { label: 'Nome', value: 'name' },
                    { label: 'Email', value: 'email' },
                    { label: 'Criacao', value: 'createdAt' },
                  ],
                },
                {
                  name: 'sortOrder',
                  label: 'Ordem',
                  type: 'select',
                  defaultValue: filters.sortOrder,
                  options: [
                    { label: 'Desc', value: 'desc' },
                    { label: 'Asc', value: 'asc' },
                  ],
                },
                {
                  name: 'pageSize',
                  label: 'Pagina',
                  type: 'select',
                  defaultValue: filters.pageSize ?? 10,
                  options: [
                    { label: '10', value: '10' },
                    { label: '20', value: '20' },
                    { label: '50', value: '50' },
                  ],
                },
              ]}
            />
          }
        />

        {users.items.length === 0 ? (
          <EmptyState title="Nenhum usuario encontrado" description="O backend nao retornou usuarios para a listagem atual." />
        ) : (
          <>
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
            <PaginationSummary
              page={users.page}
              pageSize={users.pageSize}
              totalItems={users.totalItems}
              totalPages={users.totalPages}
              pathname="/admin/users"
              params={{ ...filters, pageSize: filters.pageSize ?? users.pageSize }}
              label="usuarios"
            />
          </>
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
