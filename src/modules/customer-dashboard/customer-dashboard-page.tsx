import Link from 'next/link';
import { ArrowRight, CircleUserRound, CreditCard, Gift, MailCheck, ShoppingBag, Wallet } from 'lucide-react';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { getCustomerReferralSummary, listCustomerOrders, listCustomerPayments, getWalletSummary } from '@/lib/api/customer';
import type { SessionState } from '@/lib/auth/session';
import { ApiClientError } from '@/lib/api/http';
import { formatDateTime, formatMoney } from '@/lib/format';
import type { Money, ReferralRewardStatus } from '@/lib/api/contracts';
import { getOrderStatusView } from '@/modules/orders/order-view';

type CustomerDashboardPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function CustomerDashboardPage({ session }: CustomerDashboardPageProps) {
  try {
    const [wallet, payments, orders, referral] = await Promise.all([
      getWalletSummary({ accessToken: session.accessToken }),
      listCustomerPayments({ accessToken: session.accessToken }),
      listCustomerOrders({ accessToken: session.accessToken }),
      getCustomerReferralSummary({ accessToken: session.accessToken }),
    ]);
    const confirmedPayments = payments.items.filter((payment) => payment.status === 'confirmed').length;
    const openOrders = orders.items.filter((order) =>
      ['pending', 'submitted', 'queued_supplier_balance', 'in_progress'].includes(order.status),
    ).length;
    const referralView = getReferralDashboardView(referral.rewardStatus, referral.rewardRules.minimumTopupAmount);

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Area do cliente"
          title={`Bem-vindo, ${session.user.name}`}
          description="Veja seu saldo, gere um PIX ou acompanhe seus pedidos."
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

        <section className="customer-hero-grid">
          <article className="customer-spotlight">
            <div className="customer-spotlight-head">
              <span className="eyebrow">Saldo atual</span>
              <StatusBadge label={session.user.status} tone={session.user.status === 'active' ? 'success' : 'warning'} />
            </div>
            <h2>{formatMoney(wallet.availableBalance)}</h2>
            <p>Use seu saldo para pagar pedidos e acompanhe o que ainda esta em andamento.</p>
            <div className="customer-highlight-list">
              <div>
                <span>Pagamentos confirmados</span>
                <strong>{confirmedPayments}</strong>
              </div>
              <div>
                <span>Pedidos em aberto</span>
                <strong>{openOrders}</strong>
              </div>
              <div>
                <span>Perfil</span>
                <strong>{session.user.role}</strong>
              </div>
            </div>
          </article>

          <div className="customer-action-grid">
            <Link href="/app/wallet" prefetch={false} className="customer-action-card">
              <span className="surface-icon" aria-hidden="true">
                <Wallet size={18} strokeWidth={2.1} />
              </span>
              <strong>Carteira</strong>
              <p>Ver saldo e movimentacoes.</p>
            </Link>
            <Link href="/app/payments" prefetch={false} className="customer-action-card">
              <span className="surface-icon" aria-hidden="true">
                <CreditCard size={18} strokeWidth={2.1} />
              </span>
              <strong>Pagamentos</strong>
              <p>Gerar PIX e acompanhar status.</p>
            </Link>
            <Link href="/app/orders" prefetch={false} className="customer-action-card">
              <span className="surface-icon" aria-hidden="true">
                <ShoppingBag size={18} strokeWidth={2.1} />
              </span>
              <strong>Pedidos</strong>
              <p>Ver andamento e historico.</p>
            </Link>
            <Link href="/app/profile" prefetch={false} className="customer-action-card">
              <span className="surface-icon" aria-hidden="true">
                <CircleUserRound size={18} strokeWidth={2.1} />
              </span>
              <strong>Perfil e indicacoes</strong>
              <p>{session.user.emailVerified ? 'Consultar seus dados e seu codigo.' : 'Verificar email e acompanhar seu codigo.'}</p>
            </Link>
          </div>
        </section>

        <section className="metric-list">
          <StatCard label="Saldo disponivel" value={formatMoney(wallet.availableBalance)} meta="Carteira atual" tone="accent" />
          <StatCard label="Pagamentos recentes" value={`${payments.totalItems}`} meta="Ultimos registros" />
          <StatCard label="Pedidos recentes" value={`${orders.totalItems}`} meta="Ultimos registros" />
        </section>

        <section className="customer-referral-banner">
          <div className="customer-referral-copy">
            <div className="customer-referral-head">
              <span className="surface-icon" aria-hidden="true">
                {referral.rewardStatus === 'pending_email_verification' ? (
                  <MailCheck size={18} strokeWidth={2.1} />
                ) : (
                  <Gift size={18} strokeWidth={2.1} />
                )}
              </span>
              <div>
                <p className="eyebrow">Indicacoes</p>
                <h2>{referralView.title}</h2>
              </div>
            </div>
            <p>{referralView.description}</p>
          </div>

          <div className="customer-referral-meta">
            <div>
              <span>Seu codigo</span>
              <strong>{referral.referralCode}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{referral.emailVerified ? 'Verificado' : 'Pendente'}</strong>
            </div>
            <div>
              <span>Total ganho</span>
              <strong>{formatMoney(referral.summary.earnedAmount)}</strong>
            </div>
          </div>

          <div className="customer-referral-actions">
            <Link href="/app/profile#indicacoes" prefetch={false} className="secondary-action">
              <ArrowRight size={16} strokeWidth={2.15} aria-hidden="true" />
              Abrir indicacoes
            </Link>
            {referral.rewardStatus === 'pending_first_qualifying_topup' ? (
              <Link href="/app/payments" prefetch={false} className="primary-action">
                <CreditCard size={16} strokeWidth={2.15} aria-hidden="true" />
                Fazer deposito qualificado
              </Link>
            ) : null}
          </div>
        </section>

        <section className="dashboard-grid">
          <article className="detail-card">
            <div className="panel-heading">
              <h2>Pagamentos PIX</h2>
              <Link href="/app/payments" prefetch={false} className="panel-link">
                Ver tudo
              </Link>
            </div>

            {payments.items.length === 0 ? (
              <EmptyState title="Nenhum pagamento encontrado" description="Crie um PIX para comecar a acompanhar seus pagamentos." />
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
          </article>

          <article className="detail-card">
            <div className="panel-heading">
              <h2>Pedidos</h2>
              <Link href="/app/orders" prefetch={false} className="panel-link">
                Ver tudo
              </Link>
            </div>

            {orders.items.length === 0 ? (
              <EmptyState title="Nenhum pedido encontrado" description="Escolha um servico no catalogo para fazer seu primeiro pedido." />
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
          </article>
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

function getReferralDashboardView(status: ReferralRewardStatus, minimumTopupAmount: Money) {
  switch (status) {
    case 'pending_email_verification':
      return {
        title: 'Verifique seu email para liberar o bonus',
        description: 'Seu cadastro entrou por indicacao. Confirme o email para seguir para a etapa do primeiro deposito qualificado.',
      };
    case 'pending_first_qualifying_topup':
      return {
        title: 'Seu bonus depende do primeiro deposito',
        description: `Email verificado. Agora falta um deposito confirmado de pelo menos ${formatMoney(minimumTopupAmount)} para liberar o bonus da indicacao.`,
      };
    case 'rewarded':
      return {
        title: 'Seu bonus de indicacao ja foi aplicado',
        description: 'Seu codigo continua ativo para novos convites, e o historico completo esta disponivel na area de perfil.',
      };
    case 'not_referred':
    default:
      return {
        title: 'Seu codigo ja esta pronto para convidar',
        description: 'Compartilhe seu link de indicacao e acompanhe convidados, recompensas e status do programa no seu perfil.',
      };
  }
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
