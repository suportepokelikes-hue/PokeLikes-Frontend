import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

import { ErrorState } from '@/components/ui/error-state';
import { confirmEmailVerification } from '@/lib/api/auth';
import { ApiClientError } from '@/lib/api/http';
import { getServerSession } from '@/lib/auth/cookies';
import { writeServerUserCookie } from '@/lib/auth/server-cookies';
import { createGuestSession } from '@/lib/auth/session';
import { PublicShell } from '@/modules/app-shell/public-shell';

export const metadata: Metadata = {
  title: 'Verificar Email | Pokelike',
  description: 'Confirmacao de verificacao de email na plataforma Pokelike.',
};

type VerifyEmailPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const resolvedSearchParams = await searchParams;
  const token = readSearchParam(resolvedSearchParams.token);

  if (!token) {
    return (
      <PublicShell session={createGuestSession()}>
        <main className="page page-public">
          <ErrorState
            title="Token de verificacao ausente"
            description="Abra novamente o link recebido por email para concluir a verificacao."
            actionHref="/login"
            actionLabel="Ir para login"
          />
        </main>
      </PublicShell>
    );
  }

  const session = await getServerSession();

  try {
    const user = await confirmEmailVerification({ token });

    if (session.status === 'authenticated' && session.user.id === user.id) {
      await writeServerUserCookie(user);
    }

    const returnHref =
      session.status === 'authenticated' ? (user.role === 'admin' ? '/admin' : '/app/profile') : '/login';
    const returnLabel = session.status === 'authenticated' ? 'Voltar para minha conta' : 'Entrar na conta';

    return (
      <PublicShell session={session}>
        <main className="page page-public">
          <section className="feedback-panel">
            <div className="feedback-header">
              <div className="feedback-title-group">
                <span className="feedback-icon" aria-hidden="true">
                  <CheckCircle2 size={18} strokeWidth={2.1} />
                </span>
                <p className="eyebrow">Email verificado</p>
              </div>
            </div>
            <h2>Verificacao concluida</h2>
            <p className="section-copy">
              O email de <strong>{user.email}</strong> foi confirmado com sucesso.
            </p>
            <div className="feedback-actions">
              <Link href={returnHref} className="primary-action">
                {returnLabel}
              </Link>
            </div>
          </section>
        </main>
      </PublicShell>
    );
  } catch (error) {
    return (
      <PublicShell session={session}>
        <main className="page page-public">
          <ErrorState
            title="Nao foi possivel confirmar o email"
            description={
              error instanceof ApiClientError
                ? error.message
                : 'Esse link de verificacao nao pode ser confirmado agora.'
            }
            actionHref="/login"
            actionLabel="Voltar para login"
          />
        </main>
      </PublicShell>
    );
  }
}

function readSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
