import Link from 'next/link';
import {
  ArrowRight,
  CircleUserRound,
  CreditCard,
  Gift,
  MailCheck,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Wallet,
} from 'lucide-react';

import { CustomerMetricCard, CustomerQuickActionCard, CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import {
  getCustomerAffiliateProfile,
  getCustomerReferralSummary,
  getWalletSummary,
  listCustomerOrders,
  listCustomerPayments,
} from '@/lib/api/customer';
import type { AffiliateProfileResource, Money, ReferralRewardStatus } from '@/lib/api/contracts';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { getOrderStatusView } from '@/modules/orders/order-view';

type CustomerDashboardPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function CustomerDashboardPage({ session }: CustomerDashboardPageProps) {
  try {
    const [wallet, payments, orders, referral, affiliateProfile] = await Promise.all([
      getWalletSummary({ accessToken: session.accessToken }),
      listCustomerPayments({ accessToken: session.accessToken }),
      listCustomerOrders({ accessToken: session.accessToken }),
      getCustomerReferralSummary({ accessToken: session.accessToken }),
      getCustomerAffiliateProfile({ accessToken: session.accessToken }),
    ]);
    const confirmedPayments = payments.items.filter((payment) => payment.status === 'confirmed').length;
    const pendingPayments = payments.items.filter((payment) => payment.status === 'pending');
    const openOrders = orders.items.filter((order) =>
      ['pending', 'submitted', 'queued_supplier_balance', 'in_progress'].includes(order.status),
    );
    const referralView = getReferralDashboardView(referral.rewardStatus, referral.rewardRules.minimumTopupAmount);
    const priorityAction = getPriorityAction({
      emailVerified: session.user.emailVerified ?? false,
      referralStatus: referral.rewardStatus,
      affiliateProfile,
      pendingPaymentId: pendingPayments[0]?.id,
      openOrdersCount: openOrders.length,
    });
    const PriorityActionIcon = priorityAction.icon;
    const latestOrder = orders.items[0] ?? null;
    const affiliateStatusView = getAffiliateStatusView(affiliateProfile);

    return (
      <main className="page page-customer customer-dashboard-page">
        <PageHeader
          eyebrow="Area do cliente"
          title="Dashboard"
          description="Saldo, pedidos e proximos passos em um painel unico."
          compact
          actions={
            <>
              <Link href="/catalog" prefetch={false} className="primary-action">
                <ShoppingBag size={16} strokeWidth={2.15} aria-hidden="true" />
                Novo pedido
              </Link>
              <Link href="/app/payments" prefetch={false} className="secondary-action">
                <CreditCard size={16} strokeWidth={2.15} aria-hidden="true" />
                Gerar PIX
              </Link>
            </>
          }
        />

        <section className="customer-dashboard-hero">
          <article className="customer-dashboard-command">
            <div className="customer-dashboard-command-head">
              <div className="customer-dashboard-command-copy">
                <div className="customer-dashboard-command-pills">
                  <span className="customer-dashboard-pill">Painel central</span>
                  <span className="customer-dashboard-pill">{session.user.emailVerified ? 'Email verificado' : 'Email pendente'}</span>
                </div>
                <h2>{session.user.name}</h2>
                <p>Controle saldo, acompanhe pedidos e avance pelo proximo passo sem trocar de contexto.</p>
              </div>
              <StatusBadge label={session.user.status} tone={session.user.status === 'active' ? 'success' : 'warning'} />
            </div>

            <div className="customer-dashboard-balance-row">
              <div className="customer-dashboard-balance">
                <span>Saldo disponivel</span>
                <strong>{formatMoney(wallet.availableBalance)}</strong>
              </div>
              <div className="customer-dashboard-snapshot">
                <div>
                  <span>PIX em aberto</span>
                  <strong>{pendingPayments.length}</strong>
                </div>
                <div>
                  <span>Pedidos ativos</span>
                  <strong>{openOrders.length}</strong>
                </div>
                <div>
                  <span>Total ganho</span>
                  <strong>{formatMoney(referral.summary.earnedAmount)}</strong>
                </div>
              </div>
            </div>

            <div className="customer-dashboard-command-actions">
              <Link href={priorityAction.href} prefetch={false} className="primary-action">
                <PriorityActionIcon size={16} strokeWidth={2.15} aria-hidden="true" />
                {priorityAction.label}
              </Link>
              <Link href="/app/wallet" prefetch={false} className="secondary-action">
                <Wallet size={16} strokeWidth={2.15} aria-hidden="true" />
                Ver carteira
              </Link>
            </div>
          </article>

          <div className="customer-dashboard-side">
            <CustomerSectionCard
              eyebrow="Prioridade"
              title={priorityAction.title}
              description={priorityAction.description}
              meta={<StatusBadge label={priorityAction.badgeLabel} tone={priorityAction.badgeTone} />}
              className="customer-dashboard-priority"
            >
              <div className="customer-dashboard-priority-body">
                <div className="customer-dashboard-priority-list">
                  <div>
                    <span>Wallet</span>
                    <strong>{formatMoney(wallet.availableBalance)}</strong>
                  </div>
                  <div>
                    <span>Referral</span>
                    <strong>{referral.referralCode}</strong>
                  </div>
                </div>
                <Link href={priorityAction.href} prefetch={false} className="secondary-action">
                  <ArrowRight size={16} strokeWidth={2.15} aria-hidden="true" />
                  Abrir fluxo
                </Link>
              </div>
            </CustomerSectionCard>

            <div className="customer-dashboard-quick-grid">
              <CustomerQuickActionCard
                href="/app/wallet"
                icon={Wallet}
                title="Carteira"
                description="Saldo e extrato."
                meta={formatMoney(wallet.availableBalance)}
                tone="accent"
              />
              <CustomerQuickActionCard
                href="/app/payments"
                icon={CreditCard}
                title="Pagamentos"
                description="PIX e confirmacoes."
                meta={`${pendingPayments.length} em aberto`}
              />
              <CustomerQuickActionCard
                href="/app/orders"
                icon={ShoppingBag}
                title="Pedidos"
                description="Lista e andamento."
                meta={`${openOrders.length} ativos`}
              />
              <CustomerQuickActionCard
                href={affiliateProfile ? '/app/affiliate' : '/app/profile#indicacoes'}
                icon={affiliateProfile ? Gift : CircleUserRound}
                title={affiliateProfile ? 'Afiliados' : 'Perfil e indicacoes'}
                description={affiliateProfile ? 'Codigo e comissoes.' : 'Conta, email e codigo.'}
                meta={affiliateStatusView.shortLabel}
              />
            </div>
          </div>
        </section>

        <section className="customer-dashboard-metrics">
          <CustomerMetricCard
            label="Saldo pronto"
            value={formatMoney(wallet.availableBalance)}
            meta="Disponivel para novos pedidos."
            icon={Wallet}
            tone="accent"
          />
          <CustomerMetricCard
            label="PIX em aberto"
            value={String(pendingPayments.length)}
            meta={pendingPayments[0] ? `Ultimo criado em ${formatDateTime(pendingPayments[0].createdAt)}` : 'Nenhuma cobranca pendente.'}
            icon={CreditCard}
            tone="warning"
          />
          <CustomerMetricCard
            label="Pedidos ativos"
            value={String(openOrders.length)}
            meta={latestOrder ? `Ultima atualizacao ${formatDateTime(latestOrder.updatedAt)}` : 'Sem pedidos em andamento.'}
            icon={PackageCheck}
            tone="info"
          />
          <CustomerMetricCard
            label="Indicacoes"
            value={String(referral.summary.invitedUsers)}
            meta={`${referral.summary.rewardedUsers} com bonus liberado`}
            icon={affiliateProfile ? Gift : Sparkles}
            tone={affiliateProfile ? 'success' : 'default'}
          />
        </section>

        <section className="customer-dashboard-lower">
          <CustomerSectionCard
            eyebrow="Referral"
            title={referralView.title}
            description={referralView.description}
            meta={<StatusBadge label={referral.emailVerified ? 'email verificado' : 'email pendente'} tone={referral.emailVerified ? 'info' : 'warning'} />}
          >
            <div className="customer-dashboard-referral-grid">
              <div className="customer-dashboard-inline-stats">
                <div>
                  <span>Seu codigo</span>
                  <strong>{referral.referralCode}</strong>
                </div>
                <div>
                  <span>Convidados</span>
                  <strong>{referral.summary.invitedUsers}</strong>
                </div>
                <div>
                  <span>Bonus pago</span>
                  <strong>{formatMoney(referral.summary.earnedAmount)}</strong>
                </div>
              </div>
              <div className="customer-dashboard-inline-actions">
                <Link href="/app/profile#indicacoes" prefetch={false} className="secondary-action">
                  <Gift size={16} strokeWidth={2.15} aria-hidden="true" />
                  Ver indicacoes
                </Link>
                {!session.user.emailVerified ? (
                  <Link href="/app/profile" prefetch={false} className="secondary-action">
                    <MailCheck size={16} strokeWidth={2.15} aria-hidden="true" />
                    Verificar email
                  </Link>
                ) : null}
                {referral.rewardStatus === 'pending_first_qualifying_topup' ? (
                  <Link href="/app/payments" prefetch={false} className="primary-action">
                    <CreditCard size={16} strokeWidth={2.15} aria-hidden="true" />
                    Fazer deposito
                  </Link>
                ) : null}
              </div>
            </div>
          </CustomerSectionCard>

          <CustomerSectionCard
            eyebrow="Afiliados"
            title={affiliateStatusView.title}
            description={affiliateStatusView.description}
            meta={<StatusBadge label={affiliateStatusView.badgeLabel} tone={affiliateStatusView.badgeTone} />}
          >
            <div className="customer-dashboard-inline-stats">
              <div>
                <span>Status</span>
                <strong>{affiliateStatusView.shortLabel}</strong>
              </div>
              <div>
                <span>Codigo</span>
                <strong>{affiliateProfile?.affiliateCode ?? 'Disponivel no perfil'}</strong>
              </div>
              <div>
                <span>Comissao</span>
                <strong>{affiliateProfile ? `${affiliateProfile.affiliateCommissionPercent}%` : 'Solicitacao aberta'}</strong>
              </div>
            </div>
            <div className="customer-dashboard-inline-actions">
              <Link href={affiliateProfile ? '/app/affiliate' : '/app/profile'} prefetch={false} className="secondary-action">
                <ArrowRight size={16} strokeWidth={2.15} aria-hidden="true" />
                {affiliateProfile ? 'Abrir painel' : 'Abrir perfil'}
              </Link>
            </div>
          </CustomerSectionCard>
        </section>

        <section className="customer-dashboard-tables">
          <CustomerSectionCard
            eyebrow="Pagamentos"
            title="PIX recentes"
            description="Veja o que ainda precisa de confirmacao e o que ja entrou na carteira."
            actions={
              <Link href="/app/payments" prefetch={false} className="panel-link">
                Ver tudo
              </Link>
            }
          >
            {payments.items.length === 0 ? (
              <EmptyState title="Nenhum pagamento encontrado" description="Gere um PIX para adicionar saldo." />
            ) : (
              <DataTable columns={['ID', 'Valor', 'Status', 'Criado em']}>
                {payments.items.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>{formatMoney(payment.amount)}</td>
                    <td>
                      <StatusBadge label={payment.status} tone={mapPaymentTone(payment.status)} />
                    </td>
                    <td>{formatDateTime(payment.createdAt)}</td>
                  </tr>
                ))}
              </DataTable>
            )}
          </CustomerSectionCard>

          <CustomerSectionCard
            eyebrow="Pedidos"
            title="Pedidos recentes"
            description="Monitore status, cobranca e ultima movimentacao sem sair do dashboard."
            actions={
              <Link href="/app/orders" prefetch={false} className="panel-link">
                Ver tudo
              </Link>
            }
          >
            {orders.items.length === 0 ? (
              <EmptyState title="Nenhum pedido encontrado" description="Escolha um servico no catalogo para comecar." />
            ) : (
              <DataTable columns={['ID', 'Servico', 'Status', 'Atualizado em']}>
                {orders.items.map((order) => {
                  const statusView = getOrderStatusView(order.status);

                  return (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.catalogService?.name || 'Servico nao associado'}</td>
                      <td>
                        <StatusBadge label={statusView.label} tone={statusView.tone} />
                      </td>
                      <td>{formatDateTime(order.updatedAt)}</td>
                    </tr>
                  );
                })}
              </DataTable>
            )}
          </CustomerSectionCard>
        </section>
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-customer">
        <ErrorState
          title="Nao foi possivel montar o dashboard"
          description={getErrorMessage(error, 'Nao foi possivel buscar saldo, pagamentos e pedidos.')}
        />
      </main>
    );
  }
}

