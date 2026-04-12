import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
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
            description="Solicite sua entrada, acompanhe a aprovacao e concentre suas comissoes em uma area propria."
            actions={
              <>
                <Link href="/app/profile" className="secondary-action">
                  Ver perfil
                </Link>
                <Link href="/app" className="secondary-action">
                  Voltar ao inicio
                </Link>
              </>
            }
          />

          <section className="customer-hero-grid">
            <article className="customer-spotlight">
              <div className="customer-spotlight-head">
                <span className="eyebrow">Afiliados</span>
                <StatusBadge label="Nao participante" tone="neutral" />
              </div>
              <h2>Ative sua area de afiliado</h2>
              <p>Quando o perfil ainda nao existe, a entrada no programa comeca por aqui e a aprovacao segue pelo status do backend.</p>
              <div className="customer-highlight-list">
                <div>
                  <span>Status</span>
                  <strong>Aguardando solicitacao</strong>
                </div>
                <div>
                  <span>Visibilidade</span>
                  <strong>Codigo publico proprio</strong>
                </div>
                <div>
                  <span>Acompanhamento</span>
                  <strong>Resumo e comissoes</strong>
                </div>
              </div>
            </article>

            <article className="customer-note-card">
              <strong>Fluxo desta tela</strong>
              <p>Depois do apply, o frontend recarrega a propria rota e passa a refletir o perfil retornado como `pending`.</p>
            </article>
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
          description="Acompanhe o status do programa, seu codigo publico e as comissoes geradas na sua conta."
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

        <section className="customer-hero-grid">
          <article className="customer-spotlight">
            <div className="customer-spotlight-head">
              <span className="eyebrow">Status do programa</span>
              <StatusBadge label={statusView.label} tone={statusView.tone} />
            </div>
            <h2>{effectiveProfile.affiliateCode}</h2>
            <p>{statusView.description}</p>
            <div className="customer-highlight-list">
              <div>
                <span>Codigo publico</span>
                <strong>{effectiveProfile.affiliateCode}</strong>
              </div>
              <div>
                <span>Percentual atual</span>
                <strong>{effectiveProfile.affiliateCommissionPercent}%</strong>
              </div>
              <div>
                <span>Criado em</span>
                <strong>{formatDateTime(effectiveProfile.createdAt)}</strong>
              </div>
            </div>
          </article>

          <article className="customer-note-card">
            <strong>{statusView.noteTitle}</strong>
            <p>{statusView.noteDescription}</p>
            <p className="code-block">{effectiveProfile.affiliateCode}</p>
          </article>
        </section>

        <section className="metric-list">
          {summaryCards.map((card) => (
            <StatCard key={card.label} label={card.label} value={card.value} meta={card.meta} tone={card.tone} />
          ))}
        </section>

        <section className="detail-grid">
          <article className="detail-card">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Perfil</p>
                <h2>Dados do afiliado</h2>
              </div>
            </div>

            <dl className="detail-list">
              <div>
                <dt>ID do perfil</dt>
                <dd>{effectiveProfile.id}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusBadge label={statusView.label} tone={statusView.tone} />
                </dd>
              </div>
              <div>
                <dt>Codigo publico</dt>
                <dd className="code-block">{effectiveProfile.affiliateCode}</dd>
              </div>
              <div>
                <dt>Percentual</dt>
                <dd>{effectiveProfile.affiliateCommissionPercent}%</dd>
              </div>
              <div>
                <dt>Aprovado em</dt>
                <dd>{formatDateTime(effectiveProfile.approvedAt)}</dd>
              </div>
              <div>
                <dt>Suspenso em</dt>
                <dd>{formatDateTime(effectiveProfile.suspendedAt)}</dd>
              </div>
            </dl>
          </article>

          <article className="customer-note-card">
            <strong>Leitura operacional</strong>
            <p>{statusView.description}</p>
            <p>Se houver pausa ou bloqueio, o proprio status continua sendo a referencia principal desta area.</p>
          </article>
        </section>

        <section className="detail-card detail-card-wide">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Comissoes</p>
              <h2>Minhas comissoes</h2>
            </div>
            <span className="panel-meta">{formatNumber(commissions.totalItems)} registro(s)</span>
          </div>

          {commissions.items.length === 0 ? (
            <EmptyState
              title="Nenhuma comissao encontrada"
              description="Quando seus pedidos atribuidos ao programa gerarem comissao, eles vao aparecer aqui."
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
        </section>
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
      label: 'Comissoes pendentes',
      value: formatSummaryMetric(findSummaryMetric(totals, ['pendingCommissionAmount', 'pendingAmount'], ['pending', 'commission'])),
      meta: 'Resumo atual',
      tone: 'warning' as const,
    },
    {
      label: 'Comissoes aprovadas',
      value: formatSummaryMetric(findSummaryMetric(totals, ['approvedCommissionAmount', 'approvedAmount'], ['approved', 'commission'])),
      meta: 'Resumo atual',
      tone: 'accent' as const,
    },
    {
      label: 'Comissoes pagas',
      value: formatSummaryMetric(findSummaryMetric(totals, ['paidCommissionAmount', 'paidAmount'], ['paid', 'commission'])),
      meta: 'Resumo atual',
      tone: 'success' as const,
    },
    {
      label: 'Receita atribuida',
      value: formatSummaryMetric(
        findSummaryMetric(totals, ['attributedRevenue', 'attributedRevenueAmount', 'totalAttributedRevenue'], ['revenue']),
      ),
      meta: 'Se disponivel no summary',
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
      description: 'Seu cadastro ja entrou no programa. Agora falta a aprovacao administrativa para liberar a divulgacao.',
      noteTitle: 'Aguardando aprovacao',
      noteDescription: 'Enquanto o status estiver como pending, esta area continua sendo o ponto central para acompanhar a entrada no programa.',
    };
  }

  if (status === 'active') {
    return {
      label: 'Ativo',
      tone: 'success' as const,
      description: 'Seu perfil esta pronto para divulgacao e acompanhamento das comissoes geradas.',
      noteTitle: 'Pronto para divulgar',
      noteDescription: 'Use o codigo publico abaixo nas suas divulgacoes e acompanhe as comissoes conforme elas forem sendo registradas.',
    };
  }

  if (status === 'suspended') {
    return {
      label: 'Suspenso',
      tone: 'danger' as const,
      description: 'Seu acesso ao programa foi pausado. Se precisar retomar a operacao, entre em contato com o suporte ou com o admin.',
      noteTitle: 'Acesso pausado',
      noteDescription: 'As novas divulgacoes devem ficar suspensas enquanto o backend mantiver este status.',
    };
  }

  return {
    label: status,
    tone: 'neutral' as const,
    description: 'O perfil de afiliado foi carregado, mas este status ainda nao possui uma leitura contextual dedicada no frontend.',
    noteTitle: 'Status carregado',
    noteDescription: 'Use o proprio badge acima como referencia principal ate o contrato estabilizar todos os estados.',
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
