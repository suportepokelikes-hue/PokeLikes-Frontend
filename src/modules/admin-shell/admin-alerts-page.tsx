import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listAdminAlerts } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime } from '@/lib/format';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { resolveAlertAction } from '@/modules/admin-shell/actions';
import {
  AdminFilterBar,
  AdminSummaryCard,
  JsonPreview,
  PaginationSummary,
  buildPathWithSearch,
  mapAlertSeverityTone,
  mapAlertStatusTone,
  renderAlertTimeline,
} from '@/modules/admin-shell/shared';
import type { AdminAlertsListParams } from '@/modules/admin-shell/query';

type AdminAlertsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminAlertsListParams;
};

export async function AdminAlertsPage({ session, filters }: AdminAlertsPageProps) {
  try {
    const alerts = await listAdminAlerts(session.accessToken, filters);
    const returnTo = buildPathWithSearch('/admin/alerts', filters);
    const openCount = alerts.items.filter((alert) => alert.status === 'open').length;
    const criticalCount = alerts.items.filter((alert) => alert.severity === 'critical' && alert.status === 'open').length;
    const resolvedCount = alerts.items.filter((alert) => alert.status === 'resolved').length;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / alertas"
          title="Central de alertas operacionais."
          description="A listagem mostra severidade, recorrencia e contexto retornados pelo backend sem esconder indisponibilidade ou degradacao."
          actions={
            <AdminFilterBar
              pathname="/admin/alerts"
              fields={[
                { name: 'search', label: 'Busca', type: 'search', placeholder: 'Titulo ou fingerprint', defaultValue: filters.search },
                {
                  name: 'status',
                  label: 'Status',
                  type: 'select',
                  defaultValue: filters.status,
                  options: [
                    { label: 'Aberto', value: 'open' },
                    { label: 'Resolvido', value: 'resolved' },
                  ],
                },
                {
                  name: 'severity',
                  label: 'Severidade',
                  type: 'select',
                  defaultValue: filters.severity,
                  options: [
                    { label: 'Info', value: 'info' },
                    { label: 'Warning', value: 'warning' },
                    { label: 'Critical', value: 'critical' },
                  ],
                },
                { name: 'type', label: 'Tipo', defaultValue: filters.type },
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
          <AdminSummaryCard label="Alertas na pagina" value={String(alerts.items.length)} meta={`${alerts.totalItems} registros no total`} />
          <AdminSummaryCard label="Criticos abertos" value={String(criticalCount)} meta={`${openCount} abertos nesta pagina`} tone="danger" />
          <AdminSummaryCard label="Resolvidos" value={String(resolvedCount)} meta="Historial recente de resolucao" tone="accent" />
        </section>

        {alerts.items.length === 0 ? (
          <EmptyState title="Nenhum alerta encontrado" description="Nenhum alerta foi encontrado com os filtros atuais." />
        ) : (
          <>
            <DataTable columns={['Severidade', 'Status', 'Detalhe', 'Ocorrencias', 'Timeline', 'Contexto', 'Acao']}>
              {alerts.items.map((alert) => (
                <tr key={alert.id}>
                  <td>
                    <StatusBadge label={alert.severity} tone={mapAlertSeverityTone(alert.severity)} />
                  </td>
                  <td>
                    <StatusBadge label={alert.status} tone={mapAlertStatusTone(alert.status)} />
                  </td>
                  <td>
                    <div className="stack-list">
                      <strong>{alert.title}</strong>
                      <span className="panel-meta">{alert.message}</span>
                      <span className="panel-meta">{alert.type} / {alert.fingerprint}</span>
                    </div>
                  </td>
                  <td>{alert.occurrenceCount}</td>
                  <td>
                    <div className="stack-list">
                      <span className="panel-meta">Primeiro evento em {formatDateTime(alert.firstOccurredAt)}</span>
                      <span className="panel-meta">{renderAlertTimeline(alert)}</span>
                    </div>
                  </td>
                  <td>
                    <JsonPreview value={alert.context} fallback="Sem contexto adicional" />
                  </td>
                  <td>
                    {alert.status === 'open' ? (
                      <AdminActionForm
                        action={resolveAlertAction}
                        submitLabel="Resolver"
                        pendingLabel="Resolvendo..."
                        tone={alert.severity === 'critical' ? 'danger' : 'secondary'}
                        returnTo={returnTo}
                        hiddenFields={[{ name: 'alertId', value: alert.id }]}
                      />
                    ) : (
                      <span className="panel-meta">Ja resolvido</span>
                    )}
                  </td>
                </tr>
              ))}
            </DataTable>

            <PaginationSummary
              page={alerts.page}
              pageSize={alerts.pageSize}
              totalItems={alerts.totalItems}
              totalPages={alerts.totalPages}
              pathname="/admin/alerts"
              params={{ ...filters, pageSize: filters.pageSize ?? alerts.pageSize }}
              label="alertas"
            />
          </>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar os alertas"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar a lista de alertas.'}
        />
      </main>
    );
  }
}
