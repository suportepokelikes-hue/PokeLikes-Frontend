import { notFound } from 'next/navigation';
import Link from 'next/link';

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
          description="Veja status, cliente e atualizacoes deste pagamento."
          actions={
            <>
              <Link href="/admin/payments" className="secondary-action">
                Voltar aos pagamentos
              </Link>
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

        <section className="metric-list">
          <article className="metric-card metric-accent">
            <span>Valor</span>
            <strong>{formatMoney(payment.amount)}</strong>
          </article>
          <article className={`metric-card metric-${mapPaymentTone(payment.status)}`}>
            <span>Status</span>
            <strong>{payment.status}</strong>
          </article>
          <article className="metric-card metric-default">
            <span>Cliente</span>
            <strong>{payment.user?.name || 'Nao associado'}</strong>
          </article>
        </section>

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Cliente e pagamento</h2>
            <dl className="detail-list">
              <div>
                <dt>Cliente</dt>
                <dd>{payment.user?.name || 'Usuario nao associado'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{payment.user?.email || '-'}</dd>
              </div>
              <div>
                <dt>Metodo</dt>
                <dd>{payment.provider}</dd>
              </div>
              <div>
                <dt>Valor</dt>
                <dd>{formatMoney(payment.amount)}</dd>
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
            <h2>Detalhes do PIX</h2>
            <dl className="detail-list">
              <div>
                <dt>ID do pagamento no fornecedor</dt>
                <dd className="code-block">{payment.providerPaymentId}</dd>
              </div>
              <div>
                <dt>Creditado na carteira</dt>
                <dd>{formatDateTime(payment.walletCreditedAt)}</dd>
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
                      Processamento: {event.processingStatus}
                      {event.processedAt ? ` / processado em ${formatDateTime(event.processedAt)}` : ''}
                    </p>
                    <span>
                      Evento no fornecedor: {event.providerEventId || '-'} / pagamento no fornecedor: {event.providerPaymentId || '-'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="section-copy">Ainda nao ha atualizacoes para este pagamento.</p>
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
          description="Nao foi possivel buscar os dados deste pagamento."
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
