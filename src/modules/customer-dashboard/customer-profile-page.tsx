import Link from 'next/link';

import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { getCustomerProfile, getWalletSummary } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatMoney } from '@/lib/format';

type CustomerProfilePageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function CustomerProfilePage({ session }: CustomerProfilePageProps) {
  try {
    const [profile, wallet] = await Promise.all([
      getCustomerProfile({ accessToken: session.accessToken }),
      getWalletSummary({ accessToken: session.accessToken }),
    ]);

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Cliente / perfil"
          title="Perfil"
          description="Veja seus dados e o saldo atual."
          actions={
            <Link href="/app" className="secondary-action">
              Voltar ao dashboard
            </Link>
          }
        />

        <section className="customer-hero-grid">
          <article className="customer-spotlight">
            <div className="customer-spotlight-head">
              <span className="eyebrow">Sua conta</span>
              <StatusBadge label={profile.status} tone={profile.status === 'active' ? 'success' : 'warning'} />
            </div>
            <h2>{profile.name}</h2>
            <p>Confira os dados principais da sua conta.</p>
            <div className="customer-highlight-list">
              <div>
                <span>Email</span>
                <strong>{profile.email}</strong>
              </div>
              <div>
                <span>Telefone</span>
                <strong>{profile.phone || 'Sem telefone'}</strong>
              </div>
              <div>
                <span>Wallet atual</span>
                <strong>{formatMoney(wallet.availableBalance)}</strong>
              </div>
            </div>
          </article>

          <article className="customer-note-card">
            <strong>Edição</strong>
            <p>A edição ainda não está disponível.</p>
          </article>
        </section>

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Dados da conta</h2>
            <dl className="detail-list">
              <div>
                <dt>Nome</dt>
                <dd>{profile.name}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{profile.email}</dd>
              </div>
              <div>
                <dt>Telefone</dt>
                <dd>{profile.phone || 'Nao informado pelo backend'}</dd>
              </div>
              <div>
                <dt>Papel</dt>
                <dd>
                  <StatusBadge label={profile.role} tone="info" />
                </dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusBadge label={profile.status} tone={profile.status === 'active' ? 'success' : 'warning'} />
                </dd>
              </div>
              <div>
                <dt>Saldo atual</dt>
                <dd>{formatMoney(wallet.availableBalance)}</dd>
              </div>
            </dl>
          </article>

        </section>
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-customer">
        <ErrorState
          title="Nao foi possivel carregar o perfil"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar os dados do seu perfil.'}
        />
      </main>
    );
  }
}
