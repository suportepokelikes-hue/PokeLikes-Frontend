import Link from 'next/link';

import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { getCustomerProfile, getCustomerReferralSummary, getWalletSummary } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatMoney } from '@/lib/format';
import { AdminSlideOver } from '@/modules/admin-shell/admin-slide-over';
import {
  formatTaxIdForDisplay,
  getFiscalIdentityLabel,
  getUserTaxId,
  getUserTaxIdType,
  hasUserFiscalIdentity,
} from './customer-fiscal-profile';
import { CustomerProfileEditForm } from './customer-profile-edit-form';
import { ReferralCard } from './referral-card';

type CustomerProfilePageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  isEditOpen?: boolean;
  profileUpdated?: boolean;
};

export async function CustomerProfilePage({
  session,
  isEditOpen = false,
  profileUpdated = false,
}: CustomerProfilePageProps) {
  try {
    const [profile, wallet, referral] = await Promise.all([
      getCustomerProfile({ accessToken: session.accessToken }),
      getWalletSummary({ accessToken: session.accessToken }),
      getCustomerReferralSummary({ accessToken: session.accessToken }),
    ]);
    const returnTo = '/app/profile';
    const editPath = '/app/profile?edit=1';
    const hasFiscalIdentity = hasUserFiscalIdentity(profile);
    const taxId = getUserTaxId(profile);
    const taxIdType = getUserTaxIdType(profile);
    const fiscalIdentityLabel = getFiscalIdentityLabel(profile);

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Perfil"
          title="Minha conta"
          actions={
            <>
              <Link href={editPath} className="primary-action">
                Editar dados
              </Link>
              <Link href="/app/wallet" className="secondary-action">
                Ver carteira
              </Link>
              <Link href="/app" className="secondary-action">
                Voltar ao inicio
              </Link>
            </>
          }
        />

        {profileUpdated ? (
          <div className="auth-notice auth-notice-success" role="status" aria-live="polite">
            <strong>Dados atualizados</strong>
            <p>Seu perfil foi salvo e a leitura abaixo ja mostra as informacoes novas.</p>
          </div>
        ) : null}

        {!hasFiscalIdentity ? (
          <div className="auth-notice auth-notice-warning" role="status" aria-live="polite">
            <strong>Complete seu CPF/CNPJ para gerar PIX</strong>
            <p>Sem esse dado, novas recargas PIX ficam bloqueadas. Atualize o perfil para continuar.</p>
          </div>
        ) : null}

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
                <span>{fiscalIdentityLabel}</span>
                <strong>{formatTaxIdForDisplay(taxId)}</strong>
              </div>
              <div>
                <span>Saldo atual</span>
                <strong>{formatMoney(wallet.availableBalance)}</strong>
              </div>
            </div>
          </article>

          <article className="customer-note-card">
            <strong>{hasFiscalIdentity ? 'Identidade fiscal pronta' : 'CPF/CNPJ pendente'}</strong>
            <p>
              {hasFiscalIdentity
                ? `${taxIdType === 'cnpj' ? 'CNPJ' : 'CPF'} salvo para gerar PIX.`
                : 'Voce precisa informar CPF ou CNPJ antes de criar novas cobrancas PIX.'}
            </p>
            <p>{hasFiscalIdentity ? formatTaxIdForDisplay(taxId) : 'Abra a edicao do perfil para completar esse dado.'}</p>
          </article>
        </section>

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Conta</h2>
            <p className="customer-profile-inline-copy">
              Atualize nome, telefone e CPF/CNPJ por aqui. O email continua protegido nesta etapa.
            </p>
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
                <dt>{fiscalIdentityLabel}</dt>
                <dd>{formatTaxIdForDisplay(taxId)}</dd>
              </div>
              <div>
                <dt>PIX liberado</dt>
                <dd>
                  <StatusBadge
                    label={hasFiscalIdentity ? 'pronto para gerar PIX' : 'complete CPF/CNPJ'}
                    tone={hasFiscalIdentity ? 'success' : 'warning'}
                  />
                </dd>
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

        {isEditOpen ? (
          <AdminSlideOver
            eyebrow="Perfil"
            title="Editar dados"
            description="Atualize seu cadastro sem sair desta tela."
            closeHref={returnTo}
          >
            <section className="admin-drawer-stack">
              <article className="admin-inline-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Cadastro</p>
                    <h3>Nome, telefone e CPF/CNPJ</h3>
                  </div>
                  <div className="feedback-actions">
                    <StatusBadge label={profile.status} tone={profile.status === 'active' ? 'success' : 'warning'} />
                    <StatusBadge
                      label={profile.emailVerified ? 'email verificado' : 'email pendente'}
                      tone={profile.emailVerified ? 'success' : 'warning'}
                    />
                    <StatusBadge
                      label={hasFiscalIdentity ? 'PIX liberado' : 'CPF/CNPJ pendente'}
                      tone={hasFiscalIdentity ? 'success' : 'warning'}
                    />
                  </div>
                </div>
                <CustomerProfileEditForm profile={profile} />
              </article>
            </section>
          </AdminSlideOver>
        ) : null}
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
