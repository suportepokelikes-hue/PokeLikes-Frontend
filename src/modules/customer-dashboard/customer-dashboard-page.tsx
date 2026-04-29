import Link from 'next/link';
import {
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
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import {
  getCustomerAffiliateProfile,
  getCustomerReferralSummary,
  getWalletSummary,
  listCustomerOrders,
  listCustomerPayments,
} from '@/lib/api/customer';
import { getAffiliateDisplayCode } from '@/lib/api/affiliate-normalizers';
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
        <section className="customer-dashboard-hero">
          <article className="customer-dashboard-command">
            <div className="customer-dashboard-command-head">
              <div className="customer-dashboard-command-copy">
                <h2>{session.user.name}</h2>
                <p>Saldo, pedidos e proximo passo.</p>
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
                  <span>Referral</span>
                  <strong>{referral.referralCode}</strong>
                </div>
              </div>
            </div>

            <section className="customer-dashboard-priority-card" aria-label="Proximo passo recomendado">
              <div className="customer-dashboard-priority-head">
                <div className="customer-dashboard-priority-copy">
                  <span>Proximo passo recomendado</span>
                  <strong>{priorityAction.title}</strong>
                  <p>{priorityAction.description}</p>
                </div>
                <StatusBadge label={priorityAction.badgeLabel} tone={priorityAction.badgeTone} />
              </div>
              <div className="customer-dashboard-priority-footer">
                <Link href={priorityAction.href} prefetch={false} className="primary-action">
                  <PriorityActionIcon size={16} strokeWidth={2.15} aria-hidden="true" />
                  {priorityAction.label}
                </Link>
                <p className="customer-dashboard-referral-note">
                  <strong>{referralView.title}</strong> {referralView.description}
                </p>
              </div>
            </section>

            <div className="customer-dashboard-command-actions">
              <Link href="/catalog" prefetch={false} className="primary-action">
                <ShoppingBag size={16} strokeWidth={2.15} aria-hidden="true" />
                Novo pedido
              </Link>
              <Link href="/app/payments" prefetch={false} className="secondary-action">
                <CreditCard size={16} strokeWidth={2.15} aria-hidden="true" />
                Gerar PIX
              </Link>
              <Link href="/app/wallet" prefetch={false} className="secondary-action">
                <Wallet size={16} strokeWidth={2.15} aria-hidden="true" />
                Ver carteira
              </Link>
            </div>
          </article>

          <div className="customer-dashboard-side">
            <div className="customer-dashboard-quick-grid">
              <CustomerQuickActionCard
                href="/app/wallet"
                icon={Wallet}
                title="Carteira"
                meta={formatMoney(wallet.availableBalance)}
                tone="accent"
              />
              <CustomerQuickActionCard
                href="/app/payments"
                icon={CreditCard}
                title="Pagamentos"
                meta={`${pendingPayments.length} em aberto`}
              />
              <CustomerQuickActionCard
                href="/app/orders"
                icon={ShoppingBag}
                title="Pedidos"
                meta={`${openOrders.length} ativos`}
              />
              <CustomerQuickActionCard
                href="/app/affiliate"
                icon={Gift}
                title="Afiliados"
                meta={affiliateStatusView.shortLabel}
              />
            </div>
          </div>
        </section>

        <section className="customer-dashboard-metrics">
          <CustomerMetricCard
            label="Saldo pronto"
            value={formatMoney(wallet.availableBalance)}
            icon={Wallet}
            tone="accent"
          />
          <CustomerMetricCard
            label="PIX em aberto"
            value={String(pendingPayments.length)}
            meta={pendingPayments[0] ? formatDateTime(pendingPayments[0].createdAt) : 'Sem pendencia'}
            icon={CreditCard}
            tone="warning"
          />
          <CustomerMetricCard
            label="Pedidos ativos"
            value={String(openOrders.length)}
            meta={latestOrder ? formatDateTime(latestOrder.updatedAt) : 'Sem pedidos'}
            icon={PackageCheck}
            tone="info"
          />
          <CustomerMetricCard
            label="Afiliados"
            value={affiliateStatusView.shortLabel}
            meta={affiliateProfile ? formatAffiliateMeta(affiliateProfile) : 'Nao ativo'}
            icon={affiliateProfile ? Gift : Sparkles}
            tone={affiliateProfile ? 'success' : 'default'}
          />
        </section>

        <section className="customer-dashboard-tables">
          <CustomerSectionCard
            title="PIX recentes"
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
            title="Pedidos recentes"
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
      description: 'Email pendente.',
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
      description: 'Primeiro deposito pendente.',
      href: '/app/payments',
      label: 'Depositar agora',
      icon: CreditCard,
      badgeLabel: 'bonus pendente',
      badgeTone: 'warning' as const,
    };
  }

  if (pendingPaymentId) {
    return {
      title: 'Finalize o PIX',
      description: 'Existe uma cobranca pendente.',
      href: `/app/payments?paymentId=${pendingPaymentId}`,
      label: 'Abrir pagamento',
      icon: CreditCard,
      badgeLabel: 'pix em aberto',
      badgeTone: 'warning' as const,
    };
  }

  if (openOrdersCount > 0) {
    return {
      title: 'Acompanhe pedidos',
      description: 'Pedidos em andamento.',
      href: '/app/orders',
      label: 'Ver pedidos',
      icon: PackageCheck,
      badgeLabel: 'em andamento',
      badgeTone: 'info' as const,
    };
  }

  if (!affiliateProfile) {
    return {
      title: 'Ative afiliados',
      description: 'Painel ainda nao ativo.',
      href: '/app/affiliate',
      label: 'Ver afiliados',
      icon: Gift,
      badgeLabel: 'expansao',
      badgeTone: 'neutral' as const,
    };
  }

  return {
    title: 'Pronto para um novo pedido',
    description: 'Conta pronta.',
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
        description: 'Verifique o email.',
      };
    case 'pending_first_qualifying_topup':
      return {
        title: 'Bonus pronto para o primeiro deposito',
        description: `PIX minimo ${formatMoney(minimumTopupAmount)}.`,
      };
    case 'rewarded':
      return {
        title: 'Bonus de referral ja liberado',
        description: 'Codigo ativo.',
      };
    case 'not_referred':
    default:
      return {
        title: 'Seu codigo ja esta pronto para compartilhar',
        description: 'Compartilhe o codigo.',
      };
  }
}

