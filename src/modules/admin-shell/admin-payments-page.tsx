import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listAdminPayments } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';

type AdminPaymentsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function AdminPaymentsPage({ session }: AdminPaymentsPageProps) {
  try {
    const payments = await listAdminPayments(session.accessToken);

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / pagamentos"
          title="Pagamentos administrativos."
          description="A lista usa o endpoint administrativo e expoe provider, usuario, status e volume."
        />

        {payments.items.length === 0 ? (
          <EmptyState title="Nenhum pagamento encontrado" description="A API nao retornou pagamentos para a listagem atual." />
        ) : (
          <DataTable columns={['ID', 'Usuario', 'Valor', 'Status', 'Criado em']}>
            {payments.items.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.user?.email || '-'}</td>
                <td>{formatMoney(payment.amount)}</td>
                <td>
                  <StatusBadge label={payment.status} tone={mapPaymentTone(payment.status)} />
                </td>
                <td>{formatDateTime(payment.createdAt)}</td>
              </tr>
            ))}
          </DataTable>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar os pagamentos admin"
          description={error instanceof ApiClientError ? error.message : 'A API nao retornou a lista administrativa de pagamentos.'}
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
