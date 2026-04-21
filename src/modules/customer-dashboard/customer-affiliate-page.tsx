import Link from 'next/link';
import { Gift, LineChart, Rocket, TicketPercent } from 'lucide-react';

import { CustomerMetricCard, CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import {
  getCustomerAffiliateProfile,
  getCustomerAffiliatePix,
  getCustomerAffiliateSummary,
  listCustomerAffiliateCommissions,
} from '@/lib/api/customer';
import { getAffiliateDisplayCode } from '@/lib/api/affiliate-normalizers';
import type { AffiliateCommissionResource, AffiliateProfileResource, Money } from '@/lib/api/contracts';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney, formatNumber } from '@/lib/format';
import { AffiliateApplyForm } from './affiliate-apply-form';
import { AffiliatePixForm } from './affiliate-pix-form';

type CustomerAffiliatePageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

type SummaryMetricValue = number | Money | undefined;

export async function CustomerAffiliatePage({ session }: CustomerAffiliatePageProps) {
  try {
    const affiliateProfile = await getCustomerAffiliateProfile({ accessToken: session.accessToken });

    if (!affiliateProfile) {
      return (
        <main className="page page-customer">
          <PageHeader
            eyebrow="Afiliados"
            title="Programa de afiliados"
            compact
            actions={
              <>
                <Link href="/app/profile" className="secondary-action">
                  Ver perfil
                </Link>
                <Link href="/app" className="secondary-action">
                  Voltar ao dashboard
                </Link>
              </>
            }
          />

          <section className="customer-dashboard-hero">
            <article className="customer-dashboard-command customer-affiliate-command">
              <div className="customer-dashboard-command-head">
                <div className="customer-dashboard-command-copy">
                  <h2>Abra sua frente de ganhos</h2>
                  <p>Solicite acesso ao programa.</p>
                </div>
                <StatusBadge label="nao participante" tone="neutral" />
              </div>

              <div className="customer-dashboard-balance-row">
                <div className="customer-dashboard-snapshot">
                  <div>
                    <span>Codigo</span>
                    <strong>Liberado no perfil</strong>
                  </div>
                  <div>
                    <span>Painel</span>
                    <strong>Status e comissoes</strong>
                  </div>
                  <div>
                    <span>Fluxo</span>
                    <strong>Solicitar e aguardar aprovacao</strong>
                  </div>
                </div>
              </div>
            </article>
          </section>

          <AffiliateApplyForm />
        </main>
      );
    }

    const [summaryResult, commissionsResult, pixResult] = await Promise.allSettled([
      getCustomerAffiliateSummary({ accessToken: session.accessToken }),
      listCustomerAffiliateCommissions({ accessToken: session.accessToken }),
      getCustomerAffiliatePix({ accessToken: session.accessToken }),
    ]);

    const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : null;
    const commissions = commissionsResult.status === 'fulfilled' ? commissionsResult.value : null;
    const affiliatePix = pixResult.status === 'fulfilled' ? pixResult.value : null;
    const effectiveProfile = {
      ...(summary?.affiliateProfile ?? affiliateProfile),
      pixKeyType: affiliatePix?.pixKeyType ?? (summary?.affiliateProfile ?? affiliateProfile).pixKeyType ?? null,
      pixKey: affiliatePix?.pixKey ?? (summary?.affiliateProfile ?? affiliateProfile).pixKey ?? null,
    };
    const affiliatePublicCode = getAffiliateDisplayCode(effectiveProfile) ?? '-';
    const statusView = getAffiliateProfileStatusView(effectiveProfile.status);
    const summaryCards = buildAffiliateSummaryCards(summary?.totals ?? {});

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Afiliados"
          title="Minha area de afiliado"
          compact
          actions={
            <>
              <Link href="/app/orders" className="secondary-action">
                Ver pedidos
              </Link>
              <Link href="/app/profile" className="secondary-action">
                Ver perfil
              </Link>
            </>
          }
        />

        <section className="customer-dashboard-hero">
          <article className="customer-dashboard-command customer-affiliate-command">
            <div className="customer-dashboard-command-head">
              <div className="customer-dashboard-command-copy">
                <h2>{affiliatePublicCode}</h2>
                <p>{statusView.noteDescription}</p>
              </div>
              <StatusBadge label={statusView.label} tone={statusView.tone} />
            </div>

            <div className="customer-dashboard-balance-row">
              <div className="customer-dashboard-snapshot">
                <div>
                  <span>Codigo publico</span>
                  <strong>{affiliatePublicCode}</strong>
                </div>
                <div>
                  <span>Comissao sobre venda</span>
                  <strong>{formatCommissionPercent(effectiveProfile.affiliateCommissionPercent)}</strong>
                </div>
                <div>
                  <span>Recebimento</span>
                  <strong>{effectiveProfile.pixKey ? 'PIX cadastrado' : 'PIX pendente'}</strong>
                </div>
              </div>
            </div>
          </article>

          <div className="customer-dashboard-side">
            <CustomerSectionCard
              title={statusView.noteTitle}
              meta={<StatusBadge label={statusView.label} tone={statusView.tone} />}
            >
              <div className="customer-dashboard-inline-stats">
                <div>
                  <span>Perfil</span>
                  <strong>{effectiveProfile.id}</strong>
                </div>
                <div>
                  <span>Aprovado</span>
                  <strong>{formatDateTime(effectiveProfile.approvedAt)}</strong>
                </div>
                <div>
                  <span>Suspenso</span>
                  <strong>{formatDateTime(effectiveProfile.suspendedAt)}</strong>
                </div>
                <div>
                  <span>Payout</span>
                  <strong>Via PIX</strong>
                </div>
              </div>
            </CustomerSectionCard>
          </div>
        </section>

        <AffiliatePixForm profile={effectiveProfile} />

        {pixResult.status === 'rejected' ? (
          <div className="auth-notice auth-notice-warning" role="status" aria-live="polite">
            <strong>PIX temporariamente indisponivel</strong>
            <p>{getLocalAffiliateErrorMessage(pixResult.reason, 'A chave PIX nao pode ser carregada agora.')}</p>
          </div>
        ) : null}

        {summaryResult.status === 'rejected' ? (
          <div className="auth-notice auth-notice-warning" role="status" aria-live="polite">
            <strong>Resumo temporariamente indisponivel</strong>
            <p>{getLocalAffiliateErrorMessage(summaryResult.reason, 'Os totais nao puderam ser carregados agora.')}</p>
          </div>
        ) : null}

        <section className="customer-dashboard-metrics">
          {summaryCards.map((card) => (
            <CustomerMetricCard
              key={card.label}
              label={card.label}
              value={card.value}
              meta={card.meta}
              icon={mapAffiliateMetricIcon(card.label)}
              tone={card.tone === 'default' ? 'default' : card.tone}
            />
          ))}
        </section>

        <CustomerSectionCard
          title="Historico"
          meta={<span className="panel-meta">{formatNumber(commissions?.totalItems ?? 0)} registro(s)</span>}
        >
          {commissionsResult.status === 'rejected' ? (
            <div className="auth-notice auth-notice-warning" role="status" aria-live="polite">
              <strong>Historico temporariamente indisponivel</strong>
              <p>{getLocalAffiliateErrorMessage(commissionsResult.reason, 'As comissoes nao puderam ser carregadas agora.')}</p>
            </div>
          ) : commissions && commissions.items.length === 0 ? (
            <EmptyState
              title="Nenhuma comissao encontrada"
              description="As comissoes aparecem aqui."
            />
          ) : (
            <DataTable columns={['ID', 'Pedido', 'Perfil', 'Comissao sobre venda', 'Status', 'Criada em', 'Paga em']}>
              {commissions?.items.map((commission) => {
                const commissionStatusView = getAffiliateCommissionStatusView(commission.status);

                return (
                  <tr key={commission.id}>
                    <td>{commission.id}</td>
                    <td>{commission.orderId || '-'}</td>
                    <td>{commission.affiliateProfileId || effectiveProfile.id}</td>
                    <td>{formatMoney(commission.commissionAmount)}</td>
                    <td>
                      <StatusBadge label={commissionStatusView.label} tone={commissionStatusView.tone} />
                    </td>
                    <td>{formatDateTime(commission.createdAt)}</td>
                    <td>{formatDateTime(commission.paidAt)}</td>
                  </tr>
                );
              })}
            </DataTable>
          )}
        </CustomerSectionCard>
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-customer">
        <ErrorState
          title="Nao foi possivel carregar a area de afiliado"
          description={
            error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar seu perfil, resumo e comissoes agora.'
          }
        />
      </main>
    );
  }
}

