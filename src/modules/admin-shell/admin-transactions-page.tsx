import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/table';
import { listAdminTransactions } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { createWalletAdjustmentAction } from '@/modules/admin-shell/actions';
import { AdminWalletAdjustmentForm } from '@/modules/admin-shell/admin-wallet-adjustment-form';
import type { AdminTransactionsListParams } from '@/modules/admin-shell/query';
import { AdminFilterBar, AdminSummaryCard, PaginationSummary, buildPathWithSearch, renderTransactionDirection } from '@/modules/admin-shell/shared';

type AdminTransactionsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminTransactionsListParams;
};

export async function AdminTransactionsPage({ session, filters }: AdminTransactionsPageProps) {
  try {
    const transactions = await listAdminTransactions(session.accessToken, filters);
    const returnTo = buildPathWithSearch('/admin/transactions', {
      ...filters,
      page: filters.page ?? transactions.page,
      pageSize: filters.pageSize ?? transactions.pageSize,
    });
    const credits = transactions.items.filter((item) => item.direction === 'credit').length;
    const debits = transactions.items.filter((item) => item.direction === 'debit').length;
    const latestTransaction = transactions.items[0]?.createdAt ?? null;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / transacoes"
          title="Transacoes"
          description="Acompanhe creditos, debitos e ajustes de carteira."
          actions={
            <AdminFilterBar
              pathname="/admin/transactions"
              fields={[
                { name: 'search', label: 'Busca', type: 'search', placeholder: 'Referencia ou usuario', defaultValue: filters.search },
                { name: 'userId', label: 'User ID', defaultValue: filters.userId },
                { name: 'type', label: 'Tipo', defaultValue: filters.type },
                {
                  name: 'direction',
                  label: 'Direcao',
                  type: 'select',
                  defaultValue: filters.direction,
                  options: [
                    { label: 'Credito', value: 'credit' },
                    { label: 'Debito', value: 'debit' },
                  ],
                },
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
          }
        />

        <section className="metric-list">
          <AdminSummaryCard label="Transacoes na pagina" value={String(transactions.items.length)} meta={`${transactions.totalItems} transacoes no total`} />
          <AdminSummaryCard label="Creditos" value={String(credits)} meta={`${debits} debitos na mesma pagina`} tone="accent" />
          <AdminSummaryCard label="Ultimo movimento" value={latestTransaction ? formatDateTime(latestTransaction) : '-'} meta="Movimento mais recente" />
        </section>

        <section className="feedback-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Operacao manual</p>
              <h2>Ajustar carteira do usuario</h2>
            </div>
          </div>
          <p>Use esta acao para creditar ou debitar a carteira de um usuario.</p>
          <AdminWalletAdjustmentForm action={createWalletAdjustmentAction} returnTo={returnTo} defaultUserId={filters.userId} />
        </section>

        {transactions.items.length === 0 ? (
          <EmptyState title="Nenhuma transacao encontrada" description="Nenhuma transacao foi encontrada com os filtros atuais." />
        ) : (
          <>
            <DataTable columns={['Usuario', 'Tipo', 'Direcao', 'Valor', 'Saldo antes / depois', 'Referencia', 'Criado em']}>
              {transactions.items.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <div className="stack-list">
                      <strong>{transaction.user.name}</strong>
                      <span className="panel-meta">{transaction.user.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="stack-list">
                      <strong>{transaction.type}</strong>
                      <span className="panel-meta">{transaction.id}</span>
                    </div>
                  </td>
                  <td>{renderTransactionDirection(transaction)}</td>
                  <td>{formatMoney(transaction.amount)}</td>
                  <td>
                    <div className="stack-list">
                      <span className="panel-meta">Antes: {formatMoney(transaction.balanceBefore)}</span>
                      <span className="panel-meta">Depois: {formatMoney(transaction.balanceAfter)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="stack-list">
                      <strong>{transaction.referenceType || 'Sem referencia'}</strong>
                      <span className="panel-meta">{transaction.referenceId || '-'}</span>
                    </div>
                  </td>
                  <td>{formatDateTime(transaction.createdAt)}</td>
                </tr>
              ))}
            </DataTable>

            <PaginationSummary
              page={transactions.page}
              pageSize={transactions.pageSize}
              totalItems={transactions.totalItems}
              totalPages={transactions.totalPages}
              pathname="/admin/transactions"
              params={{ ...filters, pageSize: filters.pageSize ?? transactions.pageSize }}
              label="transacoes"
            />
          </>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar as transacoes admin"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar a lista de transacoes.'}
        />
      </main>
    );
  }
}
