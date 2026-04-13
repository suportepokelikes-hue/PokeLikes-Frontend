import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { getAdminDashboardSummary } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatCompactNumber, formatDateTime, formatMoney } from '@/lib/format';

type AdminDashboardPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function AdminDashboardPage({ session }: AdminDashboardPageProps) {
  try {
    const summary = await getAdminDashboardSummary(session.accessToken);

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / resumo"
          title="Resumo"
        />

        <section className="metric-list">
          <StatCard label="Usuarios" value={formatCompactNumber(summary.users.total)} meta={`${summary.users.active} ativos`} />
          <StatCard label="Volume confirmado" value={formatMoney(summary.payments.confirmedVolume)} tone="accent" />
          <StatCard label="Alertas abertos" value={formatCompactNumber(summary.alerts.counts.open)} tone="warning" />
        </section>

        <section className="dashboard-grid">
          <article className="detail-card">
            <div className="panel-heading">
              <h2>Alertas mais recentes</h2>
              <span className="panel-meta">{formatDateTime(summary.generatedAt)}</span>
            </div>

            {summary.alerts.latestOpen.length === 0 ? (
              <p className="section-copy">Sem alertas abertos.</p>
            ) : (
              <div className="stack-list">
                {summary.alerts.latestOpen.map((alert) => (
                  <div key={alert.id} className="stack-item">
                    <div className="stack-item-head">
                      <strong>{alert.title}</strong>
                      <StatusBadge label={alert.severity} tone={mapSeverityTone(alert.severity)} />
                    </div>
                    <p>{alert.message}</p>
                    <span>{alert.occurrenceCount} ocorrencias · {formatDateTime(alert.lastOccurredAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="detail-card">
            <div className="panel-heading">
              <h2>Fornecedores</h2>
              <span className="panel-meta">{summary.suppliers.counts.total} monitorados</span>
            </div>

            <DataTable columns={['Fornecedor', 'Status', 'Saldo', 'Ultima checagem']}>
              {summary.suppliers.providers.map((provider) => (
                <tr key={provider.supplierName}>
                  <td>{provider.supplierName}</td>
                  <td>
                    <StatusBadge label={provider.operationalStatus} tone={mapProviderTone(provider.operationalStatus)} />
                  </td>
                  <td>{formatMoney(provider.balance)}</td>
                  <td>{formatDateTime(provider.lastCheckedAt)}</td>
                </tr>
              ))}
            </DataTable>
          </article>
        </section>
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar o dashboard administrativo"
          description={getErrorMessage(error, 'Nao foi possivel buscar o resumo do admin.')}
        />
      </main>
    );
  }
}

function mapSeverityTone(severity: string) {
  if (severity === 'critical') {
    return 'danger';
  }

  if (severity === 'warning') {
    return 'warning';
  }

  return 'info';
}

function mapProviderTone(status: string) {
  if (status === 'healthy') {
    return 'success';
  }

  if (status === 'degraded_low_balance') {
    return 'warning';
  }

  return 'danger';
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiClientError) {
    return error.message || fallback;
  }

  return fallback;
}
