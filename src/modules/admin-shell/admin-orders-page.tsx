import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listAdminOrders } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatMoney } from '@/lib/format';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { syncOrderAction, syncOrdersAction } from '@/modules/admin-shell/actions';
import { AdminSummaryCard, PaginationSummary } from '@/modules/admin-shell/shared';

type AdminOrdersPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function AdminOrdersPage({ session }: AdminOrdersPageProps) {
  try {
    const orders = await listAdminOrders(session.accessToken);
    const mutableCount = orders.items.filter((order) =>
      ['pending', 'submitted', 'queued_supplier_balance', 'in_progress'].includes(order.status),
    ).length;
    const failedCount = orders.items.filter((order) => ['failed', 'canceled', 'partial'].includes(order.status)).length;
    const completedCount = orders.items.filter((order) => order.status === 'completed').length;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / pedidos"
          title="Pedidos administrativos."
          description="A listagem usa o endpoint oficial de pedidos admin e mantem visivel o status operacional."
          actions={
            <AdminActionForm
              action={syncOrdersAction}
              submitLabel="Sincronizar em lote"
              pendingLabel="Sincronizando..."
              tone="primary"
              hiddenFields={[{ name: 'limit', value: '25' }]}
            />
          }
        />

        <section className="metric-list">
          <AdminSummaryCard label="Mutaveis" value={String(mutableCount)} meta="Pedidos ainda operacionais" tone="warning" />
          <AdminSummaryCard label="Concluidos" value={String(completedCount)} meta="Pedidos fechados na pagina" tone="accent" />
          <AdminSummaryCard label="Com atencao" value={String(failedCount)} meta="Falhos, parciais ou cancelados" tone="danger" />
        </section>

        {orders.items.length === 0 ? (
          <EmptyState title="Nenhum pedido encontrado" description="A API nao retornou pedidos para a listagem atual." />
        ) : (
          <>
            <DataTable columns={['ID', 'Usuario', 'Servico', 'Status', 'Fornecedor', 'Cobranca', 'Acao']}>
              {orders.items.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user?.email || '-'}</td>
                  <td>{order.catalogService?.name || 'Servico nao associado'}</td>
                  <td>
                    <StatusBadge label={order.status} tone={mapOrderTone(order.status)} />
                  </td>
                  <td>
                    <div className="stack-list">
                      <strong>{order.supplier.provider}</strong>
                      <span className="panel-meta">{order.supplier.apiOrderId ?? 'Sem apiOrderId'}</span>
                    </div>
                  </td>
                  <td>{formatMoney(order.customerCharge)}</td>
                  <td>
                    <AdminActionForm
                      action={syncOrderAction}
                      submitLabel="Sincronizar"
                      pendingLabel="Sincronizando..."
                      hiddenFields={[{ name: 'orderId', value: order.id }]}
                      tone={['pending', 'submitted', 'queued_supplier_balance', 'in_progress'].includes(order.status) ? 'primary' : 'secondary'}
                    />
                  </td>
                </tr>
              ))}
            </DataTable>
            <PaginationSummary page={orders.page} pageSize={orders.pageSize} totalItems={orders.totalItems} label="pedidos" />
          </>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar os pedidos admin"
          description={error instanceof ApiClientError ? error.message : 'A API nao retornou a lista administrativa de pedidos.'}
        />
      </main>
    );
  }
}

function mapOrderTone(status: string) {
  if (status === 'completed') {
    return 'success';
  }

  if (status === 'pending' || status === 'submitted' || status === 'queued_supplier_balance' || status === 'in_progress') {
    return 'warning';
  }

  if (status === 'failed' || status === 'canceled' || status === 'partial') {
    return 'danger';
  }

  return 'neutral';
}
