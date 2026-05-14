import Link from 'next/link';

import { AdminSectionCard } from '@/components/ui/admin-surfaces';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listAdminSupportTickets } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime } from '@/lib/format';
import type { AdminSupportTicketsListParams } from '@/modules/admin-shell/query';
import { AdminFilterBar, AdminSummaryCard, PaginationSummary } from '@/modules/admin-shell/shared';

import { getAdminSupportTicketStatusView, sortAdminSupportTickets } from './support-view';

type AdminSupportPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminSupportTicketsListParams;
};

export async function AdminSupportPage({ session, filters }: AdminSupportPageProps) {
  try {
    const tickets = await listAdminSupportTickets(session.accessToken, filters);
    const sortedTickets = sortAdminSupportTickets(tickets.items);
    const openCount = tickets.items.filter((ticket) => ticket.status === 'open').length;
    const waitingCustomerCount = tickets.items.filter((ticket) => ticket.status === 'waiting_customer').length;
    const closedCount = tickets.items.filter((ticket) => ticket.status === 'closed').length;

    return (
      <main className="page page-admin admin-support-page">
        <PageHeader
          eyebrow="Admin / suporte"
          title="Tickets"
          description="Atendimento do cliente com leitura de prioridade, conversa e fechamento operacional."
          actions={
            <AdminFilterBar
              pathname="/admin/support"
              fields={[
                { name: 'search', label: 'Busca', type: 'search', placeholder: 'Assunto, cliente ou mensagem', defaultValue: filters.search },
                {
                  name: 'status',
                  label: 'Status',
                  type: 'select',
                  defaultValue: filters.status,
                  options: [
                    { label: 'Abertos', value: 'open' },
                    { label: 'Aguardando cliente', value: 'waiting_customer' },
                    { label: 'Fechados', value: 'closed' },
                  ],
                },
                { name: 'userId', label: 'ID do cliente', defaultValue: filters.userId },
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
          }
        />

        <section className="metric-list">
          <AdminSummaryCard label="Abertos" value={String(openCount)} meta="Prioridade da fila" tone="warning" />
          <AdminSummaryCard label="Aguardando cliente" value={String(waitingCustomerCount)} tone="accent" />
          <AdminSummaryCard label="Fechados" value={String(closedCount)} />
        </section>

        {sortedTickets.length === 0 ? (
          <EmptyState title="Nenhum ticket encontrado" description="Ajuste os filtros para consultar outros atendimentos." />
        ) : (
          <AdminSectionCard
            eyebrow="Suporte"
            title="Fila de tickets"
            description="Tickets abertos aparecem primeiro; dentro de cada estado, a lista prioriza a ultima atualizacao."
            meta={<span className="panel-meta">{tickets.totalItems} registros</span>}
          >
            <DataTable columns={['Assunto', 'Cliente', 'Status', 'Ultima atualizacao', 'Criado em', 'Acao']} minWidth="72rem">
              {sortedTickets.map((ticket) => {
                const statusView = getAdminSupportTicketStatusView(ticket.status);

                return (
                  <tr key={ticket.id}>
                    <td>
                      <div className="stack-list">
                        <Link href={`/admin/support/${ticket.id}`} className="table-link">
                          {ticket.subject}
                        </Link>
                        <span className="panel-meta">{ticket.id}</span>
                      </div>
                    </td>
                    <td>
                      <div className="stack-list">
                        <strong>{ticket.user?.name || 'Cliente nao associado'}</strong>
                        <span className="panel-meta">{ticket.user?.email || ticket.userId}</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge label={statusView.label} tone={statusView.tone} />
                    </td>
                    <td>{formatDateTime(ticket.lastMessageAt || ticket.updatedAt)}</td>
                    <td>{formatDateTime(ticket.createdAt)}</td>
                    <td>
                      <Link href={`/admin/support/${ticket.id}`} className="panel-link">
                        Abrir
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </DataTable>

            <PaginationSummary
              page={tickets.page}
              pageSize={tickets.pageSize}
              totalItems={tickets.totalItems}
              totalPages={tickets.totalPages}
              pathname="/admin/support"
              params={{ ...filters, pageSize: filters.pageSize ?? tickets.pageSize }}
              label="tickets"
            />
          </AdminSectionCard>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar os tickets"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar a fila de suporte.'}
        />
      </main>
    );
  }
}