function getAffiliateStatusView(affiliateProfile: AffiliateProfileResource | null) {
  if (!affiliateProfile) {
    return {
      title: 'Programa ainda nao ativado',
      description: 'Painel nao ativo.',
      badgeLabel: 'nao participante',
      badgeTone: 'neutral' as const,
      shortLabel: 'nao ativo',
    };
  }

  if (affiliateProfile.status === 'active') {
    return {
      title: 'Painel de afiliado ativo',
      description: 'Codigo e ganhos.',
      badgeLabel: 'ativo',
      badgeTone: 'success' as const,
      shortLabel: 'ativo',
    };
  }

  if (affiliateProfile.status === 'pending') {
    return {
      title: 'Perfil aguardando aprovacao',
      description: 'Aguardando aprovacao.',
      badgeLabel: 'pendente',
      badgeTone: 'warning' as const,
      shortLabel: 'pendente',
    };
  }

  return {
    title: 'Perfil de afiliado pausado',
    description: 'Perfil pausado.',
    badgeLabel: affiliateProfile.status,
    badgeTone: 'danger' as const,
    shortLabel: affiliateProfile.status,
  };
}

function formatAffiliateMeta(affiliateProfile: AffiliateProfileResource) {
  const commissionPercent = affiliateProfile.affiliateCommissionPercent;

  if (commissionPercent) {
    return `${commissionPercent}%`;
  }

  return getAffiliateDisplayCode(affiliateProfile) ?? 'Ativo';
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
