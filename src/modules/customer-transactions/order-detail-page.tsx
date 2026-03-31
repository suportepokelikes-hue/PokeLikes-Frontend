import { notFound } from 'next/navigation';

import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { getCustomerOrderDetail } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';

type OrderDetailPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  orderId: string;
};

export async function OrderDetailPage({ session, orderId }: OrderDetailPageProps) {
  try {
    const order = await getCustomerOrderDetail({ accessToken: session.accessToken }, orderId);

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Detalhe do pedido"
          title={`Pedido ${order.id}`}
          description="Acompanhe status, valor e atualizacoes do pedido."
          actions={<StatusBadge label={order.status} tone={mapOrderTone(order.status)} />}
        />

        <section className="customer-hero-grid">
          <article className="customer-spotlight">
            <div className="customer-spotlight-head">
              <span className="eyebrow">Status do pedido</span>
              <StatusBadge label={order.status} tone={mapOrderTone(order.status)} />
            </div>
            <h2>{order.catalogService?.name || 'Servico nao associado'}</h2>
            <p>Veja o andamento do pedido e os dados mais importantes em um so lugar.</p>
            <div className="customer-highlight-list">
              <div>
                <span>Quantidade</span>
                <strong>{order.quantity}</strong>
              </div>
              <div>
                <span>Cobranca</span>
                <strong>{formatMoney(order.customerCharge)}</strong>
              </div>
              <div>
                <span>Atualizado em</span>
                <strong>{formatDateTime(order.updatedAt)}</strong>
              </div>
            </div>
          </article>

          <article className="customer-note-card">
            <strong>Importante</strong>
            <p>Se houver atraso, falha ou atualizacao do fornecedor, isso aparece neste detalhe.</p>
            <p>Quando nao houver eventos, a linha do tempo ficara vazia.</p>
          </article>
        </section>

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Resumo comercial</h2>
            <dl className="detail-list">
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
            <h2>Estado tecnico</h2>
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
                <dt>Restante</dt>
                <dd>{order.supplier.remains ?? '-'}</dd>
              </div>
              <div>
                <dt>Ultimo erro</dt>
                <dd>{order.supplier.errorMessage || order.supplier.errorCode || '-'}</dd>
              </div>
              <div>
                <dt>Custo estimado</dt>
                <dd>{formatMoney(order.supplier.estimatedCharge)}</dd>
              </div>
              <div>
                <dt>Custo real</dt>
                <dd>{formatMoney(order.supplier.actualCharge)}</dd>
              </div>
            </dl>
          </article>

          <article className="detail-card detail-card-wide">
            <h2>Timeline</h2>
            {order.events && order.events.length > 0 ? (
              <div className="stack-list">
                {order.events.map((event) => (
                  <div key={event.id} className="stack-item">
                    <div className="stack-item-head">
                      <strong>{event.eventType}</strong>
                      <span>{formatDateTime(event.createdAt)}</span>
                    </div>
                    <p>
                      {event.fromStatus || '-'} {'->'} {event.toStatus || '-'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="section-copy">Ainda nao ha atualizacoes para este pedido.</p>
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
      <main className="page page-customer">
        <ErrorState
          title="Nao foi possivel carregar o pedido"
          description="Nao foi possivel buscar os dados deste pedido."
        />
      </main>
    );
  }
}

function mapOrderTone(status: string) {
  if (status === 'completed') {
    return 'success';
  }

  if (status === 'pending' || status === 'submitted' || status === 'queued_supplier_balance' || status === 'in_progress') {
    return 'warning';
  }

  return 'danger';
}
