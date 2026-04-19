import Link from 'next/link';
import { CircleUserRound, CreditCard, MailCheck, ShieldCheck, Wallet } from 'lucide-react';

import { CustomerMetricCard, CustomerSectionCard } from '@/components/ui/customer-surfaces';
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
          description="Conta, verificacao, identidade fiscal e indicacoes no mesmo painel."
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
            <p>Sua leitura ja mostra os dados salvos agora.</p>
          </div>
        ) : null}

        {!hasFiscalIdentity ? (
          <div className="auth-notice auth-notice-warning" role="status" aria-live="polite">
            <strong>Complete seu CPF/CNPJ para gerar PIX</strong>
            <p>Sem esse dado, novas recargas PIX ficam bloqueadas ate a atualizacao do cadastro.</p>
          </div>
        ) : null}

        <section className="customer-dashboard-hero">
          <article className="customer-dashboard-command customer-profile-command">
            <div className="customer-dashboard-command-head">
              <div className="customer-dashboard-command-copy">
                <div className="customer-dashboard-command-pills">
                  <span className="customer-dashboard-pill">Conta do cliente</span>
                  <span className="customer-dashboard-pill">{profile.role}</span>
                </div>
                <h2>{profile.name}</h2>
                <p>Central de acesso, verificacao e preparo da conta para pagamentos e indicacoes.</p>
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
                  <span>{fiscalIdentityLabel}</span>
                  <strong>{hasFiscalIdentity ? 'Pronto' : 'Pendente'}</strong>
                </div>
                <div>
                  <span>Indicacoes</span>
                  <strong>{referral.summary.invitedUsers}</strong>
                </div>
              </div>
            </div>

            <div className="customer-dashboard-command-actions">
              {!profile.emailVerified ? (
                <Link href="/app/profile#indicacoes" className="primary-action">
                  <MailCheck size={16} strokeWidth={2.15} aria-hidden="true" />
                  Verificar email
                </Link>
              ) : !hasFiscalIdentity ? (
                <Link href={editPath} className="primary-action">
                  <CreditCard size={16} strokeWidth={2.15} aria-hidden="true" />
                  Completar CPF/CNPJ
                </Link>
              ) : (
                <Link href="/app/payments" className="primary-action">
                  <CreditCard size={16} strokeWidth={2.15} aria-hidden="true" />
                  Gerar PIX
                </Link>
              )}
              <Link href={editPath} className="secondary-action">
                <CircleUserRound size={16} strokeWidth={2.15} aria-hidden="true" />
                Ajustar cadastro
              </Link>
            </div>
          </article>

          <div className="customer-dashboard-side">
            <CustomerSectionCard
              eyebrow="Status da conta"
              title={hasFiscalIdentity ? 'Conta pronta para operar' : 'Falta liberar o PIX'}
              description={
                hasFiscalIdentity
                  ? `${taxIdType === 'cnpj' ? 'CNPJ' : 'CPF'} salvo e pronto para novas recargas.`
                  : 'Atualize a identidade fiscal para voltar a criar cobrancas PIX com seguranca.'
              }
              meta={
                <StatusBadge
                  label={hasFiscalIdentity ? 'pix liberado' : 'cpf/cnpj pendente'}
                  tone={hasFiscalIdentity ? 'success' : 'warning'}
                />
              }
            >
              <div className="customer-dashboard-inline-stats">
                <div>
                  <span>Email</span>
                  <strong>{profile.email}</strong>
                </div>
                <div>
                  <span>Telefone</span>
                  <strong>{profile.phone || 'Nao informado'}</strong>
                </div>
                <div>
                  <span>{fiscalIdentityLabel}</span>
                  <strong>{formatTaxIdForDisplay(taxId)}</strong>
                </div>
              </div>
            </CustomerSectionCard>
          </div>
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
            label="Identidade fiscal"
            value={hasFiscalIdentity ? formatTaxIdForDisplay(taxId) : 'Pendente'}
            meta={hasFiscalIdentity ? 'Pronta para PIX.' : 'Exigida para novas cobrancas.'}
            icon={ShieldCheck}
            tone={hasFiscalIdentity ? 'info' : 'warning'}
          />
          <CustomerMetricCard
            label="Saldo"
            value={formatMoney(wallet.availableBalance)}
            meta="Disponivel para novos pedidos."
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
            eyebrow="Conta"
            title="Dados pessoais"
            description="Nome, contato e status geral da sua conta."
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

          <CustomerSectionCard
            eyebrow="Financeiro"
            title={hasFiscalIdentity ? 'Identidade fiscal confirmada' : 'Identidade fiscal pendente'}
            description={
              hasFiscalIdentity
                ? 'Sua conta ja tem o dado exigido para gerar novas recargas PIX.'
                : 'Sem CPF/CNPJ o backend bloqueia novas cobrancas PIX.'
            }
            meta={
              <StatusBadge
                label={hasFiscalIdentity ? 'pronto para pix' : 'complete cpf/cnpj'}
                tone={hasFiscalIdentity ? 'success' : 'warning'}
              />
            }
            actions={
              <Link href={hasFiscalIdentity ? '/app/payments' : editPath} className="secondary-action">
                {hasFiscalIdentity ? 'Ir para PIX' : 'Atualizar perfil'}
              </Link>
            }
          >
            <div className="customer-dashboard-inline-stats">
              <div>
                <span>{fiscalIdentityLabel}</span>
                <strong>{formatTaxIdForDisplay(taxId)}</strong>
              </div>
              <div>
                <span>Wallet</span>
                <strong>{formatMoney(wallet.availableBalance)}</strong>
              </div>
              <div>
                <span>Recarga PIX</span>
                <strong>{hasFiscalIdentity ? 'Liberada' : 'Bloqueada'}</strong>
              </div>
            </div>
          </CustomerSectionCard>
        </section>

        <ReferralCard referral={referral} />

        {isEditOpen ? (
          <AdminSlideOver
            eyebrow="Perfil"
            title="Editar dados"
            description="Atualize nome, telefone e identidade fiscal sem sair da conta."
            closeHref={returnTo}
          >
            <section className="admin-drawer-stack">
              <article className="admin-inline-panel customer-profile-drawer-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Cadastro</p>
                    <h3>Dados da conta</h3>
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
