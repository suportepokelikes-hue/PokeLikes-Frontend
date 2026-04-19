import { notFound } from 'next/navigation';
import Link from 'next/link';

import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { AdminMetricCard, AdminSectionCard } from '@/components/ui/admin-surfaces';
import { getAdminPaymentDetail } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { reconcilePaymentAction } from '@/modules/admin-shell/actions';
import { mapPaymentTone } from '@/modules/admin-shell/shared';
import { CircleDollarSign, CreditCard, UserRound } from 'lucide-react';

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
          description="Detalhe financeiro com status, dados do PIX e eventos recebidos."
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
          <AdminMetricCard label="Valor" value={formatMoney(payment.amount)} icon={CircleDollarSign} tone="accent" />
          <AdminMetricCard label="Status" value={payment.status} icon={CreditCard} tone={resolveMetricTone(mapPaymentTone(payment.status))} />
          <AdminMetricCard label="Cliente" value={payment.user?.name || 'Nao associado'} icon={UserRound} tone="info" />
        </section>

        <section className="detail-grid">
          <AdminSectionCard eyebrow="Financeiro" title="Cliente e pagamento" description="Dados centrais da cobranca e do usuario associado.">
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
          </AdminSectionCard>

          <AdminSectionCard eyebrow="PIX" title="Detalhes do PIX" description="Provedor, expiracao, confirmacao e BR Code.">
            <dl className="detail-list">
              <div>
                <dt>ID no fornecedor</dt>
                <dd className="code-block">{payment.providerPaymentId}</dd>
              </div>
              <div>
                <dt>Creditado</dt>
                <dd>{formatDateTime(payment.walletCreditedAt)}</dd>
              </div>
              <div>
                <dt>Expira</dt>
                <dd>{formatDateTime(payment.expiresAt)}</dd>
              </div>
              <div>
                <dt>Confirmado</dt>
                <dd>{formatDateTime(payment.confirmedAt)}</dd>
              </div>
              <div>
                <dt>BR Code</dt>
                <dd className="code-block">{payment.brCode || '-'}</dd>
              </div>
            </dl>
          </AdminSectionCard>

          <AdminSectionCard eyebrow="Eventos" title="Eventos do pagamento" description="Timeline recebida do provedor e processamento interno." className="detail-card-wide">
            {payment.events.length > 0 ? (
              <div className="stack-list">
                {payment.events.map((event) => (
                  <div key={event.id} className="stack-item">
                    <div className="stack-item-head">
                      <strong>{event.eventType}</strong>
                      <span>{formatDateTime(event.createdAt)}</span>
                    </div>
                    <p>
                      Status: {event.processingStatus}
                      {event.processedAt ? ` / processado em ${formatDateTime(event.processedAt)}` : ''}
                    </p>
                    <span>
                      Evento fornecedor: {event.providerEventId || '-'} / pagamento: {event.providerPaymentId || '-'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="section-copy">Sem atualizacoes.</p>
            )}
          </AdminSectionCard>
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

function resolveMetricTone(tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger') {
  return tone === 'neutral' ? 'default' : tone;
}
