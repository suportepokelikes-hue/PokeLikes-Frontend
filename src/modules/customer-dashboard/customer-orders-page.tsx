import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
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
    const openCount = orders.items.filter((order) =>
      ['pending', 'submitted', 'queued_supplier_balance', 'in_progress'].includes(order.status),
    ).length;
    const completedCount = orders.items.filter((order) => order.status === 'completed').length;

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Pedidos"
          title="Pedidos"
          description="Acompanhe o andamento de cada pedido."
          actions={
            <>
              <Link href="/catalog" className="primary-action">
                Novo pedido
              </Link>
              <Link href="/app/payments" className="secondary-action">
                Ver pagamentos
              </Link>
            </>
          }
        />

        <section className="metric-list">
          <StatCard label="Pedidos na pagina" value={String(orders.items.length)} meta={`${orders.totalItems} no total`} />
          <StatCard label="Em andamento" value={String(openCount)} meta="Ainda precisam de atualizacao" tone="warning" />
          <StatCard label="Concluidos" value={String(completedCount)} meta="Pedidos fechados" tone="accent" />
        </section>

        {orders.items.length === 0 ? (
          <EmptyState title="Nenhum pedido encontrado" description="Escolha um servico no catalogo para fazer seu primeiro pedido." />
        ) : (
          <section className="detail-card detail-card-wide">
            <div className="panel-heading">
              <h2>Pedidos recentes</h2>
              <span className="panel-meta">Status e cobranca atual</span>
            </div>
            <DataTable columns={['ID', 'Servico', 'Status', 'Cobranca', 'Atualizado em']}>
              {orders.items.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/app/orders/${order.id}`} className="table-link">
                      {order.id}
                    </Link>
                  </td>
                  <td>{order.catalogService?.name || 'Servico nao associado'}</td>
                  <td>
                    <StatusBadge label={order.status} tone={mapOrderTone(order.status)} />
                  </td>
                  <td>{formatMoney(order.customerCharge)}</td>
                  <td>{formatDateTime(order.updatedAt)}</td>
                </tr>
              ))}
            </DataTable>
          </section>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-customer">
        <ErrorState
          title="Nao foi possivel carregar os pedidos"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar sua lista de pedidos.'}
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
