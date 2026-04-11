import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listAdminAlerts } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { AlertResource, Money } from '@/lib/api/contracts';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
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

type SupplierFundsAlertContext = {
  orderId?: string | null;
  userId?: string | null;
  catalogServiceId?: string | null;
  serviceId?: string | number | null;
  serviceName?: string | null;
  quantity?: number | string | null;
  estimatedCost?: Money | null;
  link?: string | null;
  customerFundsReserved?: boolean | null;
  reservedAmount?: string | number | null;
  reservedCurrency?: string | null;
  occurredAt?: string | null;
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
                  <td>{renderAlertContext(alert)}</td>
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

function renderAlertContext(alert: AlertResource) {
  if (alert.type !== 'supplier_order_not_enough_funds') {
    return <JsonPreview value={alert.context} fallback="Sem contexto adicional" />;
  }

  const context = parseSupplierFundsAlertContext(alert.context);

  if (!context) {
    return <JsonPreview value={alert.context} fallback="Sem contexto adicional" />;
  }

  return (
    <div className="alert-context-grid">
      {context.customerFundsReserved ? <span className="status-badge status-warning">Saldo do cliente reservado</span> : null}
      {context.orderId ? (
        <div>
          <span>Pedido</span>
          <strong>
            <Link href={`/admin/orders/${context.orderId}`} className="table-link">
              {context.orderId}
            </Link>
          </strong>
        </div>
      ) : null}
      {context.serviceName ? (
        <div>
          <span>Servico</span>
          <strong>{context.serviceName}</strong>
        </div>
      ) : null}
      {context.quantity != null ? (
        <div>
          <span>Quantidade</span>
          <strong>{String(context.quantity)}</strong>
        </div>
      ) : null}
      {(context.reservedAmount != null || context.reservedCurrency) ? (
        <div>
          <span>Reserva do cliente</span>
          <strong>{formatReservedAmount(context)}</strong>
        </div>
      ) : null}
      {context.estimatedCost ? (
        <div>
          <span>Custo estimado</span>
          <strong>{formatMoney(context.estimatedCost)}</strong>
        </div>
      ) : null}
      {context.userId ? (
        <div>
          <span>Usuario</span>
          <strong>{context.userId}</strong>
        </div>
      ) : null}
      {context.serviceId != null ? (
        <div>
          <span>Servico no fornecedor</span>
          <strong>{String(context.serviceId)}</strong>
        </div>
      ) : null}
      {context.catalogServiceId ? (
        <div>
          <span>Servico do catalogo</span>
          <strong>{context.catalogServiceId}</strong>
        </div>
      ) : null}
      {context.occurredAt ? (
        <div>
          <span>Ocorrido em</span>
          <strong>{formatDateTime(context.occurredAt)}</strong>
        </div>
      ) : null}
      {context.link ? (
        <div className="alert-context-wide">
          <span>Link</span>
          <strong className="code-block">{context.link}</strong>
        </div>
      ) : null}
    </div>
  );
}

function parseSupplierFundsAlertContext(value: unknown): SupplierFundsAlertContext | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as SupplierFundsAlertContext;
}

function formatReservedAmount(context: SupplierFundsAlertContext) {
  if (context.reservedAmount == null) {
    return context.reservedCurrency ?? '-';
  }

  if (!context.reservedCurrency) {
    return String(context.reservedAmount);
  }

  return `${context.reservedAmount} ${context.reservedCurrency}`;
}
