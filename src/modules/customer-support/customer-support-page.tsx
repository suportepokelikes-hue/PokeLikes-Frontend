import Link from 'next/link';
import { Headphones, MessageCircle, Search } from 'lucide-react';

import { CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import type { SupportTicketStatus } from '@/lib/api/contracts';
import { listCustomerSupportTickets } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime } from '@/lib/format';
import { PaginationSummary, buildPathWithSearch } from '@/modules/admin-shell/shared';

import { SupportTicketForm } from './support-forms';
import { getSupportTicketStatusView } from './support-view';

type CustomerSupportPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  page: number;
  status?: SupportTicketStatus;
  search?: string;
};

const SUPPORT_STATUS_FILTERS: Array<{ label: string; value?: SupportTicketStatus }> = [
  { label: 'Todos' },
  { label: 'Abertos', value: 'open' },
  { label: 'Aguardando voce', value: 'waiting_customer' },
  { label: 'Fechados', value: 'closed' },
];

export async function CustomerSupportPage({ session, page, status, search }: CustomerSupportPageProps) {
  try {
    const tickets = await listCustomerSupportTickets(
      { accessToken: session.accessToken },
      { page, pageSize: 8, sortOrder: 'desc', status, search },
    );
    const hasFilters = Boolean(status || search);

    return (
      <main className="page page-customer customer-support-page">
        <PageHeader
          title="Suporte"
          compact
          actions={
            <Link href="/app/orders" className="secondary-action">
              <MessageCircle size={16} strokeWidth={2.15} aria-hidden="true" />
              Pedidos
            </Link>
          }
        />

        <section className="customer-support-grid">
          <CustomerSectionCard
            title="Abrir ticket"
            meta={<StatusBadge label="sem upload" tone="info" />}
            className="customer-support-form-card"
          >
            <SupportTicketForm returnTo="/app/support" />
          </CustomerSectionCard>

          <CustomerSectionCard
            title="Como agilizar"
            meta={<Headphones size={18} strokeWidth={2.1} aria-hidden="true" />}
            className="customer-support-guide-card"
          >
            <div className="customer-dashboard-inline-stats">
              <div>
                <span>Pedido</span>
                <strong>Envie o ID quando o problema for em uma compra.</strong>
              </div>
              <div>
                <span>Pagamento</span>
                <strong>Informe o PIX ou status visto na tela.</strong>
              </div>
              <div>
                <span>Anexos</span>
                <strong>Upload ainda nao esta disponivel nesta versao.</strong>
              </div>
            </div>
          </CustomerSectionCard>
        </section>

        <CustomerSectionCard
          title="Seus tickets"
          meta={<span className="panel-meta">{tickets.totalItems} registro(s)</span>}
        >
          <form action="/app/support" className="customer-orders-filter-form customer-support-filter-form">
            <label className="toolbar-field customer-orders-status-field">
              <span>Status</span>
              <select name="status" defaultValue={status ?? ''} className="toolbar-input">
                {SUPPORT_STATUS_FILTERS.map((filter) => (
                  <option key={filter.value ?? 'all'} value={filter.value ?? ''}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="toolbar-field customer-orders-search-field">
              <span>Buscar</span>
              <input
                type="search"
                name="search"
                defaultValue={search ?? ''}
                placeholder="Buscar por assunto ou mensagem"
                className="toolbar-input"
              />
            </label>

            <div className="customer-orders-toolbar-actions">
              <button type="submit" className="primary-action">
                <Search size={16} strokeWidth={2.1} aria-hidden="true" />
                Buscar
              </button>
              {hasFilters ? (
                <Link href="/app/support" className="secondary-action">
                  Limpar filtros
                </Link>
              ) : null}
            </div>
          </form>

          {tickets.items.length === 0 ? (
            <EmptyState
              title={hasFilters ? 'Nenhum ticket encontrado' : 'Voce ainda nao abriu tickets'}
              description={
                hasFilters
                  ? 'Ajuste a busca ou limpe os filtros para ver outros tickets.'
                  : 'Abra um ticket quando precisar falar com o suporte.'
              }
              actionHref={hasFilters ? '/app/support' : undefined}
              actionLabel={hasFilters ? 'Limpar filtros' : undefined}
            />
          ) : (
            <DataTable columns={['Assunto', 'Status', 'Ultima atualizacao', 'Acao']} minWidth="48rem">
              {tickets.items.map((ticket) => {
                const statusView = getSupportTicketStatusView(ticket.status);

                return (
                  <tr key={ticket.id}>
                    <td>
                      <Link href={`/app/support/${ticket.id}`} className="table-link">
                        {ticket.subject}
                      </Link>
                    </td>
                    <td>
                      <StatusBadge label={statusView.label} tone={statusView.tone} />
                    </td>
                    <td>{formatDateTime(ticket.lastMessageAt || ticket.updatedAt)}</td>
                    <td>
                      <Link href={`/app/support/${ticket.id}`} className="panel-link">
                        Ver conversa
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </DataTable>
          )}

          {tickets.items.length > 0 ? (
            <PaginationSummary
              page={tickets.page}
              pageSize={tickets.pageSize}
              totalItems={tickets.totalItems}
              totalPages={tickets.totalPages}
              pathname="/app/support"
              params={{ status, search }}
              label="tickets"
            />
          ) : null}
        </CustomerSectionCard>
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-customer">
        <ErrorState
          title="Nao foi possivel carregar o suporte"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar seus tickets agora.'}
        />
      </main>
    );
  }
}
