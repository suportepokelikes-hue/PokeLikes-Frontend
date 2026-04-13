import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import Link from 'next/link';
import { getAdminPaymentsSummary, listAdminPayments } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { reconcilePaymentAction, reconcilePaymentsAction } from '@/modules/admin-shell/actions';
import type { AdminPaymentsListParams } from '@/modules/admin-shell/query';
import { AdminFilterBar, AdminSummaryCard, PaginationSummary, buildPathWithSearch } from '@/modules/admin-shell/shared';

type AdminPaymentsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminPaymentsListParams;
};

export async function AdminPaymentsPage({ session, filters }: AdminPaymentsPageProps) {
  try {
    const [payments, summary] = await Promise.all([
      listAdminPayments(session.accessToken, filters),
      getAdminPaymentsSummary(session.accessToken, filters),
    ]);
    const returnTo = buildPathWithSearch('/admin/payments', filters);

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / pagamentos"
          title="Pagamentos"
          actions={
            <>
              <AdminFilterBar
                pathname="/admin/payments"
                fields={[
                  { name: 'search', label: 'Busca', type: 'search', placeholder: 'ID ou usuario', defaultValue: filters.search },
                  {
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    defaultValue: filters.status,
                    options: [
                      { label: 'Pendente', value: 'pending' },
                      { label: 'Confirmado', value: 'confirmed' },
                      { label: 'Expirado', value: 'expired' },
                      { label: 'Falho', value: 'failed' },
                      { label: 'Cancelado', value: 'cancelled' },
                    ],
                  },
                  { name: 'provider', label: 'Metodo', defaultValue: filters.provider },
                  { name: 'userId', label: 'ID do usuario', defaultValue: filters.userId },
                  { name: 'dateFrom', label: 'De', type: 'datetime-local', defaultValue: filters.dateFrom },
                  { name: 'dateTo', label: 'Ate', type: 'datetime-local', defaultValue: filters.dateTo },
                  {
                    name: 'sortOrder',
                    label: 'Ordem',
                    type: 'select',
                    defaultValue: filters.sortOrder ?? 'desc',
                    options: [
                      { label: 'Desc', value: 'desc' },
                      { label: 'Asc', value: 'asc' },
                    ],
                  },
                  {
                    name: 'pageSize',
                    label: 'Pagina',
                    type: 'select',
                    defaultValue: filters.pageSize ?? 10,
                    options: [
                      { label: '10', value: '10' },
                      { label: '20', value: '20' },
                      { label: '50', value: '50' },
                    ],
                  },
                ]}
              />
              <AdminActionForm
                action={reconcilePaymentsAction}
                submitLabel="Conciliar em lote"
                pendingLabel="Conciliando..."
                tone="primary"
                returnTo={returnTo}
                hiddenFields={[{ name: 'limit', value: '25' }]}
              />
            </>
          }
        />

        <section className="metric-list">
          <AdminSummaryCard label="Pendentes" value={String(summary.counts.pending)} tone="warning" />
          <AdminSummaryCard label="Confirmados" value={String(summary.counts.confirmed)} tone="accent" />
          <AdminSummaryCard label="Volume confirmado" value={formatMoney(summary.confirmedVolume)} />
        </section>

        {payments.items.length === 0 ? (
          <EmptyState title="Nenhum pagamento encontrado" description="Ajuste os filtros." />
        ) : (
          <>
            <DataTable columns={['ID', 'Usuario', 'Metodo', 'Valor', 'Status', 'Criado em', 'Acao']}>
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
                      returnTo={returnTo}
                      hiddenFields={[{ name: 'paymentId', value: payment.id }]}
                      tone={payment.status === 'pending' ? 'primary' : 'secondary'}
                    />
                    <Link href={`/admin/payments/${payment.id}`} className="panel-link">
                      Ver detalhe
                    </Link>
                  </td>
                </tr>
              ))}
            </DataTable>
            <PaginationSummary
              page={payments.page}
              pageSize={payments.pageSize}
              totalItems={payments.totalItems}
              totalPages={payments.totalPages}
              pathname="/admin/payments"
              params={{ ...filters, pageSize: filters.pageSize ?? payments.pageSize }}
              label="pagamentos"
            />
          </>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar os pagamentos"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar a lista de pagamentos.'}
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
