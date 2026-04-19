import Link from 'next/link';
import { CreditCard, QrCode, ShieldCheck, Wallet } from 'lucide-react';

import { CustomerMetricCard, CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
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
          description="Fluxo financeiro claro para gerar, pagar e acompanhar recargas."
          compact
          actions={
            <>
              {!hasFiscalIdentity ? (
                <Link href="/app/profile?edit=1" className="primary-action">
                  <ShieldCheck size={16} strokeWidth={2.15} aria-hidden="true" />
                  Completar CPF/CNPJ
                </Link>
              ) : (
                <Link href="/app/wallet" className="secondary-action">
                  <Wallet size={16} strokeWidth={2.15} aria-hidden="true" />
                  Ver carteira
                </Link>
              )}
            </>
          }
        />

        {!hasFiscalIdentity ? (
          <div className="auth-notice auth-notice-warning" role="status" aria-live="polite">
            <strong>Antes de gerar PIX, complete seu CPF/CNPJ</strong>
            <p>O backend exige identidade fiscal real para novas cobrancas. Atualize o perfil e volte ao fluxo.</p>
          </div>
        ) : null}

        <section className="customer-dashboard-hero">
          <div className="customer-dashboard-side customer-dashboard-side-wide">
            {hasFiscalIdentity ? (
              <TransactionForm
                title="Gerar PIX"
                description={`Saldo atual ${formatMoney(wallet.availableBalance)}. ${fiscalIdentityLabel} confirmado: ${formatTaxIdForDisplay(taxId)}.`}
                action={createPixPaymentAction}
                initialState={initialTransactionFormState}
                submitLabel="Gerar PIX"
                returnTo="/app/payments"
              >
                <TransactionField label="Valor" name="amount" type="number" required step={0.01} min={1} placeholder="0,00" />
              </TransactionForm>
            ) : (
              <CustomerSectionCard
                eyebrow="Bloqueio preventivo"
                title="CPF/CNPJ necessario para recargas PIX"
                description="Sem esse dado o backend bloqueia a criacao da cobranca. O fluxo permanece travado ate a atualizacao do perfil."
                meta={<StatusBadge label="pix bloqueado" tone="warning" />}
                className="customer-payments-blocked-card"
                actions={
                  <Link href="/app/profile?edit=1" className="primary-action">
                    Completar CPF/CNPJ
                  </Link>
                }
              >
                <div className="customer-dashboard-inline-stats">
                  <div>
                    <span>O que falta</span>
                    <strong>{fiscalIdentityLabel}</strong>
                  </div>
                  <div>
                    <span>Status</span>
                    <strong>Pendente</strong>
                  </div>
                  <div>
                    <span>Destino</span>
                    <strong>Perfil do cliente</strong>
                  </div>
                </div>
              </CustomerSectionCard>
            )}
          </div>

          <div className="customer-dashboard-side">
            {latestPendingPayment ? (
              <CustomerSectionCard
                eyebrow="Pagamento em aberto"
                title={formatMoney(latestPendingPayment.amount)}
                description={getPaymentStatusView(latestPendingPayment.status).description}
                meta={
                  <StatusBadge
                    label={getPaymentStatusView(latestPendingPayment.status).badgeLabel}
                    tone={getPaymentStatusView(latestPendingPayment.status).tone}
                  />
                }
                className="customer-payment-focus-card"
                actions={
                  <Link href={buildPathWithSearch('/app/payments', { paymentId: latestPendingPayment.id })} className="primary-action">
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
                    <span>Wallet</span>
                    <strong>{formatMoney(wallet.availableBalance)}</strong>
                  </div>
                </div>
              </CustomerSectionCard>
            ) : (
              <CustomerSectionCard
                eyebrow="Pronto para recarregar"
                title="Sem PIX em aberto"
                description="Gere uma nova cobranca quando quiser repor saldo. O QR code e o copia e cola aparecem no drawer."
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

        <section className="customer-dashboard-metrics">
          <CustomerMetricCard
            label="Saldo atual"
            value={formatMoney(wallet.availableBalance)}
            meta="Disponivel na carteira."
            icon={Wallet}
            tone="accent"
          />
          <CustomerMetricCard
            label="PIX em aberto"
            value={String(pendingPayments.length)}
            meta={latestPendingPayment ? `Ultimo ${formatDateTime(latestPendingPayment.createdAt)}` : 'Sem cobranca pendente.'}
            icon={QrCode}
            tone="warning"
          />
          <CustomerMetricCard
            label="Confirmados"
            value={String(confirmedCount)}
            meta="Ja convertidos em saldo."
            icon={CreditCard}
            tone="success"
          />
          <CustomerMetricCard
            label={fiscalIdentityLabel}
            value={hasFiscalIdentity ? formatTaxIdForDisplay(taxId) : 'Pendente'}
            meta={hasFiscalIdentity ? 'Identidade validada.' : 'Necessario para gerar PIX.'}
            icon={ShieldCheck}
            tone={hasFiscalIdentity ? 'info' : 'warning'}
          />
        </section>

        {payments.items.length === 0 ? (
          <EmptyState
            title="Nenhum pagamento encontrado"
            description="A primeira recarga PIX aparece aqui com status, valor e historico."
            actionHref={hasFiscalIdentity ? '/app/payments' : '/app/profile?edit=1'}
            actionLabel={hasFiscalIdentity ? 'Gerar PIX' : 'Completar perfil'}
          />
        ) : (
          <CustomerSectionCard
            eyebrow="Historico"
            title="Pagamentos recentes"
            description="Acompanhe status, valor e ultima atualizacao de cada cobranca."
            meta={<span className="panel-meta">{payments.totalItems} registro(s)</span>}
          >
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
          </CustomerSectionCard>
        )}

        {activePayment ? (
          <AdminSlideOver
            eyebrow="Pagamento PIX"
            title={formatMoney(activePayment.amount)}
            description={activePaymentStatus?.description}
            closeHref={returnTo}
          >
            <section className="admin-drawer-stack">
              <CustomerSectionCard
                eyebrow="Status"
                title={activePaymentStatus?.title ?? 'Pagamento'}
                description={activePaymentStatus?.description}
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

              <CustomerSectionCard eyebrow="QR code" title="Escaneie para pagar" description="Use o aplicativo do banco ou o copia e cola abaixo.">
                {activePaymentQrImageSrc ? (
                  <div className="payment-qr-shell">
                    <img src={activePaymentQrImageSrc} alt="QR code PIX do pagamento" className="payment-qr-image" />
                  </div>
                ) : (
                  <p className="section-copy">QR indisponivel. Use o codigo abaixo.</p>
                )}
              </CustomerSectionCard>

              <CustomerSectionCard
                eyebrow="PIX copia e cola"
                title="Codigo para pagamento"
                description="Copie o codigo ou atualize o status enquanto a cobranca estiver pendente."
              >
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
