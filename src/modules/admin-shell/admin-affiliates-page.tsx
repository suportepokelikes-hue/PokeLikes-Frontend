import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listAdminAffiliates } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime } from '@/lib/format';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { approveAffiliateAction, suspendAffiliateAction } from '@/modules/admin-shell/actions';
import type { AdminAffiliateProfilesListParams } from '@/modules/admin-shell/query';
import {
  AdminFilterBar,
  AdminSummaryCard,
  PaginationSummary,
  buildPathWithSearch,
  mapAffiliateStatusTone,
} from '@/modules/admin-shell/shared';

type AdminAffiliatesPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminAffiliateProfilesListParams;
};

export async function AdminAffiliatesPage({ session, filters }: AdminAffiliatesPageProps) {
  try {
    const affiliates = await listAdminAffiliates(session.accessToken, filters);
    const returnTo = buildPathWithSearch('/admin/affiliates', filters);
    const pendingCount = affiliates.items.filter((profile) => profile.status === 'pending').length;
    const activeCount = affiliates.items.filter((profile) => profile.status === 'active').length;
    const suspendedCount = affiliates.items.filter((profile) => profile.status === 'suspended').length;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / afiliados"
          title="Perfis afiliados"
          actions={
            <AdminFilterBar
              pathname="/admin/affiliates"
              fields={[
                {
                  name: 'search',
                  label: 'Busca',
                  type: 'search',
                  placeholder: 'ID, codigo ou usuario',
                  defaultValue: filters.search,
                },
                {
                  name: 'status',
                  label: 'Status',
                  type: 'select',
                  defaultValue: filters.status,
                  options: [
                    { label: 'Pendente', value: 'pending' },
                    { label: 'Ativo', value: 'active' },
                    { label: 'Suspenso', value: 'suspended' },
                  ],
                },
                {
                  name: 'sortOrder',
                  label: 'Ordem',
                  type: 'select',
                  defaultValue: filters.sortOrder ?? 'desc',
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

        <section className="metric-list">
          <AdminSummaryCard label="Na pagina" value={String(affiliates.items.length)} meta={`${affiliates.totalItems} no total`} />
          <AdminSummaryCard label="Pendentes" value={String(pendingCount)} tone="warning" />
          <AdminSummaryCard label="Ativos / suspensos" value={`${activeCount} / ${suspendedCount}`} meta="Estado atual" />
        </section>

        {affiliates.items.length === 0 ? (
          <EmptyState title="Nenhum perfil afiliado encontrado" description="Ajuste os filtros." />
        ) : (
          <>
            <DataTable columns={['ID', 'Codigo publico', 'Usuario', 'Status', 'Aprovado em', 'Suspenso em', 'Criado em', 'Acao']}>
              {affiliates.items.map((profile) => (
                <tr key={profile.id}>
                  <td>{profile.id}</td>
                  <td>
                    <div className="stack-list">
                      <strong>{profile.affiliateCode}</strong>
                      <span className="panel-meta">{profile.affiliateCommissionPercent}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="stack-list">
                      <strong>{profile.user?.id || 'Sem referencia'}</strong>
                      <span className="panel-meta">{profile.user?.email || '-'}</span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge label={profile.status} tone={mapAffiliateStatusTone(profile.status)} />
                  </td>
                  <td>{formatDateTime(profile.approvedAt)}</td>
                  <td>{formatDateTime(profile.suspendedAt)}</td>
                  <td>{formatDateTime(profile.createdAt)}</td>
                  <td>{renderAffiliateActions(profile.id, profile.status, returnTo)}</td>
                </tr>
              ))}
            </DataTable>

            <PaginationSummary
              page={affiliates.page}
              pageSize={affiliates.pageSize}
              totalItems={affiliates.totalItems}
              totalPages={affiliates.totalPages}
              pathname="/admin/affiliates"
              params={{ ...filters, pageSize: filters.pageSize ?? affiliates.pageSize }}
              label="perfis afiliados"
            />
          </>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar os perfis afiliados"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar a lista de afiliados.'}
        />
      </main>
    );
  }
}

function renderAffiliateActions(affiliateProfileId: string, status: string, returnTo: string) {
  if (status === 'pending') {
    return (
      <div className="stack-list">
        <AdminActionForm
          action={approveAffiliateAction}
          submitLabel="Aprovar"
          pendingLabel="Aprovando..."
          tone="primary"
          returnTo={returnTo}
          hiddenFields={[{ name: 'affiliateProfileId', value: affiliateProfileId }]}
        />
        <AdminActionForm
          action={suspendAffiliateAction}
          submitLabel="Suspender"
          pendingLabel="Suspendendo..."
          tone="danger"
          returnTo={returnTo}
          hiddenFields={[{ name: 'affiliateProfileId', value: affiliateProfileId }]}
        />
      </div>
    );
  }

  if (status === 'active') {
    return (
      <AdminActionForm
        action={suspendAffiliateAction}
        submitLabel="Suspender"
        pendingLabel="Suspendendo..."
        tone="danger"
        returnTo={returnTo}
        hiddenFields={[{ name: 'affiliateProfileId', value: affiliateProfileId }]}
      />
    );
  }

  return <span className="panel-meta">Sem acao</span>;
}
