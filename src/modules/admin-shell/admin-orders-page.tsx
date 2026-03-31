import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import Link from 'next/link';
import { listAdminOrders } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatMoney } from '@/lib/format';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { syncOrderAction, syncOrdersAction } from '@/modules/admin-shell/actions';
import type { AdminOrdersListParams } from '@/modules/admin-shell/query';
import { AdminFilterBar, AdminSummaryCard, PaginationSummary, buildPathWithSearch } from '@/modules/admin-shell/shared';

type AdminOrdersPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminOrdersListParams;
};

export async function AdminOrdersPage({ session, filters }: AdminOrdersPageProps) {
  try {
    const orders = await listAdminOrders(session.accessToken, filters);
    const returnTo = buildPathWithSearch('/admin/orders', filters);
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
          description="Acompanhe status, fornecedor e cobranca dos pedidos."
          actions={
            <>
              <AdminFilterBar
                pathname="/admin/orders"
                fields={[
                  { name: 'search', label: 'Busca', type: 'search', placeholder: 'Pedido ou servico', defaultValue: filters.search },
                  {
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    defaultValue: filters.status,
                    options: [
                      { label: 'Pendente', value: 'pending' },
                      { label: 'Submitted', value: 'submitted' },
                      { label: 'Fila saldo', value: 'queued_supplier_balance' },
                      { label: 'Em andamento', value: 'in_progress' },
                      { label: 'Concluido', value: 'completed' },
                      { label: 'Parcial', value: 'partial' },
                      { label: 'Cancelado', value: 'canceled' },
                      { label: 'Falho', value: 'failed' },
                    ],
                  },
                  { name: 'userId', label: 'ID do usuario', defaultValue: filters.userId },
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
                action={syncOrdersAction}
                submitLabel="Sincronizar em lote"
                pendingLabel="Sincronizando..."
                tone="primary"
                returnTo={returnTo}
                hiddenFields={[{ name: 'limit', value: '25' }]}
              />
            </>
          }
        />

        <section className="metric-list">
          <AdminSummaryCard label="Mutaveis" value={String(mutableCount)} meta="Pedidos ainda operacionais" tone="warning" />
          <AdminSummaryCard label="Concluidos" value={String(completedCount)} meta="Pedidos fechados na pagina" tone="accent" />
          <AdminSummaryCard label="Com atencao" value={String(failedCount)} meta="Falhos, parciais ou cancelados" tone="danger" />
        </section>

        {orders.items.length === 0 ? (
          <EmptyState title="Nenhum pedido encontrado" description="Nenhum pedido foi encontrado com os filtros atuais." />
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
                      returnTo={returnTo}
                      hiddenFields={[{ name: 'orderId', value: order.id }]}
                      tone={['pending', 'submitted', 'queued_supplier_balance', 'in_progress'].includes(order.status) ? 'primary' : 'secondary'}
                    />
                    <Link href={`/admin/orders/${order.id}`} className="panel-link">
                      Ver detalhe
                    </Link>
                  </td>
                </tr>
              ))}
            </DataTable>
            <PaginationSummary
              page={orders.page}
              pageSize={orders.pageSize}
              totalItems={orders.totalItems}
              totalPages={orders.totalPages}
              pathname="/admin/orders"
              params={{ ...filters, pageSize: filters.pageSize ?? orders.pageSize }}
              label="pedidos"
            />
          </>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar os pedidos admin"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar a lista de pedidos.'}
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
