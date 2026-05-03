import Link from 'next/link';
import { QrCode, Wallet } from 'lucide-react';

import { CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { getCustomerPaymentDetail, getWalletSummary, listCustomerPayments } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { PaymentResource } from '@/lib/api/contracts';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { AdminSlideOver } from '@/modules/admin-shell/admin-slide-over';
import { PaginationSummary, buildPathWithSearch } from '@/modules/admin-shell/shared';
import { PaymentPixActions } from '@/modules/customer-dashboard/payment-pix-actions';
import { getPaymentQrImageSrc, getPaymentShortId, getPaymentStatusView } from '@/modules/customer-dashboard/payment-view';
import { createPixPaymentAction } from '@/modules/customer-transactions/actions';
import { TransactionField, TransactionForm } from '@/modules/customer-transactions/transaction-form';
import { initialTransactionFormState } from '@/modules/customer-transactions/types';

type CustomerPaymentsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  activePaymentId?: string;
  page: number;
};

export async function CustomerPaymentsPage({ session, activePaymentId, page }: CustomerPaymentsPageProps) {
  try {
    const [wallet, payments] = await Promise.all([
      getWalletSummary({ accessToken: session.accessToken }),
      listCustomerPayments({ accessToken: session.accessToken }, { page }),
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

    const returnTo = buildPathWithSearch('/app/payments', {
      page: payments.page > 1 ? payments.page : undefined,
    });
    const pendingPayments = payments.items.filter((payment) => payment.status === 'pending');
    const confirmedCount = payments.items.filter((payment) => payment.status === 'confirmed').length;
    const latestPendingPayment = pendingPayments[0] ?? null;
    const activePaymentStatus = activePayment ? getPaymentStatusView(activePayment.status) : null;
    const activePaymentQrImageSrc = activePayment ? getPaymentQrImageSrc(activePayment.brCodeBase64) : null;
    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Pagamentos"
          title="Adicionar saldo com PIX"
          compact
          actions={
            <Link href="/app/wallet" className="secondary-action">
              <Wallet size={16} strokeWidth={2.15} aria-hidden="true" />
              Ver carteira
            </Link>
          }
        />

        <section className="customer-dashboard-hero">
          <div className="customer-dashboard-side customer-dashboard-side-wide">
            {latestPendingPayment ? (
              <CustomerSectionCard
                eyebrow="PIX pendente"
                title={formatMoney(latestPendingPayment.amount)}
                meta={
                  <StatusBadge
                    label={getPaymentStatusView(latestPendingPayment.status).badgeLabel}
                    tone={getPaymentStatusView(latestPendingPayment.status).tone}
                  />
                }
                className="customer-payment-focus-card"
                actions={
                  <Link
                    href={buildPathWithSearch('/app/payments', {
                      paymentId: latestPendingPayment.id,
                      page: payments.page > 1 ? payments.page : undefined,
                    })}
                    className="primary-action"
                  >
                    <QrCode size={16} strokeWidth={2.15} aria-hidden="true" />
                    Abrir pagamento
                  </Link>
                }
              >
                <div className="customer-dashboard-inline-stats">
                  <div>
                    <span>ID</span>
                    <strong>{getPaymentShortId(latestPendingPayment.id)}</strong>
                  </div>
                  <div>
                    <span>Expira</span>
                    <strong>{formatDateTime(latestPendingPayment.expiresAt)}</strong>
                  </div>
                  <div>
                    <span>Saldo</span>
                    <strong>{formatMoney(wallet.availableBalance)}</strong>
                  </div>
                </div>
              </CustomerSectionCard>
            ) : (
              <TransactionForm
                title="Gerar PIX"
                description="Informe o valor e gere seu codigo PIX."
                action={createPixPaymentAction}
                initialState={initialTransactionFormState}
                submitLabel="Gerar PIX"
                returnTo="/app/payments"
              >
                <TransactionField label="Valor" name="amount" type="number" required step={0.01} min={1} placeholder="0,00" />
              </TransactionForm>
            )}
          </div>

          <div className="customer-dashboard-side">
            {latestPendingPayment ? (
              <CustomerSectionCard
                title="Nova recarga"
                meta={<StatusBadge label="pix liberado" tone="success" />}
              >
                <div className="customer-dashboard-inline-stats">
                  <div>
                    <span>Saldo</span>
                    <strong>{formatMoney(wallet.availableBalance)}</strong>
                  </div>
                  <div>
                    <span>Confirmados</span>
                    <strong>{confirmedCount}</strong>
                  </div>
                  <div>
                    <span>Em aberto</span>
                    <strong>{pendingPayments.length}</strong>
                  </div>
                </div>
              </CustomerSectionCard>
            ) : (
              <CustomerSectionCard
                title="Sem PIX em aberto"
                meta={<StatusBadge label="sem pendencia" tone="success" />}
              >
                <div className="customer-dashboard-inline-stats">
                  <div>
                    <span>Saldo</span>
                    <strong>{formatMoney(wallet.availableBalance)}</strong>
                  </div>
                  <div>
                    <span>Confirmados</span>
                    <strong>{confirmedCount}</strong>
                  </div>
                  <div>
                    <span>Em aberto</span>
                    <strong>{pendingPayments.length}</strong>
                  </div>
                </div>
              </CustomerSectionCard>
            )}
          </div>
        </section>

        {payments.items.length === 0 ? (
          <EmptyState
            title="Nenhum pagamento encontrado"
            description="Gere um PIX para comecar."
            actionHref="/app/payments"
            actionLabel="Gerar PIX"
          />
        ) : (
          <CustomerSectionCard
            title="Historico de pagamentos"
            meta={<span className="panel-meta">{payments.totalItems} registro(s)</span>}
          >
            <DataTable columns={['Pagamento', 'Valor', 'Status', 'Atualizado']}>
              {payments.items.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <Link
                      href={buildPathWithSearch('/app/payments', {
                        paymentId: payment.id,
                        page: payments.page > 1 ? payments.page : undefined,
                      })}
                      className="table-link"
                    >
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
            <PaginationSummary
              page={payments.page}
              pageSize={payments.pageSize}
              totalItems={payments.totalItems}
              totalPages={payments.totalPages}
              pathname="/app/payments"
              params={{ paymentId: activePaymentId }}
              label="pagamentos"
            />
          </CustomerSectionCard>
        )}

        {activePayment ? (
          <AdminSlideOver
            eyebrow="Pagamento PIX"
            title={formatMoney(activePayment.amount)}
            closeHref={returnTo}
          >
            <section className="admin-drawer-stack">
              <CustomerSectionCard
                title={activePaymentStatus?.title ?? 'Pagamento'}
                meta={<StatusBadge label={activePaymentStatus?.badgeLabel ?? activePayment.status} tone={activePaymentStatus?.tone ?? 'neutral'} />}
              >
                <div className="customer-dashboard-inline-stats">
                  <div>
                    <span>ID</span>
                    <strong>{activePayment.id}</strong>
                  </div>
                  <div>
                    <span>Valor</span>
                    <strong>{formatMoney(activePayment.amount)}</strong>
                  </div>
                  <div>
                    <span>Expira em</span>
                    <strong>{formatDateTime(activePayment.expiresAt)}</strong>
                  </div>
                </div>
              </CustomerSectionCard>

              <CustomerSectionCard title="Escaneie para pagar">
                {activePaymentQrImageSrc ? (
                  <div className="payment-qr-shell">
                    <img src={activePaymentQrImageSrc} alt="QR code PIX do pagamento" className="payment-qr-image" />
                  </div>
                ) : (
                  <p className="section-copy">QR indisponivel. Use o codigo abaixo.</p>
                )}
              </CustomerSectionCard>

              <CustomerSectionCard title="Codigo PIX">
                <p className="code-block">{activePayment.brCode || 'Codigo ainda indisponivel.'}</p>
                <PaymentPixActions brCode={activePayment.brCode} autoRefresh={Boolean(activePaymentStatus?.autoRefresh)} />
              </CustomerSectionCard>
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
