import { notFound } from 'next/navigation';
import Link from 'next/link';

import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { getAdminOrderDetail } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { syncOrderAction } from '@/modules/admin-shell/actions';
import { getOrderEventView, getOrderStatusView, orderHasQueuedSupplierBalance, sortOrderEvents } from '@/modules/orders/order-view';

type AdminOrderDetailPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  orderId: string;
};

export async function AdminOrderDetailPage({ session, orderId }: AdminOrderDetailPageProps) {
  try {
    const order = await getAdminOrderDetail(session.accessToken, orderId);
    const statusView = getOrderStatusView(order.status);
    const timeline = sortOrderEvents(order.events);
    const hadSupplierBalanceQueue = orderHasQueuedSupplierBalance(order);

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / pedidos / detalhe"
          title={`Pedido ${order.id}`}
          actions={
            <>
              <Link href="/admin/orders" className="secondary-action">
                Voltar aos pedidos
              </Link>
              <StatusBadge label={statusView.label} tone={statusView.tone} />
              <AdminActionForm
                action={syncOrderAction}
                submitLabel="Sincronizar agora"
                pendingLabel="Sincronizando..."
                returnTo={`/admin/orders/${order.id}`}
                hiddenFields={[{ name: 'orderId', value: order.id }]}
                tone={['pending', 'submitted', 'queued_supplier_balance', 'in_progress'].includes(order.status) ? 'primary' : 'secondary'}
              />
            </>
          }
        />

        <section className="metric-list">
          <article className={`metric-card metric-${statusView.tone === 'info' ? 'default' : statusView.tone}`}>
            <span>Status</span>
            <strong>{statusView.label}</strong>
          </article>
          <article className="metric-card metric-accent">
            <span>Cobranca do cliente</span>
            <strong>{formatMoney(order.customerCharge)}</strong>
          </article>
          <article className="metric-card metric-default">
            <span>Cliente</span>
            <strong>{order.user?.name || 'Nao associado'}</strong>
          </article>
        </section>

        {hadSupplierBalanceQueue ? (
          <section className="detail-card detail-card-wide detail-note detail-note-warning">
            <strong>Saldo do cliente reservado</strong>
            <p>O pedido passou por espera de saldo do fornecedor. O valor do cliente ficou reservado nesse periodo.</p>
          </section>
        ) : null}

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Cliente e pedido</h2>
            <dl className="detail-list">
              <div>
                <dt>Cliente</dt>
                <dd>{order.user?.name || 'Usuario nao associado'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{order.user?.email || '-'}</dd>
              </div>
              <div>
                <dt>Servico</dt>
                <dd>{order.catalogService?.name || 'Servico nao associado'}</dd>
              </div>
              <div>
                <dt>Link</dt>
                <dd className="code-block">{order.link}</dd>
              </div>
              <div>
                <dt>Quantidade</dt>
                <dd>{order.quantity}</dd>
              </div>
              <div>
                <dt>Cobranca do cliente</dt>
                <dd>{formatMoney(order.customerCharge)}</dd>
              </div>
            </dl>
          </article>

          <article className="detail-card">
            <h2>Fornecedor</h2>
            <dl className="detail-list">
              <div>
                <dt>Fornecedor</dt>
                <dd>{order.supplier.provider}</dd>
              </div>
              <div>
                <dt>ID do servico</dt>
                <dd>{order.supplier.serviceId}</dd>
              </div>
              <div>
                <dt>ID do pedido no fornecedor</dt>
                <dd>{order.supplier.apiOrderId ?? '-'}</dd>
              </div>
              <div>
                <dt>Custo estimado</dt>
                <dd>{formatMoney(order.supplier.estimatedCharge)}</dd>
              </div>
              <div>
                <dt>Custo real</dt>
                <dd>{formatMoney(order.supplier.actualCharge)}</dd>
              </div>
              <div>
                <dt>Restante</dt>
                <dd>{order.supplier.remains ?? '-'}</dd>
              </div>
              <div>
                <dt>Criado em</dt>
                <dd>{formatDateTime(order.createdAt)}</dd>
              </div>
              <div>
                <dt>Atualizado em</dt>
                <dd>{formatDateTime(order.updatedAt)}</dd>
              </div>
            </dl>
            {order.supplier.errorCode || order.supplier.errorMessage ? (
              <div className="detail-note detail-note-neutral">
                <strong>Ultimo retorno</strong>
                <p>
                  {order.supplier.errorCode ? `Codigo: ${order.supplier.errorCode}. ` : ''}
                  {order.supplier.errorMessage || 'Sem mensagem adicional.'}
                </p>
              </div>
            ) : null}
          </article>

          <article className="detail-card detail-card-wide">
            <h2>Timeline</h2>
            {timeline.length > 0 ? (
              <div className="order-timeline">
                {timeline.map((event) => {
                  const eventView = getOrderEventView(event, 'admin');

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
              <p className="section-copy">Sem atualizacoes.</p>
            )}
          </article>
        </section>
      </main>
    );
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound();
    }

    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar o detalhe do pedido"
          description="Nao foi possivel buscar os dados deste pedido."
        />
      </main>
    );
  }
}
