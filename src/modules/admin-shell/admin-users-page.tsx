import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { AdminSectionCard } from '@/components/ui/admin-surfaces';
import { getAdminUserDetail, listAdminUsers } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { createWalletAdjustmentAction, createUserAction, updateUserAction } from '@/modules/admin-shell/actions';
import { AdminSlideOver } from '@/modules/admin-shell/admin-slide-over';
import { AdminUserMutationForm } from '@/modules/admin-shell/admin-user-mutation-form';
import { AdminWalletAdjustmentForm } from '@/modules/admin-shell/admin-wallet-adjustment-form';
import type { AdminUsersListParams } from '@/modules/admin-shell/query';
import { AdminFilterBar, PaginationSummary, buildPathWithSearch } from '@/modules/admin-shell/shared';

type AdminUsersPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminUsersListParams;
  isCreateOpen?: boolean;
  activeUserId?: string;
};

export async function AdminUsersPage({ session, filters, isCreateOpen = false, activeUserId }: AdminUsersPageProps) {
  try {
    const users = await listAdminUsers(session.accessToken, filters);
    const returnTo = buildPathWithSearch('/admin/users', {
      ...filters,
      page: filters.page ?? users.page,
      pageSize: filters.pageSize ?? users.pageSize,
    });
    const createPath = buildPathWithSearch('/admin/users', {
      ...filters,
      page: filters.page ?? users.page,
      pageSize: filters.pageSize ?? users.pageSize,
      create: 1,
    });
    const editPath = (userId: string) =>
      buildPathWithSearch('/admin/users', {
        ...filters,
        page: filters.page ?? users.page,
        pageSize: filters.pageSize ?? users.pageSize,
        editUserId: userId,
      });
    let activeUser = null;
    let activeUserError: string | null = null;

    if (activeUserId) {
      try {
        activeUser = await getAdminUserDetail(session.accessToken, activeUserId);
      } catch (error) {
        activeUserError =
          error instanceof ApiClientError ? error.message : 'Nao foi possivel carregar os dados deste usuario.';
      }
    }

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / usuarios"
          title="Usuarios"
          description="Acesso, papel, status e ajuste financeiro concentrados na mesma operacao."
          actions={
            <>
              <Link href={createPath} className="primary-action">
                + Novo usuario
              </Link>
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
            </>
          }
        />

        {users.items.length === 0 ? (
          <EmptyState title="Nenhum usuario encontrado" description="Ajuste os filtros." />
        ) : (
          <AdminSectionCard
            eyebrow="Usuarios"
            title="Lista operacional"
            description="Leitura direta para abrir edicao ou seguir para ajuste de carteira."
            meta={<span className="panel-meta">{users.totalItems} no total</span>}
          >
            <DataTable columns={['Nome', 'Email', 'Papel', 'Status', 'Acoes']}>
              {users.items.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="stack-list">
                      <strong>{user.name}</strong>
                      <span className="panel-meta">ID {user.id}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <StatusBadge label={user.role} tone={user.role === 'admin' ? 'info' : 'neutral'} />
                  </td>
                  <td>
                    <StatusBadge label={user.status} tone={user.status === 'active' ? 'success' : 'danger'} />
                  </td>
                  <td>
                    <Link href={editPath(user.id)} className="table-link">
                      Editar
                    </Link>
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
          </AdminSectionCard>
        )}

        {isCreateOpen ? (
          <AdminSlideOver eyebrow="Novo usuario" title="Criar usuario" closeHref={returnTo}>
            <AdminUserMutationForm mode="create" action={createUserAction} returnTo={returnTo} />
          </AdminSlideOver>
        ) : null}

        {activeUser ? (
          <AdminSlideOver
            eyebrow="Usuarios"
            title={activeUser.name}
            closeHref={returnTo}
          >
            <section className="admin-drawer-stack">
              <article className="admin-inline-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Editar usuario</p>
                    <h3>Cadastro</h3>
                    <p className="panel-description">Atualize acesso e dados principais sem sair da listagem.</p>
                  </div>
                  <div className="feedback-actions">
                    <StatusBadge label={activeUser.role} tone={activeUser.role === 'admin' ? 'info' : 'neutral'} />
                    <StatusBadge label={activeUser.status} tone={activeUser.status === 'active' ? 'success' : 'danger'} />
                  </div>
                </div>
                <AdminUserMutationForm mode="update" action={updateUserAction} returnTo={returnTo} user={activeUser} />
              </article>

              <article className="admin-inline-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Carteira</p>
                    <h3>Ajuste</h3>
                    <p className="panel-description">Credito ou debito manual com motivo explicito para rastreio.</p>
                  </div>
                </div>
                <AdminWalletAdjustmentForm action={createWalletAdjustmentAction} returnTo={returnTo} defaultUserId={activeUser.id} />
              </article>
            </section>
          </AdminSlideOver>
        ) : activeUserError ? (
          <AdminSlideOver eyebrow="Usuarios" title="Usuario indisponivel" description={activeUserError} closeHref={returnTo}>
            <ErrorState title="Nao foi possivel abrir este usuario" description="Feche o painel e tente novamente pela listagem." />
          </AdminSlideOver>
        ) : null}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar os usuarios"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar a lista de usuarios.'}
        />
      </main>
    );
  }
}
