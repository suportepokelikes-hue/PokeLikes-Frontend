import type { Metadata } from 'next';

import { getAuthNotice, getRegisterPath, normalizeReturnTo, type AuthRedirectReason } from '@/lib/auth/navigation';
import { redirectAuthenticatedUser } from '@/lib/auth/guards';
import { loginAction } from '@/modules/auth/actions';
import { AuthForm } from '@/modules/auth/auth-form';
import { initialAuthFormState } from '@/modules/auth/types';

export const metadata: Metadata = {
  title: 'Entrar | Likes Uai',
  description: 'Acesso de cliente e admin na plataforma Likes Uai.',
};

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const returnTo = normalizeReturnTo(readSearchParam(resolvedSearchParams.returnTo));
  const reason = readSearchParam(resolvedSearchParams.reason) as AuthRedirectReason | undefined;

  await redirectAuthenticatedUser(returnTo ?? undefined);

  return (
    <AuthForm
      brandLabel="Likes Uai"
      title="Entre para continuar no cliente ou no admin."
      eyebrow="Acesso"
      description="A autenticacao usa cookies HTTP-only e redireciona voce automaticamente para a area correta conforme o papel retornado pelo backend."
      notice={getAuthNotice(resolvedSearchParams)}
      returnTo={returnTo}
      panelTitle="O que acontece depois do login"
      panelCopy="Este fluxo e real e ja serve para validar a sessao pela UI, sem mocks nem bootstrap artificial."
      panelItems={[
        'cliente segue para /app com wallet, pagamentos e pedidos',
        'admin segue para /admin com modulos operacionais e monitoramento',
        'falhas de credencial retornam feedback direto do servidor na propria tela',
      ]}
      footnote="Use as mesmas credenciais cadastradas no backend V1. O acesso permanece em cookies seguros de sessao."
      fields={[
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'voce@likesuai.com',
          autoComplete: 'email',
          inputMode: 'email',
          description: 'Informe o email usado no login do backend.',
        },
        {
          name: 'password',
          label: 'Senha',
          type: 'password',
          placeholder: 'Sua senha',
          autoComplete: 'current-password',
          description: 'A senha e validada diretamente pelo endpoint /auth/login.',
        },
      ]}
      submitLabel="Entrar"
      pendingLabel="Validando acesso..."
      alternateHref={getRegisterPath({ reason, returnTo })}
      alternateLabel="Criar conta"
      alternatePrompt="Ainda nao tem cadastro?"
      action={loginAction}
      initialState={initialAuthFormState}
    />
  );
}

function readSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
