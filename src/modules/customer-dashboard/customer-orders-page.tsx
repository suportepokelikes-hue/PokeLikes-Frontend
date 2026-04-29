import Link from 'next/link';
import { ArrowRight, Clock3, PackageCheck, ShoppingBag, Wallet } from 'lucide-react';

import { CustomerMetricCard, CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { getCustomerOrderDetail, listCustomerOrders } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { AdminSlideOver } from '@/modules/admin-shell/admin-slide-over';
import { PaginationSummary, buildPathWithSearch } from '@/modules/admin-shell/shared';
import { getOrderEventView, getOrderStatusView, orderHasQueuedSupplierBalance, sortOrderEvents } from '@/modules/orders/order-view';

type CustomerOrdersPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  activeOrderId?: string;
  page: number;
};

export async function CustomerOrdersPage({ session, activeOrderId, page }: CustomerOrdersPageProps) {
  try {
    const orders = await listCustomerOrders({ accessToken: session.accessToken }, { page });
    let activeOrder = null;
    let activeOrderError: string | null = null;

    if (activeOrderId) {
      try {
        activeOrder = await getCustomerOrderDetail({ accessToken: session.accessToken }, activeOrderId);
      } catch (error) {
        activeOrderError = error instanceof ApiClientError ? error.message : 'Nao foi possivel carregar este pedido.';
      }
    }

    const returnTo = buildPathWithSearch('/app/orders', {
      page: orders.page > 1 ? orders.page : undefined,
    });
    const openOrders = orders.items.filter((order) =>
      ['pending', 'submitted', 'queued_supplier_balance', 'in_progress'].includes(order.status),
    );
    const completedCount = orders.items.filter((order) => order.status === 'completed').length;
    const queuedCount = orders.items.filter((order) => order.status === 'queued_supplier_balance').length;
    const latestOrder = orders.items[0] ?? null;
    const latestOrderStatusView = latestOrder ? getOrderStatusView(latestOrder.status) : null;
    const activeOrderStatusView = activeOrder ? getOrderStatusView(activeOrder.status) : null;
    const activeEvents = activeOrder ? sortOrderEvents(activeOrder.events) : [];

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Pedidos"
          title="Pedidos"
          compact
          actions={
            <>
              <Link href="/catalog" className="primary-action">
                <ShoppingBag size={16} strokeWidth={2.15} aria-hidden="true" />
                Novo pedido
              </Link>
              <Link href="/app/payments" className="secondary-action">
                <Wallet size={16} strokeWidth={2.15} aria-hidden="true" />
                Ver pagamentos
              </Link>
            </>
          }
        />

        <section className="customer-dashboard-hero">
          <article className="customer-dashboard-command customer-orders-command">
            <div className="customer-dashboard-command-head">
              <div className="customer-dashboard-command-copy">
                <h2>{openOrders.length}</h2>
                <p>Pedidos ativos agora.</p>
              </div>
              {latestOrderStatusView ? (
                <StatusBadge label={latestOrderStatusView.label} tone={latestOrderStatusView.tone} />
              ) : null}
            </div>

            <div className="customer-dashboard-balance-row">
              <div className="customer-dashboard-snapshot">
                <div>
                  <span>Concluidos</span>
                  <strong>{completedCount}</strong>
                </div>
                <div>
                  <span>Em espera operacional</span>
                  <strong>{queuedCount}</strong>
                </div>
                <div>
                  <span>Ultimo update</span>
                  <strong>{latestOrder ? formatDateTime(latestOrder.updatedAt) : 'Sem pedidos'}</strong>
                </div>
              </div>
            </div>
          </article>

          <div className="customer-dashboard-side">
            <CustomerSectionCard
              title={latestOrder ? latestOrder.catalogService?.name || `Pedido ${latestOrder.id}` : 'Sem pedidos recentes'}
              meta={
                latestOrderStatusView ? (
                  <StatusBadge label={latestOrderStatusView.label} tone={latestOrderStatusView.tone} />
                ) : (
                  <StatusBadge label="sem pedidos" tone="neutral" />
                )
              }
              actions={
                latestOrder ? (
                  <Link
                    href={buildPathWithSearch('/app/orders', {
                      orderId: latestOrder.id,
                      page: orders.page > 1 ? orders.page : undefined,
                    })}
                    className="secondary-action"
                  >
                    <ArrowRight size={16} strokeWidth={2.15} aria-hidden="true" />
                    Abrir ultimo pedido
                  </Link>
                ) : null
              }
            >
              <div className="customer-dashboard-inline-stats">
                <div>
                  <span>Atualizado em</span>
                  <strong>{latestOrder ? formatDateTime(latestOrder.updatedAt) : '-'}</strong>
                </div>
                <div>
                  <span>Cobranca</span>
                  <strong>{latestOrder ? formatMoney(latestOrder.customerCharge) : '-'}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{latestOrderStatusView?.label || 'Sem pedidos'}</strong>
                </div>
              </div>
            </CustomerSectionCard>
          </div>
        </section>

        <section className="customer-dashboard-metrics">
          <CustomerMetricCard
            label="Pedidos ativos"
            value={String(openOrders.length)}
            icon={Clock3}
            tone="warning"
          />
          <CustomerMetricCard
            label="Concluidos"
            value={String(completedCount)}
            icon={PackageCheck}
            tone="success"
          />
          <CustomerMetricCard
            label="Em espera operacional"
            value={String(queuedCount)}
            meta="Fornecedor"
            icon={Wallet}
            tone={queuedCount > 0 ? 'warning' : 'default'}
          />
          <CustomerMetricCard
            label="Na pagina"
            value={String(orders.items.length)}
            meta={`${orders.totalItems} total`}
            icon={ShoppingBag}
            tone="default"
          />
        </section>

        {orders.items.length === 0 ? (
          <EmptyState
            title="Nenhum pedido encontrado"
            description="Escolha um servico para começar."
            actionHref="/catalog"
            actionLabel="Explorar catalogo"
          />
        ) : (
          <CustomerSectionCard
            title="Pedidos recentes"
            meta={<span className="panel-meta">{orders.totalItems} registro(s)</span>}
          >
            <DataTable columns={['ID', 'Servico', 'Status', 'Cobranca', 'Atualizado em']}>
              {orders.items.map((order) => {
                const statusView = getOrderStatusView(order.status);

                return (
                  <tr key={order.id}>
                    <td>
                      <Link
                        href={buildPathWithSearch('/app/orders', {
                          orderId: order.id,
                          page: orders.page > 1 ? orders.page : undefined,
                        })}
                        className="table-link"
                      >
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
            <PaginationSummary
              page={orders.page}
              pageSize={orders.pageSize}
              totalItems={orders.totalItems}
              totalPages={orders.totalPages}
              pathname="/app/orders"
              params={{ orderId: activeOrderId }}
              label="pedidos"
            />
          </CustomerSectionCard>
        )}

        {activeOrder ? (
          <AdminSlideOver
            eyebrow="Pedido"
            title={activeOrder.catalogService?.name || `Pedido ${activeOrder.id}`}
            closeHref={returnTo}
          >
            <section className="admin-drawer-stack">
              <CustomerSectionCard
                title={`Pedido ${activeOrder.id}`}
                meta={activeOrderStatusView ? <StatusBadge label={activeOrderStatusView.label} tone={activeOrderStatusView.tone} /> : null}
              >
                {activeOrder.status === 'queued_supplier_balance' ? (
                  <div className="detail-note detail-note-warning">
                    <strong>Pedido em espera operacional</strong>
                    <p>Saldo do fornecedor pendente. Pedido segue ativo.</p>
                  </div>
                ) : null}
                <div className="customer-dashboard-inline-stats">
                  <div>
                    <span>Servico</span>
                    <strong>{activeOrder.catalogService?.name || 'Servico nao associado'}</strong>
                  </div>
                  <div>
                    <span>Quantidade</span>
                    <strong>{activeOrder.quantity}</strong>
                  </div>
                  <div>
                    <span>Cobranca</span>
                    <strong>{formatMoney(activeOrder.customerCharge)}</strong>
                  </div>
                </div>
              </CustomerSectionCard>

              <CustomerSectionCard title="Link do pedido">
                <p className="code-block">{activeOrder.link}</p>
              </CustomerSectionCard>

              <CustomerSectionCard title="Timeline">
                {activeEvents.length > 0 ? (
                  <div className="order-timeline order-timeline-strong">
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
                  <p className="section-copy">Sem atualizacoes registradas ate agora.</p>
                )}
              </CustomerSectionCard>
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
