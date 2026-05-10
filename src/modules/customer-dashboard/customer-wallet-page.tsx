import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, CreditCard } from 'lucide-react';

import { CustomerMetricCard, CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
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
    const credits = transactions.items.filter((transaction) => transaction.direction === 'credit');
    const debits = transactions.items.filter((transaction) => transaction.direction === 'debit');

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Carteira"
          title="Carteira"
          compact
          actions={
            <>
              <Link href="/app/payments" className="primary-action">
                <CreditCard size={16} strokeWidth={2.15} aria-hidden="true" />
                Adicionar saldo
              </Link>
              <Link href="/app/orders" className="secondary-action">
                Ver pedidos
              </Link>
            </>
          }
        />

        <section className="customer-dashboard-hero">
          <article className="customer-dashboard-command customer-wallet-command">
            <div className="customer-dashboard-command-head">
              <div className="customer-dashboard-command-copy">
                <h2>{formatMoney(wallet.availableBalance)}</h2>
                <p>Saldo disponivel.</p>
              </div>
            </div>

            <div className="customer-dashboard-command-actions">
              <Link href="/app/payments" className="primary-action">
                <CreditCard size={16} strokeWidth={2.15} aria-hidden="true" />
                Adicionar saldo
              </Link>
            </div>
          </article>
        </section>

        <section className="customer-dashboard-metrics">
          <CustomerMetricCard
            label="Entradas"
            value={String(credits.length)}
            meta="Creditos"
            icon={ArrowDownLeft}
            tone="success"
          />
          <CustomerMetricCard
            label="Saidas"
            value={String(debits.length)}
            meta="Debitos"
            icon={ArrowUpRight}
            tone="warning"
          />
        </section>

        {transactions.items.length === 0 ? (
          <EmptyState
            title="Sua carteira ainda nao tem movimentacoes"
            description="Gere um PIX para começar."
            actionHref="/app/payments"
            actionLabel="Adicionar saldo"
          />
        ) : (
          <CustomerSectionCard
            title="Movimentacoes"
            meta={<span className="panel-meta">{transactions.totalItems} registro(s)</span>}
          >
            <DataTable columns={['ID', 'Tipo', 'Direcao', 'Valor', 'Criado em']} minWidth="52rem">
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
          </CustomerSectionCard>
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
