import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { getCustomerOrderDetail, listCustomerOrders } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { AdminSlideOver } from '@/modules/admin-shell/admin-slide-over';
import { buildPathWithSearch } from '@/modules/admin-shell/shared';
import { getOrderEventView, getOrderStatusView, sortOrderEvents } from '@/modules/orders/order-view';

type CustomerOrdersPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  activeOrderId?: string;
};

export async function CustomerOrdersPage({ session, activeOrderId }: CustomerOrdersPageProps) {
  try {
    const orders = await listCustomerOrders({ accessToken: session.accessToken });
    let activeOrder = null;
    let activeOrderError: string | null = null;

    if (activeOrderId) {
      try {
        activeOrder = await getCustomerOrderDetail({ accessToken: session.accessToken }, activeOrderId);
      } catch (error) {
        activeOrderError = error instanceof ApiClientError ? error.message : 'Nao foi possivel carregar este pedido.';
      }
    }

    const returnTo = buildPathWithSearch('/app/orders', {});
    const openCount = orders.items.filter((order) =>
      ['pending', 'submitted', 'queued_supplier_balance', 'in_progress'].includes(order.status),
    ).length;
    const completedCount = orders.items.filter((order) => order.status === 'completed').length;
    const activeOrderStatusView = activeOrder ? getOrderStatusView(activeOrder.status) : null;
    const activeEvents = activeOrder ? sortOrderEvents(activeOrder.events) : [];

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Pedidos"
          title="Pedidos"
          description="Acompanhe o andamento de cada pedido."
          actions={
            <>
              <Link href="/catalog" className="primary-action">
                Novo pedido
              </Link>
              <Link href="/app/payments" className="secondary-action">
                Ver pagamentos
              </Link>
            </>
          }
        />

        <section className="metric-list">
          <StatCard label="Pedidos na pagina" value={String(orders.items.length)} meta={`${orders.totalItems} no total`} />
          <StatCard label="Em andamento" value={String(openCount)} meta="Ainda precisam de atualizacao" tone="warning" />
          <StatCard label="Concluidos" value={String(completedCount)} meta="Pedidos fechados" tone="accent" />
        </section>

        {orders.items.length === 0 ? (
          <EmptyState title="Nenhum pedido encontrado" description="Escolha um servico no catalogo para fazer seu primeiro pedido." />
        ) : (
          <section className="detail-card detail-card-wide">
            <div className="panel-heading">
              <h2>Pedidos recentes</h2>
              <span className="panel-meta">Status e cobranca atual</span>
            </div>
            <DataTable columns={['ID', 'Servico', 'Status', 'Cobranca', 'Atualizado em']}>
              {orders.items.map((order) => {
                const statusView = getOrderStatusView(order.status);

                return (
                  <tr key={order.id}>
                    <td>
                      <Link href={buildPathWithSearch('/app/orders', { orderId: order.id })} className="table-link">
                        {order.id}
                      </Link>
                    </td>
                    <td>{order.catalogService?.name || 'Servico nao associado'}</td>
                    <td>
                      <StatusBadge label={statusView.label} tone={statusView.tone} />
                    </td>
                    <td>{formatMoney(order.customerCharge)}</td>
                    <td>{formatDateTime(order.updatedAt)}</td>
                  </tr>
                );
              })}
            </DataTable>
          </section>
        )}

        {activeOrder ? (
          <AdminSlideOver
            eyebrow="Pedido"
            title={activeOrder.catalogService?.name || `Pedido ${activeOrder.id}`}
            description="Acompanhe o andamento do pedido sem sair da lista."
            closeHref={returnTo}
          >
            <section className="admin-drawer-stack">
              <article className="admin-inline-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Status</p>
                    <h3>Pedido {activeOrder.id}</h3>
                  </div>
                  {activeOrderStatusView ? <StatusBadge label={activeOrderStatusView.label} tone={activeOrderStatusView.tone} /> : null}
                </div>
                {activeOrderStatusView ? <p className="section-copy">{activeOrderStatusView.description}</p> : null}
                {activeOrder.status === 'queued_supplier_balance' ? (
                  <p className="detail-note detail-note-warning">O pedido continua ativo. Seu saldo segue reservado enquanto o fornecedor retoma o processamento.</p>
                ) : null}
                <dl className="detail-list">
                  <div>
                    <dt>Servico</dt>
                    <dd>{activeOrder.catalogService?.name || 'Servico nao associado'}</dd>
                  </div>
                  <div>
                    <dt>Quantidade</dt>
                    <dd>{activeOrder.quantity}</dd>
                  </div>
                  <div>
                    <dt>Cobranca</dt>
                    <dd>{formatMoney(activeOrder.customerCharge)}</dd>
                  </div>
                  <div>
                    <dt>Atualizado em</dt>
                    <dd>{formatDateTime(activeOrder.updatedAt)}</dd>
                  </div>
                </dl>
              </article>

              <article className="admin-inline-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Entrega</p>
                    <h3>Link informado</h3>
                  </div>
                </div>
                <p className="code-block">{activeOrder.link}</p>
              </article>

              <article className="admin-inline-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Historico</p>
                    <h3>Atualizacoes</h3>
                  </div>
                </div>
                {activeEvents.length > 0 ? (
                  <div className="order-timeline">
                    {activeEvents.map((event) => {
                      const eventView = getOrderEventView(event, 'customer');

                      return (
                        <div key={event.id} className="order-timeline-item">
                          <div className="stack-item-head">
                            <strong>{eventView.title}</strong>
                            <span>{formatDateTime(event.createdAt)}</span>
                          </div>
                          <p>{eventView.description}</p>
                          {eventView.fromLabel || eventView.toLabel ? (
                            <p className="order-timeline-status">
                              {eventView.fromLabel || 'Sem status anterior'} {'->'} {eventView.toLabel || 'Sem status final'}
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="section-copy">Ainda nao houve atualizacao para este pedido.</p>
                )}
              </article>
            </section>
          </AdminSlideOver>
        ) : activeOrderError ? (
          <AdminSlideOver eyebrow="Pedido" title="Pedido indisponivel" description={activeOrderError} closeHref={returnTo}>
            <ErrorState title="Nao foi possivel abrir este pedido" description="Feche o painel e tente novamente pela lista." />
          </AdminSlideOver>
        ) : null}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-customer">
        <ErrorState
          title="Nao foi possivel carregar os pedidos"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar sua lista de pedidos.'}
        />
      </main>
    );
  }
}
