import { AlertTriangle, BellRing, CreditCard, FolderKanban, ReceiptText, ShieldCheck, ShieldX, Users, Wallet } from 'lucide-react';
import Link from 'next/link';

import { AdminMetricCard, AdminQuickLinkCard, AdminSectionCard } from '@/components/ui/admin-surfaces';
import { ErrorState } from '@/components/ui/error-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { getAdminDashboardSummary } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatCompactNumber, formatDateTime, formatMoney } from '@/lib/format';

import { mapAlertSeverityTone, mapProviderTone } from './shared';

type AdminDashboardPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function AdminDashboardPage({ session }: AdminDashboardPageProps) {
  try {
    const summary = await getAdminDashboardSummary(session.accessToken);
    const supplierAttention = summary.suppliers.counts.degraded + summary.suppliers.counts.unavailable;
    const providers = summary.suppliers.providers.slice(0, 5);

    const quickLinks = [
      {
        href: '/admin/alerts',
        icon: BellRing,
        title: 'Alertas',
        meta: `${formatCompactNumber(summary.alerts.counts.open)} abertos`,
        tone: summary.alerts.openBySeverity.critical > 0 ? 'danger' : 'default',
      },
      {
        href: '/admin/orders',
        icon: ReceiptText,
        title: 'Pedidos',
        meta: `${formatCompactNumber(summary.orders.mutableCount)} ativos`,
        tone: summary.orders.counts.queued_supplier_balance > 0 ? 'warning' : 'default',
      },
      {
        href: '/admin/payments',
        icon: CreditCard,
        title: 'Pagamentos',
        meta: `${formatCompactNumber(summary.payments.counts.pending)} pendentes`,
        tone: summary.payments.counts.pending > 0 ? 'warning' : 'default',
      },
      {
        href: '/admin/users',
        icon: Users,
        title: 'Usuarios',
        meta: `${formatCompactNumber(summary.users.active)} ativos`,
      },
      {
        href: '/admin/catalog',
        icon: FolderKanban,
        title: 'Catalogo',
        meta: `${formatCompactNumber(summary.catalog.active)} ativos`,
      },
      {
        href: '/admin/supplier',
        icon: supplierAttention > 0 ? ShieldX : ShieldCheck,
        title: 'Fornecedores',
        meta: `${formatCompactNumber(supplierAttention)} com atencao`,
        tone: supplierAttention > 0 ? 'warning' : 'default',
      },
    ] as const;

    return (
      <main className="page page-admin admin-dashboard-page">
        <section className="admin-dashboard-hero">
          <article className="admin-dashboard-command">
            <div className="admin-dashboard-command-head">
              <div className="admin-dashboard-command-copy">
                <h2>Centro de operacao</h2>
                <p>Fila, pagamentos e fornecedores.</p>
              </div>
              <div className="admin-dashboard-command-pills">
                <span className="admin-dashboard-pill">
                  <BellRing size={14} strokeWidth={2.1} aria-hidden="true" />
                  {formatCompactNumber(summary.alerts.counts.open)} alertas
                </span>
                <span className="admin-dashboard-pill">
                  <ReceiptText size={14} strokeWidth={2.1} aria-hidden="true" />
                  {formatCompactNumber(summary.orders.mutableCount)} pedidos
                </span>
                <span className="admin-dashboard-pill">
                  <CreditCard size={14} strokeWidth={2.1} aria-hidden="true" />
                  {formatCompactNumber(summary.payments.counts.pending)} PIX
                </span>
              </div>
            </div>

            <div className="admin-dashboard-strip-grid">
              <div>
                <span>Volume confirmado</span>
                <strong>{formatMoney(summary.payments.confirmedVolume)}</strong>
              </div>
              <div>
                <span>Wallet</span>
                <strong>{formatMoney(summary.wallet.totalAvailableBalance)}</strong>
              </div>
              <div>
                <span>Catalogo</span>
                <strong>{formatCompactNumber(summary.catalog.active)}</strong>
              </div>
              <div>
                <span>Atualizado</span>
                <strong>{formatDateTime(summary.generatedAt)}</strong>
              </div>
            </div>
          </article>

          <AdminSectionCard
            title="Prioridades"
            meta={<span className="panel-meta">{formatDateTime(summary.generatedAt)}</span>}
            actions={
              <>
                <Link href="/admin/alerts" className="primary-action" prefetch={false}>
                  Ver alertas
                </Link>
                <Link href="/admin/orders" className="secondary-action" prefetch={false}>
                  Ver pedidos
                </Link>
              </>
            }
          >
            <div className="admin-dashboard-priority-grid">
              <div>
                <span>Criticos</span>
                <strong>{formatCompactNumber(summary.alerts.openBySeverity.critical)}</strong>
              </div>
              <div>
                <span>Fila</span>
                <strong>{formatCompactNumber(summary.orders.mutableCount)}</strong>
              </div>
              <div>
                <span>Saldo fornecedor</span>
                <strong>{formatCompactNumber(summary.orders.counts.queued_supplier_balance)}</strong>
              </div>
              <div>
                <span>PIX pendentes</span>
                <strong>{formatCompactNumber(summary.payments.counts.pending)}</strong>
              </div>
            </div>
          </AdminSectionCard>
        </section>

        <section className="admin-dashboard-metrics">
          <AdminMetricCard
            label="Usuarios ativos"
            value={formatCompactNumber(summary.users.active)}
            meta={`${formatCompactNumber(summary.users.total)} total`}
            icon={Users}
            tone="info"
          />
          <AdminMetricCard
            label="Volume confirmado"
            value={formatMoney(summary.payments.confirmedVolume)}
            meta={`${formatCompactNumber(summary.payments.counts.confirmed)} confirmados`}
            icon={Wallet}
            tone="accent"
          />
          <AdminMetricCard
            label="Pedidos mutaveis"
            value={formatCompactNumber(summary.orders.mutableCount)}
            meta={`${formatCompactNumber(summary.orders.counts.pending)} pendentes`}
            icon={ReceiptText}
            tone="warning"
          />
          <AdminMetricCard
            label="Alertas"
            value={formatCompactNumber(summary.alerts.counts.open)}
            meta={`${formatCompactNumber(summary.alerts.openBySeverity.critical)} criticos`}
            icon={AlertTriangle}
            tone={summary.alerts.openBySeverity.critical > 0 ? 'danger' : 'warning'}
          />
          <AdminMetricCard
            label="Fornecedores"
            value={formatCompactNumber(summary.suppliers.counts.healthy)}
            meta={`${formatCompactNumber(summary.suppliers.counts.total)} monitorados`}
            icon={ShieldCheck}
            tone={supplierAttention > 0 ? 'warning' : 'success'}
          />
        </section>

        <section className="admin-dashboard-grid">
          <AdminSectionCard title="Modulos">
            <div className="admin-dashboard-quick-grid">
              {quickLinks.map((item) => (
                <AdminQuickLinkCard key={item.href} {...item} description="" />
              ))}
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="Alertas abertos"
            actions={
              <Link href="/admin/alerts" className="secondary-action" prefetch={false}>
                Abrir lista
              </Link>
            }
          >
            {summary.alerts.latestOpen.length === 0 ? (
              <div className="admin-inline-panel">
                <strong>Sem alertas abertos.</strong>
              </div>
            ) : (
              <div className="stack-list">
                {summary.alerts.latestOpen.map((alert) => (
                  <div key={alert.id} className="stack-item">
                    <div className="stack-item-head">
                      <strong>{alert.title}</strong>
                      <StatusBadge label={alert.severity} tone={mapAlertSeverityTone(alert.severity)} />
                    </div>
                    <span>
                      {formatCompactNumber(alert.occurrenceCount)} ocorrencias - {formatDateTime(alert.lastOccurredAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </AdminSectionCard>
        </section>

        <section className="admin-dashboard-grid">
          <AdminSectionCard
            title="Fornecedores"
            actions={
              <Link href="/admin/supplier" className="secondary-action" prefetch={false}>
                Abrir fornecedores
              </Link>
            }
          >
            <div className="admin-dashboard-health-grid">
              <div>
                <span>Saudaveis</span>
                <strong>{formatCompactNumber(summary.suppliers.counts.healthy)}</strong>
              </div>
              <div>
                <span>Degradados</span>
                <strong>{formatCompactNumber(summary.suppliers.counts.degraded)}</strong>
              </div>
              <div>
                <span>Indisponiveis</span>
                <strong>{formatCompactNumber(summary.suppliers.counts.unavailable)}</strong>
              </div>
            </div>

            <DataTable columns={['Fornecedor', 'Status', 'Resumo', 'Ultima checagem']}>
              {providers.map((provider) => (
                <tr key={provider.supplierName}>
                  <td>{provider.supplierName}</td>
                  <td>
                    <StatusBadge label={provider.operationalStatus} tone={mapProviderTone(provider.operationalStatus)} />
                  </td>
                  <td>{summarizeDashboardProvider(provider)}</td>
                  <td>{formatDateTime(provider.lastCheckedAt)}</td>
                </tr>
              ))}
            </DataTable>
          </AdminSectionCard>

          <AdminSectionCard
            title="Fila e financeiro"
            actions={
              <div className="feedback-actions">
                <Link href="/admin/orders" className="secondary-action" prefetch={false}>
                  Pedidos
                </Link>
                <Link href="/admin/payments" className="secondary-action" prefetch={false}>
                  Pagamentos
                </Link>
              </div>
            }
          >
            <div className="admin-dashboard-inline-stats">
              <div>
                <span>Pedidos</span>
                <strong>{formatCompactNumber(summary.orders.mutableCount)}</strong>
              </div>
              <div>
                <span>Saldo fornecedor</span>
                <strong>{formatCompactNumber(summary.orders.counts.queued_supplier_balance)}</strong>
              </div>
              <div>
                <span>PIX pendentes</span>
                <strong>{formatCompactNumber(summary.payments.counts.pending)}</strong>
              </div>
              <div>
                <span>Falhas</span>
                <strong>{formatCompactNumber(summary.payments.counts.expired + summary.payments.counts.failed)}</strong>
              </div>
            </div>
          </AdminSectionCard>
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

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiClientError) {
    return error.message || fallback;
  }

  return fallback;
}

function summarizeDashboardProvider(provider: {
  operationalStatus: 'healthy' | 'degraded_low_balance' | 'unavailable';
  lastErrorCode: string | null;
}) {
  if (provider.operationalStatus === 'healthy') {
    return 'Saudavel';
  }

  if (provider.operationalStatus === 'degraded_low_balance') {
    return provider.lastErrorCode ? `Baixo saldo - ${provider.lastErrorCode}` : 'Baixo saldo';
  }

  return provider.lastErrorCode ? `Indisponivel - ${provider.lastErrorCode}` : 'Indisponivel';
}
