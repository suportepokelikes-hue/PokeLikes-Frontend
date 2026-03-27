import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/table';
import { listAdminAudits } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime } from '@/lib/format';
import { AdminSummaryCard, PaginationSummary, renderAuditPayload } from '@/modules/admin-shell/shared';

type AdminAuditsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function AdminAuditsPage({ session }: AdminAuditsPageProps) {
  try {
    const audits = await listAdminAudits(session.accessToken);
    const distinctAdmins = new Set(audits.items.map((audit) => audit.admin.id)).size;
    const distinctEntities = new Set(audits.items.map((audit) => audit.entityType)).size;
    const latestEvent = audits.items[0]?.createdAt ?? null;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / auditoria"
          title="Rastro de acoes administrativas."
          description="A auditoria expande a observabilidade do admin com entidade afetada, operador, origem da requisicao e payload resumido."
        />

        <section className="metric-list">
          <AdminSummaryCard label="Eventos na pagina" value={String(audits.items.length)} meta={`${audits.totalItems} registros no total`} />
          <AdminSummaryCard label="Admins distintos" value={String(distinctAdmins)} meta={`${distinctEntities} tipos de entidade`} tone="accent" />
          <AdminSummaryCard label="Ultimo evento" value={latestEvent ? formatDateTime(latestEvent) : '-'} meta="Ordenacao descendente por data" />
        </section>

        {audits.items.length === 0 ? (
          <EmptyState title="Nenhum evento de auditoria" description="A API nao retornou logs de auditoria para esta consulta." />
        ) : (
          <>
            <DataTable columns={['Acao', 'Entidade', 'Admin', 'Origem', 'Criado em', 'Payload']}>
              {audits.items.map((audit) => (
                <tr key={audit.id}>
                  <td>{audit.action}</td>
                  <td>
                    <div className="stack-list">
                      <strong>{audit.entityType}</strong>
                      <span className="panel-meta">{audit.entityId || 'Sem entityId'}</span>
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
                      <span className="panel-meta">{audit.userAgent || 'User-Agent nao informado'}</span>
                    </div>
                  </td>
                  <td>{formatDateTime(audit.createdAt)}</td>
                  <td>{renderAuditPayload(audit)}</td>
                </tr>
              ))}
            </DataTable>

            <PaginationSummary page={audits.page} pageSize={audits.pageSize} totalItems={audits.totalItems} label="eventos" />
          </>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar a auditoria"
          description={error instanceof ApiClientError ? error.message : 'A API nao retornou os logs administrativos de auditoria.'}
        />
      </main>
    );
  }
}
