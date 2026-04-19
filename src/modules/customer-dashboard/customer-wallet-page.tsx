import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, CreditCard, Landmark, Wallet } from 'lucide-react';

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
    const latestTransaction = transactions.items[0] ?? null;

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Carteira"
          title="Carteira"
          description="Saldo, entradas e saidas com leitura mais clara do extrato."
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
                <div className="customer-dashboard-command-pills">
                  <span className="customer-dashboard-pill">Area financeira</span>
                  <span className="customer-dashboard-pill">Wallet {wallet.id}</span>
                </div>
                <h2>{formatMoney(wallet.availableBalance)}</h2>
                <p>Saldo liberado para novos pedidos. As recargas confirmadas entram aqui automaticamente.</p>
              </div>
              <StatusBadge label="disponivel" tone="success" />
            </div>

            <div className="customer-dashboard-balance-row">
              <div className="customer-dashboard-snapshot">
                <div>
                  <span>Entradas</span>
                  <strong>{credits.length}</strong>
                </div>
                <div>
                  <span>Saidas</span>
                  <strong>{debits.length}</strong>
                </div>
                <div>
                  <span>Lancamentos</span>
                  <strong>{transactions.totalItems}</strong>
                </div>
              </div>
            </div>

            <div className="customer-dashboard-command-actions">
              <Link href="/app/payments" className="primary-action">
                <CreditCard size={16} strokeWidth={2.15} aria-hidden="true" />
                Gerar PIX
              </Link>
              <Link href="/catalog" className="secondary-action">
                <Wallet size={16} strokeWidth={2.15} aria-hidden="true" />
                Fazer pedido
              </Link>
            </div>
          </article>

          <div className="customer-dashboard-side">
            <CustomerSectionCard
              eyebrow="Resumo"
              title="Area pronta para controle financeiro"
              description="Use este painel para conferir saldo real, ultimos movimentos e o caminho da proxima recarga."
              meta={<StatusBadge label="wallet ativa" tone="info" />}
            >
              <div className="customer-dashboard-inline-stats">
                <div>
                  <span>Saldo</span>
                  <strong>{formatMoney(wallet.availableBalance)}</strong>
                </div>
                <div>
                  <span>Ultimo movimento</span>
                  <strong>{latestTransaction ? formatDateTime(latestTransaction.createdAt) : 'Sem extrato'}</strong>
                </div>
                <div>
                  <span>Origem</span>
                  <strong>PIX confirmado</strong>
                </div>
              </div>
            </CustomerSectionCard>
          </div>
        </section>

        <section className="customer-dashboard-metrics">
          <CustomerMetricCard
            label="Saldo disponivel"
            value={formatMoney(wallet.availableBalance)}
            meta="Pronto para novos pedidos."
            icon={Landmark}
            tone="accent"
          />
          <CustomerMetricCard
            label="Entradas"
            value={String(credits.length)}
            meta="Recargas e creditos."
            icon={ArrowDownLeft}
            tone="success"
          />
          <CustomerMetricCard
            label="Saidas"
            value={String(debits.length)}
            meta="Consumo em pedidos."
            icon={ArrowUpRight}
            tone="warning"
          />
          <CustomerMetricCard
            label="Extrato"
            value={String(transactions.totalItems)}
            meta="Lancamentos nesta pagina."
            icon={Wallet}
            tone="default"
          />
        </section>

        <section className="customer-dashboard-lower">
          <CustomerSectionCard
            eyebrow="Carteira"
            title="Leitura rapida"
            description="O saldo aumenta com PIX confirmado e diminui conforme os pedidos sao cobrados."
          >
            <div className="customer-dashboard-inline-stats">
              <div>
                <span>Wallet</span>
                <strong>{wallet.id}</strong>
              </div>
              <div>
                <span>Maior fonte</span>
                <strong>Recarga PIX</strong>
              </div>
              <div>
                <span>Uso principal</span>
                <strong>Pedidos do cliente</strong>
              </div>
            </div>
          </CustomerSectionCard>

          <CustomerSectionCard
            eyebrow="Proximo passo"
            title={transactions.items.length === 0 ? 'Sua carteira ainda nao tem historico' : 'Continue acompanhando o saldo'}
            description={
              transactions.items.length === 0
                ? 'A primeira recarga ja abre o fluxo financeiro da conta e deixa o extrato visivel.'
                : 'Quando precisar de mais saldo, gere um novo PIX sem sair da area interna.'
            }
            actions={
              <Link href="/app/payments" className="secondary-action">
                Abrir pagamentos
              </Link>
            }
          >
            <div className="customer-dashboard-inline-stats">
              <div>
                <span>Entradas</span>
                <strong>{credits.length}</strong>
              </div>
              <div>
                <span>Saidas</span>
                <strong>{debits.length}</strong>
              </div>
              <div>
                <span>Saldo atual</span>
                <strong>{formatMoney(wallet.availableBalance)}</strong>
              </div>
            </div>
          </CustomerSectionCard>
        </section>

        {transactions.items.length === 0 ? (
          <EmptyState
            title="Sua carteira ainda nao tem movimentacoes"
            description="A primeira recarga confirmada abre o saldo e o extrato desta area."
            actionHref="/app/payments"
            actionLabel="Gerar PIX"
          />
        ) : (
          <CustomerSectionCard
            eyebrow="Extrato"
            title="Movimentacoes recentes"
            description="Veja entradas, saidas e valores com leitura mais direta."
            meta={<span className="panel-meta">{transactions.totalItems} registro(s)</span>}
          >
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
