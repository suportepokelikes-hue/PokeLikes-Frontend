import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/table';
import { listAdminTransactions } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { AdminSummaryCard, PaginationSummary, renderTransactionDirection } from '@/modules/admin-shell/shared';

type AdminTransactionsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function AdminTransactionsPage({ session }: AdminTransactionsPageProps) {
  try {
    const transactions = await listAdminTransactions(session.accessToken);
    const credits = transactions.items.filter((item) => item.direction === 'credit').length;
    const debits = transactions.items.filter((item) => item.direction === 'debit').length;
    const latestTransaction = transactions.items[0]?.createdAt ?? null;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / transacoes"
          title="Ledger financeiro do sistema."
          description="A listagem administrativa de transacoes usa o endpoint oficial do wallet admin com direcao, saldos e referencias funcionais."
        />

        <section className="metric-list">
          <AdminSummaryCard label="Transacoes na pagina" value={String(transactions.items.length)} meta={`${transactions.totalItems} transacoes no total`} />
          <AdminSummaryCard label="Creditos" value={String(credits)} meta={`${debits} debitos na mesma pagina`} tone="accent" />
          <AdminSummaryCard label="Ultimo movimento" value={latestTransaction ? formatDateTime(latestTransaction) : '-'} meta="Ordenacao descendente por criacao" />
        </section>

        {transactions.items.length === 0 ? (
          <EmptyState title="Nenhuma transacao encontrada" description="A API nao retornou transacoes administrativas para esta consulta." />
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
          description={error instanceof ApiClientError ? error.message : 'A API nao retornou a lista administrativa de transacoes.'}
        />
      </main>
    );
  }
}
