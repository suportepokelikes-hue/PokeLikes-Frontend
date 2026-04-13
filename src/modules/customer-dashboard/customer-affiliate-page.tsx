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
              <h2>Solicite seu perfil</h2>
              <p>Depois do envio, o status aparece aqui.</p>
              <div className="customer-highlight-list">
                <div>
                  <span>Status</span>
                  <strong>Sem perfil</strong>
                </div>
                <div>
                  <span>Codigo</span>
                  <strong>Liberado no perfil</strong>
                </div>
                <div>
                  <span>Painel</span>
                  <strong>Resumo e comissoes</strong>
                </div>
              </div>
            </article>

            <article className="customer-note-card">
              <strong>Aguardando aprovacao</strong>
              <p>Depois do apply, o perfil entra como pendente.</p>
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
                <h2>Painel do afiliado</h2>
              </div>
            </div>

            <dl className="detail-list">
              <div>
                <dt>Perfil</dt>
                <dd>{effectiveProfile.id}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusBadge label={statusView.label} tone={statusView.tone} />
                </dd>
              </div>
              <div>
                <dt>Codigo</dt>
                <dd className="code-block">{effectiveProfile.affiliateCode}</dd>
              </div>
              <div>
                <dt>Comissao</dt>
                <dd>{effectiveProfile.affiliateCommissionPercent}%</dd>
              </div>
              <div>
                <dt>Aprovado</dt>
                <dd>{formatDateTime(effectiveProfile.approvedAt)}</dd>
              </div>
              <div>
                <dt>Suspenso</dt>
                <dd>{formatDateTime(effectiveProfile.suspendedAt)}</dd>
              </div>
            </dl>
          </article>

          <article className="customer-note-card">
            <strong>{statusView.noteTitle}</strong>
            <p>{statusView.noteDescription}</p>
          </article>
        </section>

        <section className="detail-card detail-card-wide">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Comissoes</p>
                <h2>Historico</h2>
              </div>
            <span className="panel-meta">{formatNumber(commissions.totalItems)} registro(s)</span>
          </div>

          {commissions.items.length === 0 ? (
            <EmptyState
              title="Nenhuma comissao encontrada"
              description="As comissoes aparecem quando houver pedidos atribuidos."
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
      label: 'Pendentes',
      value: formatSummaryMetric(findSummaryMetric(totals, ['pendingCommissionAmount', 'pendingAmount'], ['pending', 'commission'])),
      meta: undefined,
      tone: 'warning' as const,
    },
    {
      label: 'Aprovadas',
      value: formatSummaryMetric(findSummaryMetric(totals, ['approvedCommissionAmount', 'approvedAmount'], ['approved', 'commission'])),
      meta: undefined,
      tone: 'accent' as const,
    },
    {
      label: 'Pagas',
      value: formatSummaryMetric(findSummaryMetric(totals, ['paidCommissionAmount', 'paidAmount'], ['paid', 'commission'])),
      meta: undefined,
      tone: 'success' as const,
    },
    {
      label: 'Receita atribuida',
      value: formatSummaryMetric(
        findSummaryMetric(totals, ['attributedRevenue', 'attributedRevenueAmount', 'totalAttributedRevenue'], ['revenue']),
      ),
      meta: undefined,
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
      noteDescription: 'Mantenha as novas divulgacoes pausadas enquanto esse status estiver ativo.',
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
