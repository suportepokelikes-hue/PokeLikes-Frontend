import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/table';
import { listAdminAudits } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime } from '@/lib/format';
import type { AdminAuditsListParams } from '@/modules/admin-shell/query';
import { AdminFilterBar, AdminSummaryCard, PaginationSummary, renderAuditPayload } from '@/modules/admin-shell/shared';

type AdminAuditsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminAuditsListParams;
};

export async function AdminAuditsPage({ session, filters }: AdminAuditsPageProps) {
  try {
    const audits = await listAdminAudits(session.accessToken, filters);
    const distinctAdmins = new Set(audits.items.map((audit) => audit.admin.id)).size;
    const distinctEntities = new Set(audits.items.map((audit) => audit.entityType)).size;
    const latestEvent = audits.items[0]?.createdAt ?? null;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / auditoria"
          title="Auditoria"
          actions={
            <AdminFilterBar
              pathname="/admin/audits"
              fields={[
                { name: 'search', label: 'Busca', type: 'search', placeholder: 'Acao ou entidade', defaultValue: filters.search },
                { name: 'adminId', label: 'ID do admin', defaultValue: filters.adminId },
                { name: 'action', label: 'Acao', defaultValue: filters.action },
                { name: 'entityType', label: 'Entidade', defaultValue: filters.entityType },
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
          <AdminSummaryCard label="Na pagina" value={String(audits.items.length)} meta={`${audits.totalItems} no total`} />
          <AdminSummaryCard label="Admins distintos" value={String(distinctAdmins)} meta={`${distinctEntities} entidades`} tone="accent" />
          <AdminSummaryCard label="Ultimo evento" value={latestEvent ? formatDateTime(latestEvent) : '-'} />
        </section>

        {audits.items.length === 0 ? (
          <EmptyState title="Nenhum evento de auditoria" description="Ajuste os filtros." />
        ) : (
          <>
            <DataTable columns={['Acao', 'Entidade', 'Admin', 'Origem', 'Criado em', 'Payload']}>
              {audits.items.map((audit) => (
                <tr key={audit.id}>
                  <td>{audit.action}</td>
                  <td>
                    <div className="stack-list">
                      <strong>{audit.entityType}</strong>
                      <span className="panel-meta">{audit.entityId || 'Sem ID'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="stack-list">
                      <strong>{audit.admin.name}</strong>
                      <span className="panel-meta">{audit.admin.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="stack-list">
                      <span className="panel-meta">{audit.ip || 'IP nao informado'}</span>
                      <span className="panel-meta">{audit.userAgent || 'Agent nao informado'}</span>
                    </div>
                  </td>
                  <td>{formatDateTime(audit.createdAt)}</td>
                  <td>{renderAuditPayload(audit)}</td>
                </tr>
              ))}
            </DataTable>

            <PaginationSummary
              page={audits.page}
              pageSize={audits.pageSize}
              totalItems={audits.totalItems}
              totalPages={audits.totalPages}
              pathname="/admin/audits"
              params={{ ...filters, pageSize: filters.pageSize ?? audits.pageSize }}
              label="eventos"
            />
          </>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar a auditoria"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar os eventos de auditoria.'}
        />
      </main>
    );
  }
}
