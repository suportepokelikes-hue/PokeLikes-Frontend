import Link from 'next/link';
import { ExternalLink, ShoppingBag, Wallet } from 'lucide-react';

import { CustomerSectionCard } from '@/components/ui/customer-surfaces';
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
import { getOrderEventView, getOrderStatusView, sortOrderEvents } from '@/modules/orders/order-view';

type OrderStatusFilterValue = 'pending' | 'submitted' | 'in_progress' | 'completed' | 'partial' | 'canceled' | 'failed';

const ORDER_STATUS_FILTERS: Array<{ label: string; value?: OrderStatusFilterValue }> = [
  { label: 'Tudo' },
  { label: 'Pendente', value: 'pending' },
  { label: 'Processando', value: 'submitted' },
  { label: 'Em progresso', value: 'in_progress' },
  { label: 'Concluido', value: 'completed' },
  { label: 'Parcial', value: 'partial' },
  { label: 'Cancelado', value: 'canceled' },
  { label: 'Falhou', value: 'failed' },
] as const;

type CustomerOrdersPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  activeOrderId?: string;
  page: number;
  status?: string;
  search?: string;
};

export async function CustomerOrdersPage({ session, activeOrderId, page, status, search }: CustomerOrdersPageProps) {
  try {
    const orders = await listCustomerOrders(
      { accessToken: session.accessToken },
      { page, pageSize: 5, sortOrder: 'desc', status, search },
    );
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
      status,
      search,
    });
    const activeOrderStatusView = activeOrder ? getOrderStatusView(activeOrder.status) : null;
    const activeEvents = activeOrder ? sortOrderEvents(activeOrder.events) : [];
    const hasFilters = Boolean(status || search);
    const showRemainsColumn = orders.items.some((order) => order.supplier.remains !== null);

    return (
      <main className="page page-customer">
        <PageHeader
          title="Pedidos"
          compact
          actions={
            <>
              <Link href="/app/new-order" className="primary-action">
                <ShoppingBag size={16} strokeWidth={2.15} aria-hidden="true" />
                Novo pedido
              </Link>
              <Link href="/app/wallet" className="secondary-action">
                <Wallet size={16} strokeWidth={2.15} aria-hidden="true" />
                Carteira
              </Link>
            </>
          }
        />

        <CustomerSectionCard
          title="Historico de pedidos"
          meta={<span className="panel-meta">{orders.totalItems} registro(s)</span>}
        >
          <div className="customer-orders-filters">
            <nav className="customer-orders-status-bar" aria-label="Filtrar pedidos por status">
              {ORDER_STATUS_FILTERS.map((filter) => {
                const href = buildPathWithSearch('/app/orders', {
                  status: filter.value,
                  search,
                });
                const isActive = (filter.value ?? undefined) === status;

                return (
                  <Link
                    key={filter.value ?? 'all'}
                    href={href}
                    className={`customer-orders-status-pill${isActive ? ' is-active' : ''}`}
                  >
                    {filter.label}
                  </Link>
                );
              })}
            </nav>

            <form action="/app/orders" className="toolbar customer-orders-toolbar">
              {status ? <input type="hidden" name="status" value={status} /> : null}
              <label className="toolbar-field customer-orders-search-field">
                <span>Buscar</span>
                <input
                  type="search"
                  name="search"
                  defaultValue={search ?? ''}
                  placeholder="Buscar por ID, servico ou link"
                  className="toolbar-input"
                />
              </label>
              <div className="customer-orders-toolbar-actions">
                <button type="submit" className="primary-action">
                  Buscar
                </button>
                {hasFilters ? (
                  <Link href="/app/orders" className="secondary-action">
                    Limpar filtros
                  </Link>
                ) : null}
              </div>
            </form>
          </div>

          {orders.items.length === 0 ? (
            <EmptyState
              title={hasFilters ? 'Nenhum pedido encontrado para este filtro' : 'Voce ainda nao fez nenhum pedido'}
              description={
                hasFilters
                  ? 'Tente ajustar a busca ou limpar os filtros para ver outros pedidos.'
                  : 'Quando voce criar um pedido, o historico aparece aqui.'
              }
              actionHref={hasFilters ? '/app/orders' : '/app/new-order'}
              actionLabel={hasFilters ? 'Limpar filtros' : 'Novo pedido'}
            />
          ) : (
            <DataTable
              columns={['ID', 'Data', 'Link', 'Servico', 'Quantidade', 'Valor', ...(showRemainsColumn ? ['Restam'] : []), 'Status']}
              minWidth={showRemainsColumn ? '76rem' : '70rem'}
            >
              {orders.items.map((order) => {
                const statusView = getOrderStatusView(order.status);

                return (
                  <tr key={order.id}>
                    <td>
                      <Link
                        href={buildPathWithSearch('/app/orders', {
                          orderId: order.id,
                          page: orders.page > 1 ? orders.page : undefined,
                          status,
                          search,
                        })}
                        className="table-link"
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td>
                      <span className="customer-orders-date">{formatDateTime(order.createdAt)}</span>
                    </td>
                    <td>
                      <a
                        href={order.link}
                        target="_blank"
                        rel="noreferrer"
                        className="customer-orders-link"
                        title={order.link}
                        aria-label={`Abrir link do pedido ${order.id}`}
                      >
                        <span>{order.link}</span>
                        <ExternalLink size={14} strokeWidth={2.1} aria-hidden="true" />
                      </a>
                    </td>
                    <td>
                      <div className="customer-orders-service">
                        <strong>{order.catalogService?.name || 'Servico nao associado'}</strong>
                      </div>
                    </td>
                    <td>{order.quantity}</td>
                    <td>{order.customerCharge ? formatMoney(order.customerCharge) : '-'}</td>
                    {showRemainsColumn ? <td>{order.supplier.remains ?? '-'}</td> : null}
                    <td>
                      <StatusBadge label={statusView.label} tone={statusView.tone} />
                    </td>
                  </tr>
                );
              })}
            </DataTable>
          )}

          {orders.items.length > 0 ? (
            <PaginationSummary
              page={orders.page}
              pageSize={orders.pageSize}
              totalItems={orders.totalItems}
              totalPages={orders.totalPages}
              pathname="/app/orders"
              params={{ orderId: activeOrderId, status, search }}
              label="pedidos"
            />
          ) : null}
        </CustomerSectionCard>

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
                    <strong>{activeOrder.customerCharge ? formatMoney(activeOrder.customerCharge) : '-'}</strong>
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
