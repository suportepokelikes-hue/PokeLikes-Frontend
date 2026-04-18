import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { getCustomerPaymentDetail, getCustomerProfile, getWalletSummary, listCustomerPayments } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { PaymentResource } from '@/lib/api/contracts';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { AdminSlideOver } from '@/modules/admin-shell/admin-slide-over';
import { buildPathWithSearch } from '@/modules/admin-shell/shared';
import {
  formatTaxIdForDisplay,
  getFiscalIdentityLabel,
  getUserTaxId,
  hasUserFiscalIdentity,
} from '@/modules/customer-dashboard/customer-fiscal-profile';
import { PaymentPixActions } from '@/modules/customer-dashboard/payment-pix-actions';
import { getPaymentQrImageSrc, getPaymentShortId, getPaymentStatusView } from '@/modules/customer-dashboard/payment-view';
import { createPixPaymentAction } from '@/modules/customer-transactions/actions';
import { TransactionField, TransactionForm } from '@/modules/customer-transactions/transaction-form';
import { initialTransactionFormState } from '@/modules/customer-transactions/types';

type CustomerPaymentsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  activePaymentId?: string;
};

export async function CustomerPaymentsPage({ session, activePaymentId }: CustomerPaymentsPageProps) {
  try {
    const [profile, wallet, payments] = await Promise.all([
      getCustomerProfile({ accessToken: session.accessToken }),
      getWalletSummary({ accessToken: session.accessToken }),
      listCustomerPayments({ accessToken: session.accessToken }),
    ]);
    let activePayment = null;
    let activePaymentError: string | null = null;

    if (activePaymentId) {
      try {
        activePayment = await getCustomerPaymentDetail({ accessToken: session.accessToken }, activePaymentId);
      } catch (error) {
        activePaymentError = error instanceof ApiClientError ? error.message : 'Nao foi possivel carregar este pagamento.';
      }
    }

    const returnTo = buildPathWithSearch('/app/payments', {});
    const pendingPayments = payments.items.filter((payment) => payment.status === 'pending');
    const confirmedCount = payments.items.filter((payment) => payment.status === 'confirmed').length;
    const latestPendingPayment = pendingPayments[0] ?? null;
    const activePaymentStatus = activePayment ? getPaymentStatusView(activePayment.status) : null;
    const activePaymentQrImageSrc = activePayment ? getPaymentQrImageSrc(activePayment.brCodeBase64) : null;
    const hasFiscalIdentity = hasUserFiscalIdentity(profile);
    const taxId = getUserTaxId(profile);
    const fiscalIdentityLabel = getFiscalIdentityLabel(profile);

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Pagamentos"
          title="Adicionar saldo com PIX"
          actions={
            <>
              {!hasFiscalIdentity ? (
                <Link href="/app/profile?edit=1" className="primary-action">
                  Completar CPF/CNPJ
                </Link>
              ) : null}
              <Link href="/app/wallet" className="secondary-action">
                Ver carteira
              </Link>
            </>
          }
        />

        {!hasFiscalIdentity ? (
          <div className="auth-notice auth-notice-warning" role="status" aria-live="polite">
            <strong>Antes de gerar PIX, complete seu CPF/CNPJ</strong>
            <p>
              O backend agora exige identidade fiscal real para criar novas cobrancas PIX. Atualize o perfil e volte
              para continuar.
            </p>
          </div>
        ) : null}

        <section className="dashboard-grid">
          {hasFiscalIdentity ? (
            <TransactionForm
              title="Gerar PIX"
              description={`Saldo atual: ${formatMoney(wallet.availableBalance)}. ${fiscalIdentityLabel} confirmado: ${formatTaxIdForDisplay(taxId)}.`}
              action={createPixPaymentAction}
              initialState={initialTransactionFormState}
              submitLabel="Gerar PIX"
              returnTo="/app/payments"
            >
              <TransactionField label="Valor" name="amount" type="number" required step={0.01} min={1} placeholder="0,00" />
            </TransactionForm>
          ) : (
            <section className="detail-card">
              <div className="panel-heading">
                <div className="stack-item">
                  <strong>CPF/CNPJ necessario para PIX</strong>
                  <p>Complete esse dado no perfil antes de gerar uma nova cobranca.</p>
                </div>
              </div>
              <div className="customer-profile-edit-note">
                <strong>O que falta agora</strong>
                <p>
                  Seu cadastro ainda nao tem {fiscalIdentityLabel}. Sem isso, o backend retorna bloqueio na criacao do
                  PIX.
                </p>
              </div>
              <Link href="/app/profile?edit=1" className="primary-action">
                Completar CPF/CNPJ
              </Link>
            </section>
          )}

          {latestPendingPayment ? (
            <article className="customer-note-card customer-payment-focus-card">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">Pagamento em aberto</span>
                  <strong>{formatMoney(latestPendingPayment.amount)}</strong>
                </div>
                <StatusBadge
                  label={getPaymentStatusView(latestPendingPayment.status).badgeLabel}
                  tone={getPaymentStatusView(latestPendingPayment.status).tone}
                />
              </div>
              <p>Abra o painel para pagar.</p>
              <dl className="detail-list">
                <div>
                  <dt>ID</dt>
                  <dd className="code-block">{getPaymentShortId(latestPendingPayment.id)}</dd>
                </div>
                <div>
                  <dt>Expira</dt>
                  <dd>{formatDateTime(latestPendingPayment.expiresAt)}</dd>
                </div>
              </dl>
              <Link href={buildPathWithSearch('/app/payments', { paymentId: latestPendingPayment.id })} className="primary-action">
                Abrir pagamento
              </Link>
            </article>
          ) : (
            <article className="customer-note-card customer-payment-focus-card">
              <strong>Sem PIX em aberto</strong>
              <p>Gere um PIX para ver o QR code.</p>
            </article>
          )}
        </section>

        <section className="metric-list">
          <StatCard label="Saldo atual" value={formatMoney(wallet.availableBalance)} tone="accent" />
          <StatCard label="Em aberto" value={String(pendingPayments.length)} tone="warning" />
          <StatCard label="Confirmados" value={String(confirmedCount)} />
        </section>

        {payments.items.length === 0 ? (
          <EmptyState title="Nenhum pagamento encontrado" description="Gere um PIX." />
        ) : (
          <section className="detail-card detail-card-wide">
            <div className="panel-heading">
              <h2>Historico</h2>
              <span className="panel-meta">{payments.totalItems} registro(s)</span>
            </div>
            <DataTable columns={['Pagamento', 'Valor', 'Status', 'Atualizado']}>
              {payments.items.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <Link href={buildPathWithSearch('/app/payments', { paymentId: payment.id })} className="table-link">
                      PIX {getPaymentShortId(payment.id)}
                    </Link>
                  </td>
                  <td>{formatMoney(payment.amount)}</td>
                  <td>
                    <StatusBadge label={getPaymentStatusView(payment.status).badgeLabel} tone={getPaymentStatusView(payment.status).tone} />
                  </td>
                  <td>{formatDateTime(getPaymentTimelineDate(payment))}</td>
                </tr>
              ))}
            </DataTable>
          </section>
        )}

        {activePayment ? (
          <AdminSlideOver eyebrow="Pagamento PIX" title={formatMoney(activePayment.amount)} closeHref={returnTo}>
            <section className="admin-drawer-stack">
              <article className="admin-inline-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Status</p>
                    <h3>{activePaymentStatus?.title}</h3>
                  </div>
                  <StatusBadge label={activePaymentStatus?.badgeLabel ?? activePayment.status} tone={activePaymentStatus?.tone ?? 'neutral'} />
                </div>
                <dl className="detail-list">
                  <div>
                    <dt>ID</dt>
                    <dd className="code-block">{activePayment.id}</dd>
                  </div>
                  <div>
                    <dt>Valor</dt>
                    <dd>{formatMoney(activePayment.amount)}</dd>
                  </div>
                  <div>
                    <dt>Expira em</dt>
                    <dd>{formatDateTime(activePayment.expiresAt)}</dd>
                  </div>
                  <div>
                    <dt>Confirmado em</dt>
                    <dd>{formatDateTime(activePayment.confirmedAt)}</dd>
                  </div>
                </dl>
              </article>

              <article className="admin-inline-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">QR code</p>
                    <h3>Escaneie</h3>
                  </div>
                </div>
                {activePaymentQrImageSrc ? (
                  <div className="payment-qr-shell">
                    <img src={activePaymentQrImageSrc} alt="QR code PIX do pagamento" className="payment-qr-image" />
                  </div>
                ) : (
                  <p className="section-copy">QR indisponivel. Use o codigo abaixo.</p>
                )}
              </article>

              <article className="admin-inline-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Codigo PIX</p>
                    <h3>Copia e cola</h3>
                  </div>
                </div>
                <p className="code-block">{activePayment.brCode || 'Codigo ainda indisponivel.'}</p>
                <PaymentPixActions brCode={activePayment.brCode} autoRefresh={Boolean(activePaymentStatus?.autoRefresh)} />
              </article>
            </section>
          </AdminSlideOver>
        ) : activePaymentError ? (
          <AdminSlideOver eyebrow="Pagamento PIX" title="Pagamento indisponivel" description={activePaymentError} closeHref={returnTo}>
            <ErrorState title="Nao foi possivel abrir este pagamento" description="Feche o painel e tente novamente pela lista." />
          </AdminSlideOver>
        ) : null}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-customer">
        <ErrorState
          title="Nao foi possivel carregar os pagamentos"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar sua lista de pagamentos.'}
        />
      </main>
    );
  }
}

function getPaymentTimelineDate(payment: PaymentResource) {
  if (payment.confirmedAt) {
    return payment.confirmedAt;
  }

  return payment.updatedAt;
}
