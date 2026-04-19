import Link from 'next/link';
import { Gift, LineChart, Rocket, Sparkles, TicketPercent } from 'lucide-react';

import { CustomerMetricCard, CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import {
  getCustomerAffiliateProfile,
  getCustomerAffiliateSummary,
  listCustomerAffiliateCommissions,
} from '@/lib/api/customer';
import type { AffiliateCommissionResource, AffiliateProfileResource, Money } from '@/lib/api/contracts';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney, formatNumber } from '@/lib/format';
import { AffiliateApplyForm } from './affiliate-apply-form';

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
            description="Entre no programa para acompanhar codigo, status e ganhos na mesma area interna."
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
                  <div className="customer-dashboard-command-pills">
                    <span className="customer-dashboard-pill">Programa de afiliados</span>
                    <span className="customer-dashboard-pill">Convite aberto</span>
                  </div>
                  <h2>Abra sua frente de ganhos</h2>
                  <p>Ative seu perfil para receber codigo publico, acompanhar status e visualizar comissoes em um painel dedicado.</p>
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

            <div className="customer-dashboard-side">
              <CustomerSectionCard
                eyebrow="O que voce desbloqueia"
                title="Visibilidade de codigo e ganhos"
                description="Depois do apply, o painel mostra status, percentual e historico financeiro."
                meta={<StatusBadge label="entrada disponivel" tone="info" />}
              >
                <div className="customer-dashboard-inline-stats">
                  <div>
                    <span>Codigo</span>
                    <strong>Publico</strong>
                  </div>
                  <div>
                    <span>Resumo</span>
                    <strong>Comissoes e receita</strong>
                  </div>
                  <div>
                    <span>Status</span>
                    <strong>Acompanhado no app</strong>
                  </div>
                </div>
              </CustomerSectionCard>
            </div>
          </section>

          <section className="customer-dashboard-metrics">
            <CustomerMetricCard
              label="Entrada"
              value="Aberta"
              meta="Solicite seu perfil."
              icon={Rocket}
              tone="accent"
            />
            <CustomerMetricCard
              label="Codigo"
              value="Liberado"
              meta="Aparece apos a criacao do perfil."
              icon={Gift}
              tone="info"
            />
            <CustomerMetricCard
              label="Painel"
              value="Resumo"
              meta="Status e comissoes."
              icon={LineChart}
              tone="default"
            />
            <CustomerMetricCard
              label="Modelo"
              value="Aprovacao"
              meta="Entrada seguida de analise."
              icon={Sparkles}
              tone="warning"
            />
          </section>

          <AffiliateApplyForm />
        </main>
      );
    }

    const [summary, commissions] = await Promise.all([
      getCustomerAffiliateSummary({ accessToken: session.accessToken }),
      listCustomerAffiliateCommissions({ accessToken: session.accessToken }),
    ]);

    const effectiveProfile = summary.affiliateProfile ?? affiliateProfile;
    const statusView = getAffiliateProfileStatusView(effectiveProfile.status);
    const summaryCards = buildAffiliateSummaryCards(summary.totals);

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Afiliados"
          title="Minha area de afiliado"
          description="Status do perfil, percentuais e comissoes com leitura mais clara."
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
                <div className="customer-dashboard-command-pills">
                  <span className="customer-dashboard-pill">Painel de afiliado</span>
                  <span className="customer-dashboard-pill">{effectiveProfile.affiliateCommissionPercent}% atual</span>
                </div>
                <h2>{effectiveProfile.affiliateCode}</h2>
                <p>{statusView.description}</p>
              </div>
              <StatusBadge label={statusView.label} tone={statusView.tone} />
            </div>

            <div className="customer-dashboard-balance-row">
              <div className="customer-dashboard-snapshot">
                <div>
                  <span>Codigo publico</span>
                  <strong>{effectiveProfile.affiliateCode}</strong>
                </div>
                <div>
                  <span>Comissao</span>
                  <strong>{effectiveProfile.affiliateCommissionPercent}%</strong>
                </div>
                <div>
                  <span>Criado em</span>
                  <strong>{formatDateTime(effectiveProfile.createdAt)}</strong>
                </div>
              </div>
            </div>
          </article>

          <div className="customer-dashboard-side">
            <CustomerSectionCard
              eyebrow="Status"
              title={statusView.noteTitle}
              description={statusView.noteDescription}
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
              </div>
            </CustomerSectionCard>
          </div>
        </section>

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

        <section className="customer-dashboard-lower">
          <CustomerSectionCard
            eyebrow="Perfil"
            title="Painel do afiliado"
            description="Referencia principal para acompanhar status, codigo e percentual atual."
          >
            <div className="customer-dashboard-inline-stats">
              <div>
                <span>Status</span>
                <strong>{statusView.label}</strong>
              </div>
              <div>
                <span>Codigo</span>
                <strong>{effectiveProfile.affiliateCode}</strong>
              </div>
              <div>
                <span>Comissao</span>
                <strong>{effectiveProfile.affiliateCommissionPercent}%</strong>
              </div>
            </div>
          </CustomerSectionCard>

          <CustomerSectionCard
            eyebrow="Leitura rapida"
            title="Ganhos e operacao"
            description="Use o status como referencia principal e acompanhe as comissoes logo abaixo."
            meta={<StatusBadge label={statusView.label} tone={statusView.tone} />}
          >
            <div className="customer-dashboard-inline-stats">
              <div>
                <span>Aprovado em</span>
                <strong>{formatDateTime(effectiveProfile.approvedAt)}</strong>
              </div>
              <div>
                <span>Suspenso em</span>
                <strong>{formatDateTime(effectiveProfile.suspendedAt)}</strong>
              </div>
              <div>
                <span>Status atual</span>
                <strong>{statusView.label}</strong>
              </div>
            </div>
          </CustomerSectionCard>
        </section>

        <CustomerSectionCard
          eyebrow="Comissoes"
          title="Historico"
          description="Veja pedido, valor, status e pagamento de cada comissao atribuida."
          meta={<span className="panel-meta">{formatNumber(commissions.totalItems)} registro(s)</span>}
        >
          {commissions.items.length === 0 ? (
            <EmptyState
              title="Nenhuma comissao encontrada"
              description="As comissoes aparecem quando houver pedidos atribuidos ao seu codigo."
            />
          ) : (
            <DataTable columns={['ID', 'Pedido', 'Perfil', 'Comissao', 'Status', 'Criada em', 'Paga em']}>
              {commissions.items.map((commission) => {
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
      value: formatSummaryMetric(findSummaryMetric(totals, ['pendingCommissionAmount', 'pendingAmount'], ['pending', 'commission'])),
      meta: 'Comissoes aguardando avanco.',
      tone: 'warning' as const,
    },
    {
      label: 'Aprovadas',
      value: formatSummaryMetric(findSummaryMetric(totals, ['approvedCommissionAmount', 'approvedAmount'], ['approved', 'commission'])),
      meta: 'Ja liberadas no fluxo.',
      tone: 'accent' as const,
    },
    {
      label: 'Pagas',
      value: formatSummaryMetric(findSummaryMetric(totals, ['paidCommissionAmount', 'paidAmount'], ['paid', 'commission'])),
      meta: 'Ja liquidadas.',
      tone: 'success' as const,
    },
    {
      label: 'Receita atribuida',
      value: formatSummaryMetric(
        findSummaryMetric(totals, ['attributedRevenue', 'attributedRevenueAmount', 'totalAttributedRevenue'], ['revenue']),
      ),
      meta: 'Receita ligada ao seu codigo.',
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

function getAffiliateProfileStatusView(status: AffiliateProfileResource['status']) {
  if (status === 'pending') {
    return {
      label: 'Aguardando aprovacao',
      tone: 'warning' as const,
      description: 'Seu cadastro entrou no programa e aguarda aprovacao.',
      noteTitle: 'Aguardando aprovacao',
      noteDescription: 'O painel libera divulgacao e comissoes depois da aprovacao.',
    };
  }

  if (status === 'active') {
    return {
      label: 'Ativo',
      tone: 'success' as const,
      description: 'Perfil liberado para divulgacao e acompanhamento.',
      noteTitle: 'Pronto para divulgar',
      noteDescription: 'Use o codigo publico e acompanhe as comissoes por aqui.',
    };
  }

  if (status === 'suspended') {
    return {
      label: 'Suspenso',
      tone: 'danger' as const,
      description: 'Seu acesso ao programa esta pausado.',
      noteTitle: 'Acesso pausado',
      noteDescription: 'Mantenha novas divulgacoes em pausa enquanto este status estiver ativo.',
    };
  }

  return {
    label: status,
    tone: 'neutral' as const,
    description: 'Status informado pela plataforma.',
    noteTitle: 'Status atualizado',
    noteDescription: 'Use o badge como referencia principal enquanto este status estiver ativo.',
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
