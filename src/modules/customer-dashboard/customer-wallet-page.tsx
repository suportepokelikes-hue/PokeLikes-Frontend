import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { getWalletSummary, listWalletTransactions } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';

type CustomerWalletPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function CustomerWalletPage({ session }: CustomerWalletPageProps) {
  try {
    const [wallet, transactions] = await Promise.all([
      getWalletSummary({ accessToken: session.accessToken }),
      listWalletTransactions({ accessToken: session.accessToken }),
    ]);

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Carteira"
          title="Saldo e transacoes da carteira."
          description="A tela usa wallet e extrato reais da API para exibir saldo disponivel e movimentacoes recentes."
        />

        <section className="metric-list">
          <StatCard label="Saldo disponivel" value={formatMoney(wallet.availableBalance)} tone="accent" />
          <StatCard label="Movimentacoes" value={`${transactions.totalItems}`} meta="Extrato paginado" />
          <StatCard label="Wallet ID" value={wallet.id} meta="Identificador da carteira" />
        </section>

        {transactions.items.length === 0 ? (
          <EmptyState title="Nenhuma transacao encontrada" description="A carteira ainda nao recebeu creditos ou debitos." />
        ) : (
          <DataTable columns={['ID', 'Tipo', 'Direcao', 'Valor', 'Criado em']}>
            {transactions.items.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.type}</td>
                <td>
                  <StatusBadge label={transaction.direction} tone={transaction.direction === 'credit' ? 'success' : 'warning'} />
                </td>
                <td>{formatMoney(transaction.amount)}</td>
                <td>{formatDateTime(transaction.createdAt)}</td>
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
          title="Nao foi possivel carregar a carteira"
          description={error instanceof ApiClientError ? error.message : 'A API nao retornou wallet e transacoes.'}
        />
      </main>
    );
  }
}
