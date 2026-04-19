import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  CreditCard,
  FolderKanban,
  ReceiptText,
  ShieldCheck,
  ShieldX,
  Users,
  Wallet,
} from 'lucide-react';
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

    const priorities = [
      {
        label: 'Criticos abertos',
        value: formatCompactNumber(summary.alerts.openBySeverity.critical),
        meta:
          summary.alerts.openBySeverity.critical > 0
            ? 'Revisar alertas com impacto operacional.'
            : 'Nenhum alerta critico agora.',
      },
      {
        label: 'Pedidos em fila',
        value: formatCompactNumber(summary.orders.mutableCount),
        meta:
          summary.orders.counts.queued_supplier_balance > 0
            ? `${summary.orders.counts.queued_supplier_balance} aguardando saldo do fornecedor.`
            : 'Fila sem bloqueio por saldo do fornecedor.',
      },
      {
        label: 'Pendencias financeiras',
        value: formatCompactNumber(summary.payments.counts.pending),
        meta:
          summary.payments.counts.pending > 0
            ? 'PIX aguardando confirmacao ou acompanhamento.'
            : 'Sem pagamentos pendentes.',
      },
    ];

    const quickLinks = [
      {
        href: '/admin/alerts',
        icon: BellRing,
        title: 'Alertas',
        description: 'Incidentes, severidade e ocorrencias recentes.',
        meta: `${formatCompactNumber(summary.alerts.counts.open)} abertos`,
        tone: summary.alerts.openBySeverity.critical > 0 ? 'danger' : 'default',
      },
      {
        href: '/admin/orders',
        icon: ReceiptText,
        title: 'Pedidos',
        description: 'Fila, estados mutaveis e sincronizacao.',
        meta: `${formatCompactNumber(summary.orders.mutableCount)} ativos`,
        tone: summary.orders.counts.queued_supplier_balance > 0 ? 'warning' : 'default',
      },
      {
        href: '/admin/payments',
        icon: CreditCard,
        title: 'Pagamentos',
        description: 'Conciliacao, status e volume confirmado.',
        meta: `${formatCompactNumber(summary.payments.counts.pending)} pendentes`,
        tone: summary.payments.counts.pending > 0 ? 'warning' : 'default',
      },
      {
        href: '/admin/users',
        icon: Users,
        title: 'Usuarios',
        description: 'Acesso, status de conta e carteira.',
        meta: `${formatCompactNumber(summary.users.active)} ativos`,
      },
      {
        href: '/admin/catalog',
        icon: FolderKanban,
        title: 'Catalogo',
        description: 'Publicacao, afiliacao e disponibilidade.',
        meta: `${formatCompactNumber(summary.catalog.active)} ativos`,
      },
      {
        href: '/admin/supplier',
        icon: supplierAttention > 0 ? ShieldX : ShieldCheck,
        title: 'Fornecedores',
        description: 'Saude operacional, sync e saldo.',
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
                <p className="eyebrow">Admin / central</p>
                <h2>Centro de operacao</h2>
                <p>Leitura rapida da fila, dos pagamentos e da saude do ecossistema em um unico ponto.</p>
              </div>
              <div className="admin-dashboard-command-pills">
                <span className="admin-dashboard-pill">
                  <BellRing size={14} strokeWidth={2.1} aria-hidden="true" />
                  {formatCompactNumber(summary.alerts.counts.open)} alertas
                </span>
                <span className="admin-dashboard-pill">
                  <ReceiptText size={14} strokeWidth={2.1} aria-hidden="true" />
                  {formatCompactNumber(summary.orders.mutableCount)} pedidos ativos
                </span>
                <span className="admin-dashboard-pill">
                  <CreditCard size={14} strokeWidth={2.1} aria-hidden="true" />
                  {formatCompactNumber(summary.payments.counts.pending)} PIX pendentes
                </span>
              </div>
            </div>

            <div className="admin-dashboard-strip-grid">
              <div>
                <span>Volume confirmado</span>
                <strong>{formatMoney(summary.payments.confirmedVolume)}</strong>
                <p>Receita conciliada no fluxo financeiro.</p>
              </div>
              <div>
                <span>Wallet consolidada</span>
                <strong>{formatMoney(summary.wallet.totalAvailableBalance)}</strong>
                <p>Saldo disponivel em carteiras monitoradas.</p>
              </div>
              <div>
                <span>Catalogo ativo</span>
                <strong>{formatCompactNumber(summary.catalog.active)}</strong>
                <p>Servicos publicados e prontos para venda.</p>
              </div>
              <div>
                <span>Gerado em</span>
                <strong>{formatDateTime(summary.generatedAt)}</strong>
                <p>Snapshot operacional mais recente do admin.</p>
              </div>
            </div>

            <div className="admin-dashboard-inline-stats">
              <div>
                <span>Info</span>
                <strong>{formatCompactNumber(summary.alerts.openBySeverity.info)}</strong>
                <p>Alertas informativos ainda abertos.</p>
              </div>
              <div>
                <span>Warning</span>
                <strong>{formatCompactNumber(summary.alerts.openBySeverity.warning)}</strong>
                <p>Sinais que merecem acompanhamento agora.</p>
              </div>
              <div>
                <span>Critico</span>
                <strong>{formatCompactNumber(summary.alerts.openBySeverity.critical)}</strong>
                <p>Itens com potencial de impacto operacional.</p>
              </div>
            </div>
          </article>

          <AdminSectionCard
            eyebrow="Prioridades"
            title="O que exige atencao"
            description="O painel destaca fila, incidentes e pendencias financeiras antes do resto."
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
              {priorities.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.meta}</p>
                </div>
              ))}
            </div>
          </AdminSectionCard>
        </section>

        <section className="admin-dashboard-metrics">
          <AdminMetricCard
            label="Usuarios ativos"
            value={formatCompactNumber(summary.users.active)}
            meta={`${formatCompactNumber(summary.users.total)} contas totais`}
            icon={Users}
            tone="info"
          />
          <AdminMetricCard
            label="Volume confirmado"
            value={formatMoney(summary.payments.confirmedVolume)}
            meta={`${formatCompactNumber(summary.payments.counts.confirmed)} pagamentos confirmados`}
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
            label="Alertas abertos"
            value={formatCompactNumber(summary.alerts.counts.open)}
            meta={`${formatCompactNumber(summary.alerts.openBySeverity.critical)} criticos`}
            icon={AlertTriangle}
            tone={summary.alerts.openBySeverity.critical > 0 ? 'danger' : 'warning'}
          />
          <AdminMetricCard
            label="Fornecedores saudaveis"
            value={formatCompactNumber(summary.suppliers.counts.healthy)}
            meta={`${formatCompactNumber(summary.suppliers.counts.total)} monitorados`}
            icon={ShieldCheck}
            tone={supplierAttention > 0 ? 'warning' : 'success'}
          />
        </section>

        <section className="admin-dashboard-grid">
          <AdminSectionCard
            eyebrow="Atalhos"
            title="Modulos criticos"
            description="Entradas rapidas para os fluxos mais usados do dia a dia."
          >
            <div className="admin-dashboard-quick-grid">
              {quickLinks.map((item) => (
                <AdminQuickLinkCard key={item.href} {...item} />
              ))}
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            eyebrow="Alertas"
            title="Alertas abertos"
            description="Ocorrencias recentes com contexto de severidade e frequencia."
            actions={
              <Link href="/admin/alerts" className="secondary-action" prefetch={false}>
                Abrir lista
              </Link>
            }
          >
            {summary.alerts.latestOpen.length === 0 ? (
              <div className="admin-inline-panel">
                <strong>Sem alertas abertos.</strong>
                <p className="section-copy">O sistema nao reportou incidentes pendentes neste momento.</p>
              </div>
            ) : (
              <div className="stack-list">
                {summary.alerts.latestOpen.map((alert) => (
                  <div key={alert.id} className="stack-item">
                    <div className="stack-item-head">
                      <strong>{alert.title}</strong>
                      <StatusBadge label={alert.severity} tone={mapAlertSeverityTone(alert.severity)} />
                    </div>
                    <p>{alert.message}</p>
                    <span>{formatCompactNumber(alert.occurrenceCount)} ocorrencias - {formatDateTime(alert.lastOccurredAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </AdminSectionCard>
        </section>

        <section className="admin-dashboard-grid">
          <AdminSectionCard
            eyebrow="Fornecedores"
            title="Saude da integracao"
            description="Balance rapido da camada de fornecedores com ultimo status conhecido."
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
                <p>Fluxo normal.</p>
              </div>
              <div>
                <span>Degradados</span>
                <strong>{formatCompactNumber(summary.suppliers.counts.degraded)}</strong>
                <p>Baixo saldo ou sinal de risco.</p>
              </div>
              <div>
                <span>Indisponiveis</span>
                <strong>{formatCompactNumber(summary.suppliers.counts.unavailable)}</strong>
                <p>Requer intervencao ou monitoramento.</p>
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

          <div className="admin-dashboard-side">
            <AdminSectionCard
              eyebrow="Pedidos"
              title="Fila operacional"
              description="Leitura compacta dos estados que mais afetam a operacao."
              actions={
                <Link href="/admin/orders" className="secondary-action" prefetch={false}>
                  Abrir pedidos
                </Link>
              }
            >
              <div className="admin-dashboard-inline-stats">
                <div>
                  <span>Pending</span>
                  <strong>{formatCompactNumber(summary.orders.counts.pending)}</strong>
                  <p>Aguardando processamento.</p>
                </div>
                <div>
                  <span>Submitted</span>
                  <strong>{formatCompactNumber(summary.orders.counts.submitted)}</strong>
                  <p>Encaminhados ao fornecedor.</p>
                </div>
                <div>
                  <span>Queued supplier balance</span>
                  <strong>{formatCompactNumber(summary.orders.counts.queued_supplier_balance)}</strong>
                  <p>Bloqueados por saldo do fornecedor.</p>
                </div>
              </div>
            </AdminSectionCard>

            <AdminSectionCard
              eyebrow="Pagamentos"
              title="Conciliacao e status"
              description="Volume confirmado e pagamentos que ainda exigem leitura."
              actions={
                <Link href="/admin/payments" className="secondary-action" prefetch={false}>
                  Abrir pagamentos
                </Link>
              }
            >
              <div className="admin-dashboard-inline-stats">
                <div>
                  <span>Pending</span>
                  <strong>{formatCompactNumber(summary.payments.counts.pending)}</strong>
                  <p>PIX aguardando resolucao.</p>
                </div>
                <div>
                  <span>Confirmed</span>
                  <strong>{formatCompactNumber(summary.payments.counts.confirmed)}</strong>
                  <p>Fluxo confirmado no backend.</p>
                </div>
                <div>
                  <span>Expired + failed</span>
                  <strong>{formatCompactNumber(summary.payments.counts.expired + summary.payments.counts.failed)}</strong>
                  <p>Casos que podem pedir revisao manual.</p>
                </div>
              </div>
            </AdminSectionCard>
          </div>
        </section>

        <section className="admin-dashboard-priority-row">
          <Link href="/admin/alerts" className="admin-dashboard-pill" prefetch={false}>
            <BellRing size={14} strokeWidth={2.1} aria-hidden="true" />
            Alertas
            <ArrowRight size={14} strokeWidth={2.1} aria-hidden="true" />
          </Link>
          <Link href="/admin/orders" className="admin-dashboard-pill" prefetch={false}>
            <ReceiptText size={14} strokeWidth={2.1} aria-hidden="true" />
            Pedidos
            <ArrowRight size={14} strokeWidth={2.1} aria-hidden="true" />
          </Link>
          <Link href="/admin/payments" className="admin-dashboard-pill" prefetch={false}>
            <CreditCard size={14} strokeWidth={2.1} aria-hidden="true" />
            Pagamentos
            <ArrowRight size={14} strokeWidth={2.1} aria-hidden="true" />
          </Link>
          <Link href="/admin/supplier" className="admin-dashboard-pill" prefetch={false}>
            <ShieldCheck size={14} strokeWidth={2.1} aria-hidden="true" />
            Fornecedores
            <ArrowRight size={14} strokeWidth={2.1} aria-hidden="true" />
          </Link>
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
