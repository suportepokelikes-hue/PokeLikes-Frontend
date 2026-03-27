import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listAdminOrders } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';

type AdminOrdersPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function AdminOrdersPage({ session }: AdminOrdersPageProps) {
  try {
    const orders = await listAdminOrders(session.accessToken);

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / pedidos"
          title="Pedidos administrativos."
          description="A listagem usa o endpoint oficial de pedidos admin e mantem visivel o status operacional."
        />

        {orders.items.length === 0 ? (
          <EmptyState title="Nenhum pedido encontrado" description="A API nao retornou pedidos para a listagem atual." />
        ) : (
          <DataTable columns={['ID', 'Usuario', 'Servico', 'Status', 'Cobranca']}>
            {orders.items.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user?.email || '-'}</td>
                <td>{order.catalogService?.name || 'Servico nao associado'}</td>
                <td>
                  <StatusBadge label={order.status} tone={mapOrderTone(order.status)} />
                </td>
                <td>{formatMoney(order.customerCharge)}</td>
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
