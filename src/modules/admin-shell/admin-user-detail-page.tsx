import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { getAdminUserDetail } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { createWalletAdjustmentAction, updateUserAction } from '@/modules/admin-shell/actions';
import { AdminUserMutationForm } from '@/modules/admin-shell/admin-user-mutation-form';
import { AdminWalletAdjustmentForm } from '@/modules/admin-shell/admin-wallet-adjustment-form';

type AdminUserDetailPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  userId: string;
};

export async function AdminUserDetailPage({ session, userId }: AdminUserDetailPageProps) {
  try {
    const user = await getAdminUserDetail(session.accessToken, userId);
    const returnTo = `/admin/users/${user.id}`;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / usuarios / detalhe"
          title={user.name}
          description="O detalhe do usuario concentra edicao operacional e ajuste de carteira em um fluxo menos denso do que a tabela principal."
          actions={
            <>
              <StatusBadge label={user.role} tone={user.role === 'admin' ? 'info' : 'neutral'} />
              <StatusBadge label={user.status} tone={user.status === 'active' ? 'success' : 'danger'} />
              <Link href="/admin/users" className="secondary-action">
                Voltar aos usuarios
              </Link>
            </>
          }
        />

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Resumo do usuario</h2>
            <dl className="detail-list">
              <div>
                <dt>ID</dt>
                <dd className="code-block">{user.id}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt>Papel</dt>
                <dd>{user.role}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{user.status}</dd>
              </div>
              <div>
                <dt>Telefone</dt>
                <dd>{user.phone || '-'}</dd>
              </div>
            </dl>
          </article>

          <article className="detail-card">
            <h2>Atualizar usuario</h2>
            <p className="section-copy">A senha so e enviada se voce preencher um novo valor. O email permanece somente leitura no contrato atual.</p>
            <AdminUserMutationForm mode="update" action={updateUserAction} returnTo={returnTo} user={user} />
          </article>

          <article className="detail-card detail-card-wide">
            <h2>Ajuste manual de carteira</h2>
            <p className="section-copy">Lancamento administrativo de credito ou debito diretamente para o usuario corrente.</p>
            <AdminWalletAdjustmentForm action={createWalletAdjustmentAction} returnTo={returnTo} defaultUserId={user.id} />
          </article>
        </section>
      </main>
    );
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound();
    }

    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar o detalhe do usuario"
          description="A API nao retornou os dados esperados para este usuario administrativo."
        />
      </main>
    );
  }
}
