import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listCustomerPayments } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';

type CustomerPaymentsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function CustomerPaymentsPage({ session }: CustomerPaymentsPageProps) {
  try {
    const payments = await listCustomerPayments({ accessToken: session.accessToken });

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Pagamentos"
          title="Pagamentos PIX do cliente."
          description="A listagem reflete os estados assincronos oficiais do backend sem inventar confirmacao antecipada."
        />

        {payments.items.length === 0 ? (
          <EmptyState title="Nenhum pagamento encontrado" description="Crie uma cobranca PIX para começar a acompanhar seu ciclo." />
        ) : (
          <DataTable columns={['ID', 'Provider', 'Valor', 'Status', 'Expira em']}>
            {payments.items.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
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