function getPriorityAction(options: {
  emailVerified: boolean;
  referralStatus: ReferralRewardStatus;
  affiliateProfile: AffiliateProfileResource | null;
  pendingPaymentId?: string;
  openOrdersCount: number;
}) {
  const { emailVerified, referralStatus, affiliateProfile, pendingPaymentId, openOrdersCount } = options;

  if (!emailVerified) {
    return {
      title: 'Verifique seu email',
      description: 'A conta fica mais confiavel e pronta para liberar o fluxo de bonus por indicacao.',
      href: '/app/profile',
      label: 'Abrir perfil',
      icon: MailCheck,
      badgeLabel: 'email pendente',
      badgeTone: 'warning' as const,
    };
  }

  if (referralStatus === 'pending_first_qualifying_topup') {
    return {
      title: 'Libere seu bonus',
      description: 'Seu codigo ja esta ativo. Falta confirmar o primeiro deposito qualificado.',
      href: '/app/payments',
      label: 'Depositar agora',
      icon: CreditCard,
      badgeLabel: 'bonus pendente',
      badgeTone: 'warning' as const,
    };
  }

  if (pendingPaymentId) {
    return {
      title: 'Finalize o PIX em aberto',
      description: 'Existe uma cobranca aguardando pagamento. Concluir isso acelera a reposicao do saldo.',
      href: `/app/payments?paymentId=${pendingPaymentId}`,
      label: 'Abrir pagamento',
      icon: CreditCard,
      badgeLabel: 'pix em aberto',
      badgeTone: 'warning' as const,
    };
  }

  if (openOrdersCount > 0) {
    return {
      title: 'Acompanhe seus pedidos',
      description: 'Seu painel ja tem pedidos em andamento. Vale conferir o status mais recente.',
      href: '/app/orders',
      label: 'Ver pedidos',
      icon: PackageCheck,
      badgeLabel: 'em andamento',
      badgeTone: 'info' as const,
    };
  }

  if (!affiliateProfile) {
    return {
      title: 'Ative a frente de afiliados',
      description: 'Seu codigo de indicacao ja existe. O proximo salto e abrir o painel de afiliado.',
      href: '/app/affiliate',
      label: 'Ver afiliados',
      icon: Gift,
      badgeLabel: 'expansao',
      badgeTone: 'neutral' as const,
    };
  }

  return {
    title: 'Painel pronto para um novo pedido',
    description: 'Saldo, conta e acessos estao organizados. Use o dashboard como ponto de partida das proximas operacoes.',
    href: '/catalog',
    label: 'Abrir catalogo',
    icon: ShoppingBag,
    badgeLabel: 'pronto',
    badgeTone: 'success' as const,
  };
}