function buildAffiliateSummaryCards(totals: Record<string, number | Money>) {
  return [
    {
      label: 'Pendentes',
      value: formatSummaryMetric(
        findSummaryMetric(totals, ['commissionsPendingAmount', 'pendingCommissionAmount', 'pendingAmount'], ['pending', 'commission']),
      ),
      meta: 'Aguardando avanco.',
      tone: 'warning' as const,
    },
    {
      label: 'Aprovadas',
      value: formatSummaryMetric(
        findSummaryMetric(totals, ['commissionsApprovedAmount', 'approvedCommissionAmount', 'approvedAmount'], ['approved', 'commission']),
      ),
      meta: 'Ja liberadas.',
      tone: 'accent' as const,
    },
    {
      label: 'Pagas',
      value: formatSummaryMetric(findSummaryMetric(totals, ['commissionsPaidAmount', 'paidCommissionAmount', 'paidAmount'], ['paid', 'commission'])),
      meta: 'Ja liquidadas.',
      tone: 'success' as const,
    },
    {
      label: 'Vendas atribuidas',
      value: formatSummaryMetric(
        findSummaryMetric(
          totals,
          ['totalSalesAmount', 'salesAmount', 'totalSaleAmount', 'totalRevenueAttributed', 'attributedRevenue', 'attributedRevenueAmount', 'totalAttributedRevenue'],
          ['sale'],
        ) ?? findSummaryMetric(totals, ['totalRevenueAttributed', 'attributedRevenue', 'attributedRevenueAmount', 'totalAttributedRevenue'], ['revenue']),
      ),
      meta: 'Ligada ao seu codigo.',
      tone: 'default' as const,
    },
  ];
}

