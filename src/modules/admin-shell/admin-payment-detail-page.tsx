import { notFound } from 'next/navigation';

import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { getAdminPaymentDetail } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { reconcilePaymentAction } from '@/modules/admin-shell/actions';

type AdminPaymentDetailPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  paymentId: string;
};

export async function AdminPaymentDetailPage({ session, paymentId }: AdminPaymentDetailPageProps) {
  try {
    const payment = await getAdminPaymentDetail(session.accessToken, paymentId);

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / pagamentos / detalhe"
          title={`Pagamento ${payment.id}`}
          description="O drill-down administrativo mostra o ciclo completo do pagamento, o usuario impactado e a timeline de eventos retornada pelo backend."
          actions={
            <>
              <StatusBadge label={payment.status} tone={mapPaymentTone(payment.status)} />
              <AdminActionForm
                action={reconcilePaymentAction}
                submitLabel="Conciliar agora"
                pendingLabel="Conciliando..."
                returnTo={`/admin/payments/${payment.id}`}
                hiddenFields={[{ name: 'paymentId', value: payment.id }]}
                tone={payment.status === 'pending' ? 'primary' : 'secondary'}
              />
            </>
          }
        />

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Resumo financeiro</h2>
            <dl className="detail-list">
              <div>
                <dt>Provider</dt>
                <dd>{payment.provider}</dd>
              </div>
              <div>
                <dt>Provider payment ID</dt>
                <dd className="code-block">{payment.providerPaymentId}</dd>
              </div>
              <div>
                <dt>Valor</dt>
                <dd>{formatMoney(payment.amount)}</dd>
              </div>
              <div>
                <dt>Creditado na wallet</dt>
                <dd>{formatDateTime(payment.walletCreditedAt)}</dd>
              </div>
              <div>
                <dt>Criado em</dt>
                <dd>{formatDateTime(payment.createdAt)}</dd>
              </div>
              <div>
                <dt>Atualizado em</dt>
                <dd>{formatDateTime(payment.updatedAt)}</dd>
              </div>
            </dl>
          </article>

          <article className="detail-card">
            <h2>Cliente e PIX</h2>
            <dl className="detail-list">
              <div>
                <dt>Usuario</dt>
                <dd>{payment.user?.name || 'Usuario nao associado'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{payment.user?.email || '-'}</dd>
              </div>
              <div>
                <dt>Expira em</dt>
                <dd>{formatDateTime(payment.expiresAt)}</dd>
              </div>
              <div>
                <dt>Confirmado em</dt>
                <dd>{formatDateTime(payment.confirmedAt)}</dd>
              </div>
              <div>
                <dt>BR Code</dt>
                <dd className="code-block">{payment.brCode || '-'}</dd>
              </div>
            </dl>
          </article>

          <article className="detail-card detail-card-wide">
            <h2>Timeline de eventos</h2>
            {payment.events.length > 0 ? (
              <div className="stack-list">
                {payment.events.map((event) => (
                  <div key={event.id} className="stack-item">
                    <div className="stack-item-head">
                      <strong>{event.eventType}</strong>
                      <span>{formatDateTime(event.createdAt)}</span>
                    </div>
                    <p>
                      status de processamento: {event.processingStatus}
                      {event.processedAt ? ` / processado em ${formatDateTime(event.processedAt)}` : ''}
                    </p>
                    <span>
                      providerEventId: {event.providerEventId || '-'} / providerPaymentId: {event.providerPaymentId || '-'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="section-copy">O backend ainda nao retornou eventos para este pagamento.</p>
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
          title="Nao foi possivel carregar o detalhe do pagamento"
          description="A API nao retornou os dados esperados para este pagamento administrativo."
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

  return 'danger';
}
