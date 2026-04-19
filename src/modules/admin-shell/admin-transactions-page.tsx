import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/table';
import { AdminSectionCard } from '@/components/ui/admin-surfaces';
import { listAdminTransactions } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { createWalletAdjustmentAction } from '@/modules/admin-shell/actions';
import { AdminSlideOver } from '@/modules/admin-shell/admin-slide-over';
import { AdminWalletAdjustmentForm } from '@/modules/admin-shell/admin-wallet-adjustment-form';
import type { AdminTransactionsListParams } from '@/modules/admin-shell/query';
import { AdminFilterBar, AdminSummaryCard, PaginationSummary, buildPathWithSearch, renderTransactionDirection } from '@/modules/admin-shell/shared';

type AdminTransactionsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminTransactionsListParams;
  isAdjustOpen?: boolean;
};

export async function AdminTransactionsPage({ session, filters, isAdjustOpen = false }: AdminTransactionsPageProps) {
  try {
    const transactions = await listAdminTransactions(session.accessToken, filters);
    const returnTo = buildPathWithSearch('/admin/transactions', {
      ...filters,
      page: filters.page ?? transactions.page,
      pageSize: filters.pageSize ?? transactions.pageSize,
    });
    const adjustPath = buildPathWithSearch('/admin/transactions', {
      ...filters,
      page: filters.page ?? transactions.page,
      pageSize: filters.pageSize ?? transactions.pageSize,
      adjust: 1,
    });
    const credits = transactions.items.filter((item) => item.direction === 'credit').length;
    const debits = transactions.items.filter((item) => item.direction === 'debit').length;
    const latestTransaction = transactions.items[0]?.createdAt ?? null;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / transacoes"
          title="Transacoes"
          description="Ledger operacional com ajuste manual preservado e leitura financeira mais clara."
          actions={
            <>
              <Link href={adjustPath} className="primary-action">
                + Ajuste manual
              </Link>
              <AdminFilterBar
                pathname="/admin/transactions"
                fields={[
                  { name: 'search', label: 'Busca', type: 'search', placeholder: 'Referencia, usuario ou motivo', defaultValue: filters.search },
                  { name: 'userId', label: 'ID do usuario', defaultValue: filters.userId },
                  {
                    name: 'direction',
                    label: 'Movimento',
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
            </>
          }
        />

        <section className="metric-list">
          <AdminSummaryCard label="Na pagina" value={String(transactions.items.length)} meta={`${transactions.totalItems} no total`} />
          <AdminSummaryCard label="Creditos" value={String(credits)} meta={`${debits} debitos`} tone="accent" />
          <AdminSummaryCard label="Ultimo movimento" value={latestTransaction ? formatDateTime(latestTransaction) : '-'} />
        </section>

        {transactions.items.length === 0 ? (
          <EmptyState title="Nenhuma transacao encontrada" description="Ajuste os filtros." />
        ) : (
          <AdminSectionCard
            eyebrow="Ledger"
            title="Movimentacoes de carteira"
            description="Credito, debito, saldo antes/depois e referencia em uma tabela unica."
            meta={<span className="panel-meta">{transactions.totalItems} registros</span>}
          >
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
          </AdminSectionCard>
        )}

        {isAdjustOpen ? (
          <AdminSlideOver
            eyebrow="Operacao manual"
            title="Ajustar carteira"
            description="Credito ou debito pontual com motivo obrigatorio."
            closeHref={returnTo}
          >
            <AdminWalletAdjustmentForm action={createWalletAdjustmentAction} returnTo={returnTo} defaultUserId={filters.userId} />
          </AdminSlideOver>
        ) : null}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar as transacoes"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar a lista de transacoes.'}
        />
      </main>
    );
  }
}
