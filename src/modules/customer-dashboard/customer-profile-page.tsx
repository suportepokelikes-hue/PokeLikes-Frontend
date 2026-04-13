import Link from 'next/link';

import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { getCustomerProfile, getCustomerReferralSummary, getWalletSummary } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatMoney } from '@/lib/format';
import { ReferralCard } from './referral-card';

type CustomerProfilePageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function CustomerProfilePage({ session }: CustomerProfilePageProps) {
  try {
    const [profile, wallet, referral] = await Promise.all([
      getCustomerProfile({ accessToken: session.accessToken }),
      getWalletSummary({ accessToken: session.accessToken }),
      getCustomerReferralSummary({ accessToken: session.accessToken }),
    ]);

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Perfil"
          title="Minha conta"
          actions={
            <>
              <Link href="/app/wallet" className="secondary-action">
                Ver carteira
              </Link>
              <Link href="/app" className="secondary-action">
                Voltar ao inicio
              </Link>
            </>
          }
        />

        <section className="customer-hero-grid">
          <article className="customer-spotlight">
            <div className="customer-spotlight-head">
              <span className="eyebrow">Sua conta</span>
              <StatusBadge label={profile.status} tone={profile.status === 'active' ? 'success' : 'warning'} />
            </div>
            <h2>{profile.name}</h2>
            <p>Dados principais da conta.</p>
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
                <span>Saldo atual</span>
                <strong>{formatMoney(wallet.availableBalance)}</strong>
              </div>
            </div>
          </article>

          <article className="customer-note-card">
            <strong>{profile.emailVerified ? 'Email verificado' : 'Verificacao pendente'}</strong>
            <p>Codigo atual: {referral.referralCode}</p>
            <p>{profile.emailVerified ? 'Conta pronta para indicar.' : 'Verifique o email para liberar o bonus.'}</p>
          </article>
        </section>

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Conta</h2>
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
                <dd>{profile.phone || 'Nao informado'}</dd>
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
                <dt>Verificacao</dt>
                <dd>
                  <StatusBadge
                    label={profile.emailVerified ? 'verificado' : 'pendente'}
                    tone={profile.emailVerified ? 'success' : 'warning'}
                  />
                </dd>
              </div>
              <div>
                <dt>Saldo atual</dt>
                <dd>{formatMoney(wallet.availableBalance)}</dd>
              </div>
            </dl>
          </article>

          <ReferralCard referral={referral} />
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
