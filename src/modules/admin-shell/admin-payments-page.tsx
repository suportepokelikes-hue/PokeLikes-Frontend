import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { getAdminPaymentsSummary, listAdminPayments } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { reconcilePaymentAction, reconcilePaymentsAction } from '@/modules/admin-shell/actions';
import { AdminSummaryCard, PaginationSummary } from '@/modules/admin-shell/shared';

type AdminPaymentsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function AdminPaymentsPage({ session }: AdminPaymentsPageProps) {
  try {
    const [payments, summary] = await Promise.all([
      listAdminPayments(session.accessToken),
      getAdminPaymentsSummary(session.accessToken),
    ]);

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / pagamentos"
          title="Pagamentos administrativos."
          description="A lista usa o endpoint administrativo e expoe provider, usuario, status e volume."
          actions={
            <AdminActionForm
              action={reconcilePaymentsAction}
              submitLabel="Conciliar em lote"
              pendingLabel="Conciliando..."
              tone="primary"
              hiddenFields={[{ name: 'limit', value: '25' }]}
            />
          }
        />

        <section className="metric-list">
          <AdminSummaryCard label="Pendentes" value={String(summary.counts.pending)} meta="Aguardando confirmacao ou conciliacao" tone="warning" />
          <AdminSummaryCard label="Confirmados" value={String(summary.counts.confirmed)} meta="Volume confirmado pela API" tone="accent" />
          <AdminSummaryCard label="Volume confirmado" value={formatMoney(summary.confirmedVolume)} meta="Resumo oficial de pagamentos" />
        </section>

        {payments.items.length === 0 ? (
          <EmptyState title="Nenhum pagamento encontrado" description="A API nao retornou pagamentos para a listagem atual." />
        ) : (
          <>
            <DataTable columns={['ID', 'Usuario', 'Provider', 'Valor', 'Status', 'Criado em', 'Acao']}>
              {payments.items.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.user?.email || '-'}</td>
                  <td>
                    <div className="stack-list">
                      <strong>{payment.provider}</strong>
                      <span className="panel-meta">{payment.providerPaymentId}</span>
                    </div>
                  </td>
                  <td>{formatMoney(payment.amount)}</td>
                  <td>
                    <StatusBadge label={payment.status} tone={mapPaymentTone(payment.status)} />
                  </td>
                  <td>{formatDateTime(payment.createdAt)}</td>
                  <td>
                    <AdminActionForm
                      action={reconcilePaymentAction}
                      submitLabel="Conciliar"
                      pendingLabel="Conciliando..."
                      hiddenFields={[{ name: 'paymentId', value: payment.id }]}
                      tone={payment.status === 'pending' ? 'primary' : 'secondary'}
                    />
                  </td>
                </tr>
              ))}
            </DataTable>
            <PaginationSummary page={payments.page} pageSize={payments.pageSize} totalItems={payments.totalItems} label="pagamentos" />
          </>
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
