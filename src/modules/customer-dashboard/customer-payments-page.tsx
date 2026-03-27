import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { getWalletSummary, listCustomerPayments } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { createPixPaymentAction } from '@/modules/customer-transactions/actions';
import { TransactionField, TransactionForm } from '@/modules/customer-transactions/transaction-form';
import { initialTransactionFormState } from '@/modules/customer-transactions/types';

type CustomerPaymentsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function CustomerPaymentsPage({ session }: CustomerPaymentsPageProps) {
  try {
    const [wallet, payments] = await Promise.all([
      getWalletSummary({ accessToken: session.accessToken }),
      listCustomerPayments({ accessToken: session.accessToken }),
    ]);

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Pagamentos"
          title="Pagamentos PIX do cliente."
          description="A listagem reflete os estados assincronos oficiais do backend sem inventar confirmacao antecipada."
        />

        <section className="dashboard-grid">
          <TransactionForm
            title="Gerar cobranca PIX"
            description={`Seu saldo atual e ${formatMoney(wallet.availableBalance)}. O PIX criado nao significa pagamento confirmado.`}
            action={createPixPaymentAction}
            initialState={initialTransactionFormState}
            submitLabel="Criar PIX"
          >
            <TransactionField label="Valor" name="amount" type="number" required step={0.01} min={1} placeholder="0,00" />
          </TransactionForm>
        </section>

        {payments.items.length === 0 ? (
          <EmptyState title="Nenhum pagamento encontrado" description="Crie uma cobranca PIX para comecar a acompanhar seu ciclo." />
        ) : (
          <DataTable columns={['ID', 'Provider', 'Valor', 'Status', 'Expira em']}>
            {payments.items.map((payment) => (
              <tr key={payment.id}>
                <td>
                  <Link href={`/app/payments/${payment.id}`} className="table-link">
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
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-customer">
        <ErrorState
          title="Nao foi possivel carregar os pagamentos"
          description={error instanceof ApiClientError ? error.message : 'A API nao retornou a lista de pagamentos.'}
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
