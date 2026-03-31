import Link from 'next/link';
import { ArrowRight, CircleUserRound, CreditCard, ShoppingBag, Wallet } from 'lucide-react';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listCustomerOrders, listCustomerPayments, getWalletSummary } from '@/lib/api/customer';
import type { SessionState } from '@/lib/auth/session';
import { ApiClientError } from '@/lib/api/http';
import { formatDateTime, formatMoney } from '@/lib/format';

type CustomerDashboardPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function CustomerDashboardPage({ session }: CustomerDashboardPageProps) {
  try {
    const [wallet, payments, orders] = await Promise.all([
      getWalletSummary({ accessToken: session.accessToken }),
      listCustomerPayments({ accessToken: session.accessToken }),
      listCustomerOrders({ accessToken: session.accessToken }),
    ]);
    const confirmedPayments = payments.items.filter((payment) => payment.status === 'confirmed').length;
    const openOrders = orders.items.filter((order) =>
      ['pending', 'submitted', 'queued_supplier_balance', 'in_progress'].includes(order.status),
    ).length;

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Cliente autenticado"
          title={`Bem-vindo, ${session.user.name}.`}
          description="A area do cliente agora usa dados reais de wallet, pagamentos e pedidos, mantendo o shell consistente para as proximas telas."
          actions={
            <>
              <Link href="/app/profile" className="secondary-action">
                <CircleUserRound size={16} strokeWidth={2.15} aria-hidden="true" />
                Ver perfil
              </Link>
              <Link href="/catalog" className="primary-action">
                <ShoppingBag size={16} strokeWidth={2.15} aria-hidden="true" />
                Explorar catalogo
              </Link>
            </>
          }
        />

        <section className="customer-command-grid">
          <article className="customer-command-card">
            <p className="eyebrow">Console pessoal</p>
            <h2>Fluxo rapido para saldo, recarga e acompanhamento operacional.</h2>
            <p className="section-copy">
              O dashboard foi reorganizado para ficar mais proximo do Stitch do cliente: menos blocos equivalentes e
              mais hierarquia entre contexto, atalhos e dados vivos.
            </p>
          </article>
          <article className="customer-command-card customer-command-card-muted">
            <div className="customer-mini-list">
              <div>
                <span>Role</span>
                <strong>{session.user.role}</strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{session.user.email}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{session.user.status}</strong>
              </div>
            </div>
          </article>
        </section>

        <section className="customer-hero-grid">
          <article className="customer-spotlight">
            <div className="customer-spotlight-head">
              <span className="eyebrow">Panorama rapido</span>
              <StatusBadge label={session.user.status} tone={session.user.status === 'active' ? 'success' : 'warning'} />
            </div>
            <h2>{formatMoney(wallet.availableBalance)}</h2>
            <p>Saldo disponivel agora, pronto para PIX, pedidos e acompanhamento da operacao em tempo real.</p>
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
                <span>Conta autenticada</span>
                <strong>{session.user.role}</strong>
              </div>
            </div>
          </article>

          <div className="customer-action-grid">
            <Link href="/app/payments" className="customer-action-card">
              <span className="surface-icon" aria-hidden="true">
                <CreditCard size={18} strokeWidth={2.1} />
              </span>
              <strong>Gerar PIX</strong>
              <p>Adicionar saldo e acompanhar expiracao ou confirmacao.</p>
            </Link>
            <Link href="/catalog" className="customer-action-card">
              <span className="surface-icon" aria-hidden="true">
                <ShoppingBag size={18} strokeWidth={2.1} />
              </span>
              <strong>Novo pedido</strong>
              <p>Entrar no catalogo e criar ordem real a partir dos servicos publicados.</p>
            </Link>
            <Link href="/app/orders" className="customer-action-card">
              <span className="surface-icon" aria-hidden="true">
                <ArrowRight size={18} strokeWidth={2.1} />
              </span>
              <strong>Pedidos</strong>
              <p>Ver status assincrono e detalhes operacionais da fila atual.</p>
            </Link>
            <Link href="/app/profile" className="customer-action-card">
              <span className="surface-icon" aria-hidden="true">
                <CircleUserRound size={18} strokeWidth={2.1} />
              </span>
              <strong>Perfil</strong>
              <p>Conferir dados da conta e limites atuais do contrato de perfil.</p>
            </Link>
          </div>
        </section>

        <section className="metric-list">
          <StatCard label="Saldo disponivel" value={formatMoney(wallet.availableBalance)} meta="Carteira atual" tone="accent" />
          <StatCard label="Pagamentos recentes" value={`${payments.totalItems}`} meta="Ultimos 5 registros" />
          <StatCard label="Pedidos recentes" value={`${orders.totalItems}`} meta="Ultimos 5 registros" />
        </section>

        <section className="dashboard-grid">
          <article className="detail-card">
            <div className="panel-heading">
              <h2>Pagamentos PIX</h2>
              <Link href="/app/payments" className="panel-link">
                Ver area completa
              </Link>
            </div>

            {payments.items.length === 0 ? (
              <EmptyState
                title="Nenhum pagamento encontrado"
                description="Quando houver cobrancas PIX, elas aparecerao aqui com status assincrono real."
              />
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
              <Link href="/app/orders" className="panel-link">
                Ver area completa
              </Link>
            </div>

            {orders.items.length === 0 ? (
              <EmptyState
                title="Nenhum pedido encontrado"
                description="Os pedidos reais criados pelo backend vao aparecer aqui com status operacional."
              />
            ) : (
              <DataTable columns={['ID', 'Servico', 'Status', 'Atualizado em']}>
                {orders.items.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.catalogService?.name || 'Servico nao associado'}</td>
                    <td>
                      <StatusBadge label={order.status} tone={mapOrderTone(order.status)} />
                    </td>
                    <td>{formatDateTime(order.updatedAt)}</td>
                  </tr>
                ))}
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
          title="Nao foi possivel montar o dashboard do cliente"
          description={getErrorMessage(error, 'A API nao respondeu com wallet, pagamentos ou pedidos.')}
        />
      </main>
    );
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

function mapOrderTone(status: string) {
  if (status === 'completed') {
    return 'success';
  }

  if (status === 'pending' || status === 'submitted' || status === 'queued_supplier_balance' || status === 'in_progress') {
    return 'warning';
  }

  if (status === 'failed' || status === 'canceled' || status === 'partial') {
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