function getReferralDashboardView(status: ReferralRewardStatus, minimumTopupAmount: Money) {
  switch (status) {
    case 'pending_email_verification':
      return {
        title: 'Seu codigo aguarda a verificacao do email',
        description: 'Depois disso, falta apenas o primeiro deposito qualificado para liberar o bonus.',
      };
    case 'pending_first_qualifying_topup':
      return {
        title: 'Bonus pronto para o primeiro deposito',
        description: `Confirme um PIX de pelo menos ${formatMoney(minimumTopupAmount)} para liberar a recompensa.`,
      };
    case 'rewarded':
      return {
        title: 'Bonus de referral ja liberado',
        description: 'Seu codigo continua ativo para novos convites e o historico fica concentrado no perfil.',
      };
    case 'not_referred':
    default:
      return {
        title: 'Seu codigo ja esta pronto para compartilhar',
        description: 'Convide novos usuarios e acompanhe resultados sem sair da area interna.',
      };
  }
}

function getAffiliateStatusView(affiliateProfile: AffiliateProfileResource | null) {
  if (!affiliateProfile) {
    return {
      title: 'Programa ainda nao ativado',
      description: 'Quando quiser abrir essa frente, o painel de afiliados fica disponivel na sua area interna.',
      badgeLabel: 'nao participante',
      badgeTone: 'neutral' as const,
      shortLabel: 'nao ativo',
    };
  }

  if (affiliateProfile.status === 'active') {
    return {
      title: 'Painel de afiliado ativo',
      description: 'Codigo, percentual e comissoes ficam concentrados em uma area dedicada.',
      badgeLabel: 'ativo',
      badgeTone: 'success' as const,
      shortLabel: 'ativo',
    };
  }

  if (affiliateProfile.status === 'pending') {
    return {
      title: 'Perfil aguardando aprovacao',
      description: 'O cadastro entrou no programa e agora espera a liberacao operacional.',
      badgeLabel: 'pendente',
      badgeTone: 'warning' as const,
      shortLabel: 'pendente',
    };
  }

  return {
    title: 'Perfil de afiliado pausado',
    description: 'Acompanhe o status antes de retomar novas divulgacoes.',
    badgeLabel: affiliateProfile.status,
    badgeTone: 'danger' as const,
    shortLabel: affiliateProfile.status,
  };
}

function mapPaymentTone(status: string) {
  if (status === 'confirmed') {
    return 'success';
  }

  if (status === 'pending') {
    return 'warning';
  }

  if (status === 'expired' || status === 'failed' || status === 'cancelled') {
    return 'danger';
  }

  return 'neutral';
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiClientError) {
    return error.message || fallback;
  }

  return fallback;
}
