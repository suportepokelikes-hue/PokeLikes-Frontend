import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { getCustomerPaymentDetail, getWalletSummary, listCustomerPayments } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { AdminSlideOver } from '@/modules/admin-shell/admin-slide-over';
import { buildPathWithSearch } from '@/modules/admin-shell/shared';
import { createPixPaymentAction } from '@/modules/customer-transactions/actions';
import { TransactionField, TransactionForm } from '@/modules/customer-transactions/transaction-form';
import { initialTransactionFormState } from '@/modules/customer-transactions/types';

type CustomerPaymentsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  activePaymentId?: string;
};

export async function CustomerPaymentsPage({ session, activePaymentId }: CustomerPaymentsPageProps) {
  try {
    const [wallet, payments] = await Promise.all([
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
    const pendingCount = payments.items.filter((payment) => payment.status === 'pending').length;
    const confirmedCount = payments.items.filter((payment) => payment.status === 'confirmed').length;

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Pagamentos"
          title="Pagamentos PIX"
          description="Crie um PIX para adicionar saldo e acompanhe o status."
          actions={
            <>
              <Link href="/app/wallet" className="secondary-action">
                Ver carteira
              </Link>
              <Link href="/catalog" className="secondary-action">
                Ir para o catalogo
              </Link>
            </>
          }
        />

        <section className="dashboard-grid">
          <TransactionForm
            title="Gerar PIX"
            description={`Saldo atual: ${formatMoney(wallet.availableBalance)}.`}
            action={createPixPaymentAction}
            initialState={initialTransactionFormState}
            submitLabel="Criar PIX"
            returnTo="/app/payments"
          >
            <TransactionField label="Valor" name="amount" type="number" required step={0.01} min={1} placeholder="0,00" />
          </TransactionForm>

          <article className="customer-note-card">
            <strong>Antes de confirmar</strong>
            <p>O saldo so entra depois da confirmacao do pagamento.</p>
            <p>Se o PIX expirar, gere um novo pagamento.</p>
          </article>
        </section>

        <section className="metric-list">
          <StatCard label="Saldo atual" value={formatMoney(wallet.availableBalance)} meta="Disponivel na carteira" tone="accent" />
          <StatCard label="Pendentes" value={String(pendingCount)} meta="Aguardando confirmacao" tone="warning" />
          <StatCard label="Confirmados" value={String(confirmedCount)} meta="Pagamentos concluidos" />
        </section>

        {payments.items.length === 0 ? (
          <EmptyState title="Nenhum pagamento encontrado" description="Crie um PIX para comecar a acompanhar seu ciclo de pagamento." />
        ) : (
          <section className="detail-card detail-card-wide">
            <div className="panel-heading">
              <h2>Pagamentos recentes</h2>
              <span className="panel-meta">Acompanhe o status de cada PIX</span>
            </div>
            <DataTable columns={['ID', 'Metodo', 'Valor', 'Status', 'Expira em']}>
              {payments.items.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <Link href={buildPathWithSearch('/app/payments', { paymentId: payment.id })} className="table-link">
                      {payment.id}
                    </Link>
                  </td>
                  <td>{payment.provider}</td>
                  <td>{formatMoney(payment.amount)}</td>
                  <td>
                    <StatusBadge label={payment.status} tone={mapPaymentTone(payment.status)} />
                  </td>
                  <td>{formatDateTime(payment.expiresAt)}</td>
                </tr>
              ))}
            </DataTable>
          </section>
        )}

        {activePayment ? (
          <AdminSlideOver
            eyebrow="Pagamento PIX"
            title={formatMoney(activePayment.amount)}
            description="Veja o status do pagamento e copie os dados do PIX sem sair da lista."
            closeHref={returnTo}
          >
            <section className="admin-drawer-stack">
              <article className="admin-inline-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Status</p>
                    <h3>Pagamento {activePayment.id}</h3>
                  </div>
                  <StatusBadge label={activePayment.status} tone={mapPaymentTone(activePayment.status)} />
                </div>
                <dl className="detail-list">
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
                    <p className="eyebrow">PIX</p>
                    <h3>Codigo copia e cola</h3>
                  </div>
                </div>
                <p className="code-block">{activePayment.brCode || 'Codigo ainda indisponivel.'}</p>
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

function mapPaymentTone(status: string) {
  if (status === 'confirmed') {
    return 'success';
  }

  if (status === 'pending') {
    return 'warning';
  }

  if (status === 'expired' || status === 'failed' || status === 'cancelled') {
    return 'danger';
  }

  return 'neutral';
}
