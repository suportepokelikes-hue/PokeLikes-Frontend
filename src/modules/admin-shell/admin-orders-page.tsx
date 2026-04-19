import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { AdminSectionCard } from '@/components/ui/admin-surfaces';
import Link from 'next/link';
import { listAdminOrders } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatMoney } from '@/lib/format';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { syncOrderAction, syncOrdersAction } from '@/modules/admin-shell/actions';
import type { AdminOrdersListParams } from '@/modules/admin-shell/query';
import { AdminFilterBar, AdminSummaryCard, PaginationSummary, buildPathWithSearch } from '@/modules/admin-shell/shared';
import { getOrderStatusView } from '@/modules/orders/order-view';

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
          title="Pedidos"
          description="Fila operacional com sync rapido e foco nos estados mutaveis."
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
                      { label: 'Aguardando envio', value: 'pending' },
                      { label: 'Enviado ao fornecedor', value: 'submitted' },
                      { label: 'Aguardando saldo do fornecedor', value: 'queued_supplier_balance' },
                      { label: 'Em processamento', value: 'in_progress' },
                      { label: 'Concluido', value: 'completed' },
                      { label: 'Parcial', value: 'partial' },
                      { label: 'Cancelado', value: 'canceled' },
                      { label: 'Falhou', value: 'failed' },
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
          <AdminSummaryCard label="Mutaveis" value={String(mutableCount)} meta="Operacionais" tone="warning" />
          <AdminSummaryCard label="Concluidos" value={String(completedCount)} tone="accent" />
          <AdminSummaryCard label="Com atencao" value={String(failedCount)} meta="Falhos, parciais ou cancelados" tone="danger" />
        </section>

        {orders.items.length === 0 ? (
          <EmptyState title="Nenhum pedido encontrado" description="Ajuste os filtros." />
        ) : (
          <AdminSectionCard
            eyebrow="Pedidos"
            title="Fila operacional"
            description="Status, fornecedor e sync por item."
            meta={<span className="panel-meta">{orders.totalItems} registros</span>}
          >
            <DataTable columns={['Pedido', 'Servico', 'Status', 'Fornecedor', 'Cobranca', 'Acao']}>
              {orders.items.map((order) => {
                const statusView = getOrderStatusView(order.status);

                return (
                  <tr key={order.id}>
                    <td>
                      <div className="stack-list">
                        <strong>{order.id}</strong>
                        <span className="panel-meta">{order.user?.email || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="stack-list">
                        <strong>{order.catalogService?.name || 'Servico nao associado'}</strong>
                        <span className="panel-meta">{order.quantity} item(ns)</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge label={statusView.label} tone={statusView.tone} />
                    </td>
                    <td>
                      <div className="stack-list">
                        <strong>{order.supplier.provider}</strong>
                        <span className="panel-meta">{order.supplier.apiOrderId ?? 'Sem ID'}</span>
                      </div>
                    </td>
                    <td>{formatMoney(order.customerCharge)}</td>
                    <td>
                      <div className="stack-list">
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
                      </div>
                    </td>
                </tr>
              );
              })}
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
          </AdminSectionCard>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar os pedidos"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar a lista de pedidos.'}
        />
      </main>
    );
  }
}
