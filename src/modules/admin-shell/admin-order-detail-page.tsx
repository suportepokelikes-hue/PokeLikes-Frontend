import { notFound } from 'next/navigation';

import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { getAdminOrderDetail } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { syncOrderAction } from '@/modules/admin-shell/actions';

type AdminOrderDetailPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  orderId: string;
};

export async function AdminOrderDetailPage({ session, orderId }: AdminOrderDetailPageProps) {
  try {
    const order = await getAdminOrderDetail(session.accessToken, orderId);

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / pedidos / detalhe"
          title={`Pedido ${order.id}`}
          description="O detalhe administrativo expande o estado comercial e tecnico do pedido sem esconder carga, remains ou erros do fornecedor."
          actions={
            <>
              <StatusBadge label={order.status} tone={mapOrderTone(order.status)} />
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

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Resumo comercial</h2>
            <dl className="detail-list">
              <div>
                <dt>Usuario</dt>
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
            <h2>Estado tecnico</h2>
            <dl className="detail-list">
              <div>
                <dt>Provider</dt>
                <dd>{order.supplier.provider}</dd>
              </div>
              <div>
                <dt>Service ID</dt>
                <dd>{order.supplier.serviceId}</dd>
              </div>
              <div>
                <dt>API order ID</dt>
                <dd>{order.supplier.apiOrderId ?? '-'}</dd>
              </div>
              <div>
                <dt>Estimated charge</dt>
                <dd>{formatMoney(order.supplier.estimatedCharge)}</dd>
              </div>
              <div>
                <dt>Actual charge</dt>
                <dd>{formatMoney(order.supplier.actualCharge)}</dd>
              </div>
              <div>
                <dt>Remains</dt>
                <dd>{order.supplier.remains ?? '-'}</dd>
              </div>
              <div>
                <dt>Ultimo erro</dt>
                <dd>{order.supplier.errorMessage || order.supplier.errorCode || '-'}</dd>
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
              <p className="section-copy">O backend ainda nao retornou eventos para este pedido.</p>
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
          description="A API nao retornou os dados esperados para este pedido administrativo."
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
