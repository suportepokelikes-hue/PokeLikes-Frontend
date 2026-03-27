import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listCustomerOrders } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';

type CustomerOrdersPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function CustomerOrdersPage({ session }: CustomerOrdersPageProps) {
  try {
    const orders = await listCustomerOrders({ accessToken: session.accessToken });

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Pedidos"
          title="Pedidos do cliente."
          description="A listagem mostra o status operacional oficial do pedido e o valor cobrado ao cliente quando disponivel."
        />

        {orders.items.length === 0 ? (
          <EmptyState title="Nenhum pedido encontrado" description="Quando um pedido for criado, ele aparecera aqui com o status real." />
        ) : (
          <DataTable columns={['ID', 'Servico', 'Status', 'Cobranca', 'Atualizado em']}>
            {orders.items.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.catalogService?.name || 'Servico nao associado'}</td>
                <td>
                  <StatusBadge label={order.status} tone={mapOrderTone(order.status)} />
                </td>
                <td>{formatMoney(order.customerCharge)}</td>
                <td>{formatDateTime(order.updatedAt)}</td>
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
          title="Nao foi possivel carregar os pedidos"
          description={error instanceof ApiClientError ? error.message : 'A API nao retornou a lista de pedidos.'}
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
