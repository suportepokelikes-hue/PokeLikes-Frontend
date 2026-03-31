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
    const credits = transactions.items.filter((transaction) => transaction.direction === 'credit').length;
    const debits = transactions.items.filter((transaction) => transaction.direction === 'debit').length;

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Carteira"
          title="Carteira"
          description="Veja seu saldo e as movimentações mais recentes."
        />

        <section className="customer-hero-grid">
          <article className="customer-spotlight">
            <div className="customer-spotlight-head">
              <span className="eyebrow">Saldo</span>
              <span className="panel-meta">Wallet {wallet.id}</span>
            </div>
            <h2>{formatMoney(wallet.availableBalance)}</h2>
            <p>Seu saldo disponível para usar nos pedidos.</p>
            <div className="customer-highlight-list">
              <div>
                <span>Creditos na pagina</span>
                <strong>{credits}</strong>
              </div>
              <div>
                <span>Debitos na pagina</span>
                <strong>{debits}</strong>
              </div>
              <div>
                <span>Total de eventos</span>
                <strong>{transactions.totalItems}</strong>
              </div>
            </div>
          </article>

          <article className="customer-note-card">
            <strong>Importante</strong>
            <p>O saldo só muda quando o pagamento for confirmado.</p>
          </article>
        </section>

        <section className="metric-list">
          <StatCard label="Saldo disponivel" value={formatMoney(wallet.availableBalance)} tone="accent" />
          <StatCard label="Movimentacoes" value={`${transactions.totalItems}`} meta="Extrato paginado" />
          <StatCard label="Wallet ID" value={wallet.id} meta="Identificador da carteira" />
        </section>

        {transactions.items.length === 0 ? (
          <EmptyState title="Nenhuma transacao encontrada" description="A carteira ainda nao recebeu creditos ou debitos." />
        ) : (
          <section className="detail-card detail-card-wide">
            <div className="panel-heading">
              <h2>Extrato recente</h2>
              <span className="panel-meta">Movimentações mais recentes</span>
            </div>
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
          </section>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-customer">
        <ErrorState
          title="Nao foi possivel carregar a carteira"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar saldo e movimentacoes.'}
        />
      </main>
    );
  }
}
