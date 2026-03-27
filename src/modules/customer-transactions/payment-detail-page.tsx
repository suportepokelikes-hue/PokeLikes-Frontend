import { notFound } from 'next/navigation';

import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { getCustomerPaymentDetail } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';

type PaymentDetailPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  paymentId: string;
};

export async function PaymentDetailPage({ session, paymentId }: PaymentDetailPageProps) {
  try {
    const payment = await getCustomerPaymentDetail({ accessToken: session.accessToken }, paymentId);

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Detalhe do pagamento"
          title={`Pagamento ${payment.id}`}
          description="O detalhe mostra o ciclo real do PIX, incluindo expiracao, confirmacao e codigo de pagamento."
          actions={<StatusBadge label={payment.status} tone={mapPaymentTone(payment.status)} />}
        />

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Resumo</h2>
            <dl className="detail-list">
              <div>
                <dt>Provider</dt>
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
            <h2>Estado PIX</h2>
            <dl className="detail-list">
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
          title="Nao foi possivel carregar o pagamento"
          description="A API nao retornou os dados esperados para este pagamento."
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
