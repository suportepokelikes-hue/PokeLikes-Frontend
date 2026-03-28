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
          title="Perfil autenticado do cliente."
          description="Esta tela usa o endpoint real `/me` para expor os dados atuais da conta e deixa explicita a lacuna contratual que ainda impede edicao segura."
          actions={
            <Link href="/app" className="secondary-action">
              Voltar ao dashboard
            </Link>
          }
        />

        <section className="customer-hero-grid">
          <article className="customer-spotlight">
            <div className="customer-spotlight-head">
              <span className="eyebrow">Identidade da conta</span>
              <StatusBadge label={profile.status} tone={profile.status === 'active' ? 'success' : 'warning'} />
            </div>
            <h2>{profile.name}</h2>
            <p>Resumo atual do cadastro autenticado, puxado diretamente do backend para validar sessao, papel e dados exibidos.</p>
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
            <strong>Contrato de perfil</strong>
            <p>A leitura esta pronta e validada por `GET /me`.</p>
            <p>A edicao ainda depende de um schema formal para `PATCH /me`, entao esta rota continua conscientemente somente leitura.</p>
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

          <article className="detail-card">
            <h2>Estado operacional</h2>
            <div className="stack-list">
              <div className="stack-item">
                <strong>Leitura do perfil ja esta ativa</strong>
                <p>A tela consome `/me` diretamente e serve para validar bootstrap, papel e dados visiveis da sessao.</p>
              </div>
              <div className="stack-item">
                <strong>Edicao ainda bloqueada pelo contrato</strong>
                <p>`PATCH /me` existe na OpenAPI local, mas o request body nao foi especificado. Sem esse schema, a UI nao deve inventar payload.</p>
              </div>
              <div className="stack-item">
                <strong>Proximo passo seguro</strong>
                <p>Assim que o contrato descrever os campos editaveis, esta mesma rota pode receber form server-side sem quebrar a separacao do dominio do cliente.</p>
              </div>
            </div>
          </article>
        </section>
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-customer">
        <ErrorState
          title="Nao foi possivel carregar o perfil"
          description={error instanceof ApiClientError ? error.message : 'A API nao retornou os dados esperados para o perfil atual.'}
        />
      </main>
    );
  }
}
