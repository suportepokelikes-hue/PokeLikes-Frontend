import Link from 'next/link';
import { CircleUserRound, CreditCard, MailCheck, Wallet } from 'lucide-react';

import { CustomerMetricCard, CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { getCustomerProfile, getCustomerReferralSummary, getWalletSummary } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatMoney } from '@/lib/format';
import { AdminSlideOver } from '@/modules/admin-shell/admin-slide-over';
import { CustomerProfileEditForm } from './customer-profile-edit-form';
import { ReferralCard } from './referral-card';

type CustomerProfilePageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  isEditOpen?: boolean;
  isReferralInfoOpen?: boolean;
  profileUpdated?: boolean;
};

export async function CustomerProfilePage({
  session,
  isEditOpen = false,
  isReferralInfoOpen = false,
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

    return (
      <main className="page page-customer">
        <PageHeader
          eyebrow="Perfil"
          title="Minha conta"
          compact
          actions={
            <>
              <Link href={editPath} className="primary-action">
                <CircleUserRound size={16} strokeWidth={2.15} aria-hidden="true" />
                Editar dados
              </Link>
              <Link href="/app/wallet" className="secondary-action">
                <Wallet size={16} strokeWidth={2.15} aria-hidden="true" />
                Ver carteira
              </Link>
            </>
          }
        />

        {profileUpdated ? (
          <div className="auth-notice auth-notice-success" role="status" aria-live="polite">
            <strong>Perfil atualizado</strong>
          </div>
        ) : null}

        <section className="customer-dashboard-hero">
          <article className="customer-dashboard-command customer-profile-command">
            <div className="customer-dashboard-command-head">
              <div className="customer-dashboard-command-copy">
                <h2>{profile.name}</h2>
                <p>Conta, verificacao e PIX.</p>
              </div>
              <StatusBadge label={profile.status} tone={profile.status === 'active' ? 'success' : 'warning'} />
            </div>

            <div className="customer-dashboard-balance-row">
              <div className="customer-dashboard-balance">
                <span>Saldo atual</span>
                <strong>{formatMoney(wallet.availableBalance)}</strong>
              </div>
              <div className="customer-dashboard-snapshot">
                <div>
                  <span>Email</span>
                  <strong>{profile.emailVerified ? 'Verificado' : 'Pendente'}</strong>
                </div>
                <div>
                  <span>Convites referral</span>
                  <strong>{referral.summary.invitedUsers}</strong>
                </div>
              </div>
            </div>

            <div className="customer-dashboard-command-actions">
              {!profile.emailVerified ? (
                <Link href="/app/profile" className="primary-action">
                  <MailCheck size={16} strokeWidth={2.15} aria-hidden="true" />
                  Verificar email
                </Link>
              ) : (
                <Link href="/app/payments" className="primary-action">
                  <CreditCard size={16} strokeWidth={2.15} aria-hidden="true" />
                  Gerar PIX
                </Link>
              )}
              <Link href="/app/affiliate" className="secondary-action">
                Afiliados em breve
              </Link>
            </div>
          </article>
        </section>

        <section className="customer-dashboard-metrics">
          <CustomerMetricCard
            label="Email"
            value={profile.emailVerified ? 'Verificado' : 'Pendente'}
            meta={profile.email}
            icon={MailCheck}
            tone={profile.emailVerified ? 'success' : 'warning'}
          />
          <CustomerMetricCard
            label="Saldo"
            value={formatMoney(wallet.availableBalance)}
            icon={Wallet}
            tone="accent"
          />
          <CustomerMetricCard
            label="Codigo de referral"
            value={referral.referralCode}
            meta={`${referral.summary.invitedUsers} convidados`}
            icon={CircleUserRound}
            tone="default"
          />
        </section>

        <section className="customer-dashboard-lower">
          <CustomerSectionCard
            title="Dados da conta"
            actions={
              <Link href={editPath} className="secondary-action">
                Editar dados
              </Link>
            }
          >
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
                    label={profile.emailVerified ? 'email verificado' : 'email pendente'}
                    tone={profile.emailVerified ? 'success' : 'warning'}
                  />
                </dd>
              </div>
            </dl>
          </CustomerSectionCard>

        </section>

        <ReferralCard referral={referral} detailsHref="/app/profile?referralInfo=1" />

        {isEditOpen ? (
          <AdminSlideOver
            eyebrow="Perfil"
            title="Editar dados"
            closeHref={returnTo}
          >
            <section className="admin-drawer-stack">
              <article className="admin-inline-panel customer-profile-drawer-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Dados da conta</h3>
                  </div>
                  <div className="feedback-actions">
                    <StatusBadge label={profile.status} tone={profile.status === 'active' ? 'success' : 'warning'} />
                    <StatusBadge
                      label={profile.emailVerified ? 'email verificado' : 'email pendente'}
                      tone={profile.emailVerified ? 'success' : 'warning'}
                    />
                  </div>
                </div>
                <CustomerProfileEditForm profile={profile} />
              </article>
            </section>
          </AdminSlideOver>
        ) : null}

        {isReferralInfoOpen ? (
          <AdminSlideOver
            eyebrow="Indicacoes"
            title="Como funciona"
            description="Resumo das regras do seu link de convite."
            closeHref={returnTo}
          >
            <section className="admin-drawer-stack">
              <CustomerSectionCard title="Logica do convite">
                <p className="section-copy">
                  Compartilhe seu codigo ou link. Quando uma pessoa convidada cria a conta e faz uma recarga elegivel, o
                  bonus e aplicado conforme as regras atuais da plataforma.
                </p>
              </CustomerSectionCard>

              <CustomerSectionCard title="Regras atuais">
                <div className="customer-dashboard-inline-stats">
                  <div>
                    <span>Recarga minima</span>
                    <strong>{formatMoney(referral.rewardRules.minimumTopupAmount)}</strong>
                  </div>
                  <div>
                    <span>Bonus do convidado</span>
                    <strong>{formatMoney(referral.rewardRules.referredBonusAmount)}</strong>
                  </div>
                  <div>
                    <span>Seu bonus</span>
                    <strong>{formatMoney(referral.rewardRules.referrerBonusAmount)}</strong>
                  </div>
                </div>
              </CustomerSectionCard>

              <CustomerSectionCard title="Acompanhamento">
                <div className="customer-dashboard-inline-stats">
                  <div>
                    <span>Convidados totais</span>
                    <strong>{referral.summary.invitedUsers}</strong>
                  </div>
                  <div>
                    <span>Convidados validos</span>
                    <strong>{referral.summary.rewardedUsers}</strong>
                  </div>
                  <div>
                    <span>Total ganho</span>
                    <strong>{formatMoney(referral.summary.earnedAmount)}</strong>
                  </div>
                </div>
              </CustomerSectionCard>
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
