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
          description="Acompanhe valor, status e dados do PIX."
          actions={<StatusBadge label={payment.status} tone={mapPaymentTone(payment.status)} />}
        />

        <section className="customer-hero-grid">
          <article className="customer-spotlight">
            <div className="customer-spotlight-head">
              <span className="eyebrow">Status financeiro</span>
              <StatusBadge label={payment.status} tone={mapPaymentTone(payment.status)} />
            </div>
            <h2>{formatMoney(payment.amount)}</h2>
            <p>O saldo so muda depois da confirmacao do pagamento.</p>
            <div className="customer-highlight-list">
              <div>
                <span>Metodo</span>
                <strong>{payment.provider}</strong>
              </div>
              <div>
                <span>Expira em</span>
                <strong>{formatDateTime(payment.expiresAt)}</strong>
              </div>
              <div>
                <span>Confirmado em</span>
                <strong>{formatDateTime(payment.confirmedAt)}</strong>
              </div>
            </div>
          </article>

          <article className="customer-note-card">
            <strong>Importante</strong>
            <p>Se o pagamento ainda estiver pendente, aguarde a confirmacao.</p>
            <p>Em caso de expiracao ou falha, gere um novo PIX.</p>
          </article>
        </section>

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Resumo</h2>
            <dl className="detail-list">
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
                <dt>Pix copia e cola</dt>
                <dd className="code-block">{payment.brCode || '-'}</dd>
              </div>
              <div>
                <dt>Pix em base64</dt>
                <dd className="code-block">{payment.brCodeBase64 || '-'}</dd>
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