function findSummaryMetric(
  totals: Record<string, number | Money>,
  aliases: string[],
  requiredTokens: string[],
): SummaryMetricValue {
  for (const alias of aliases) {
    if (alias in totals) {
      return totals[alias];
    }
  }

  const entry = Object.entries(totals).find(([key]) => {
    const normalizedKey = key.replace(/[_-]/g, '').toLowerCase();
    return requiredTokens.every((token) => normalizedKey.includes(token.toLowerCase()));
  });

  return entry?.[1];
}

function formatSummaryMetric(value: SummaryMetricValue) {
  if (typeof value === 'number') {
    return formatNumber(value);
  }

  if (isMoney(value)) {
    return formatMoney(value);
  }

  return '-';
}

function isMoney(value: SummaryMetricValue): value is Money {
  return Boolean(value) && typeof value === 'object' && 'amount' in value && 'currency' in value;
}

function formatCommissionPercent(value?: string | null) {
  return value ? `${value}%` : '-';
}

function getAffiliateProfileStatusView(status: AffiliateProfileResource['status']) {
  if (status === 'pending') {
    return {
      label: 'Aguardando aprovacao',
      tone: 'warning' as const,
      description: 'Aguardando aprovacao.',
      noteTitle: 'Aguardando aprovacao',
      noteDescription: 'Divulgacao, comissoes e payouts via PIX liberam depois da aprovacao.',
    };
  }

  if (status === 'active') {
    return {
      label: 'Ativo',
      tone: 'success' as const,
      description: 'Perfil ativo.',
      noteTitle: 'Pronto para divulgar',
      noteDescription: 'Use o codigo, acompanhe as comissoes e mantenha sua chave PIX atualizada.',
    };
  }

  if (status === 'suspended') {
    return {
      label: 'Suspenso',
      tone: 'danger' as const,
      description: 'Acesso pausado.',
      noteTitle: 'Acesso pausado',
      noteDescription: 'Mantenha novas divulgacoes em pausa.',
    };
  }

  return {
    label: status,
    tone: 'neutral' as const,
    description: 'Status informado pela plataforma.',
    noteTitle: 'Status atualizado',
    noteDescription: 'Use o badge como referencia principal.',
  };
}

function getAffiliateCommissionStatusView(status: AffiliateCommissionResource['status']) {
  if (status === 'paid') {
    return {
      label: 'Paga',
      tone: 'success' as const,
    };
  }

  if (status === 'approved') {
    return {
      label: 'Aprovada',
      tone: 'info' as const,
    };
  }

  if (status === 'pending') {
    return {
      label: 'Pendente',
      tone: 'warning' as const,
    };
  }

  if (status.includes('cancel') || status.includes('reject') || status.includes('void')) {
    return {
      label: status,
      tone: 'danger' as const,
    };
  }

  return {
    label: status,
    tone: 'neutral' as const,
  };
}

function mapAffiliateMetricIcon(label: string) {
  switch (label) {
    case 'Pendentes':
      return Rocket;
    case 'Aprovadas':
      return TicketPercent;
    case 'Pagas':
      return Gift;
    default:
      return LineChart;
  }
}

function getLocalAffiliateErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiClientError) {
    return error.message || fallback;
  }

  return fallback;
}
