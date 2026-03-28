import type { Metadata } from 'next';

import { getAuthNotice, getLoginPath, normalizeReturnTo, type AuthRedirectReason } from '@/lib/auth/navigation';
import { redirectAuthenticatedUser } from '@/lib/auth/guards';
import { registerAction } from '@/modules/auth/actions';
import { AuthForm } from '@/modules/auth/auth-form';
import { initialAuthFormState } from '@/modules/auth/types';

export const metadata: Metadata = {
  title: 'Criar Conta | Likes Uai',
  description: 'Cadastro de cliente na plataforma Likes Uai.',
};

type RegisterPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const resolvedSearchParams = await searchParams;
  const returnTo = normalizeReturnTo(readSearchParam(resolvedSearchParams.returnTo));
  const reason = readSearchParam(resolvedSearchParams.reason) as AuthRedirectReason | undefined;

  await redirectAuthenticatedUser(returnTo ?? undefined);

  return (
    <AuthForm
      brandLabel="Likes Uai"
      title="Crie sua conta para iniciar wallet, pagamentos e pedidos."
      eyebrow="Cadastro"
      description="O cadastro segue estritamente o contrato atual do backend: nome, email, telefone e senha. Se o servidor aprovar, a sessao ja nasce autenticada."
      notice={getAuthNotice(resolvedSearchParams)}
      returnTo={returnTo}
      panelTitle="Cadastro real de cliente"
      panelCopy="A rota /auth/register cria conta de cliente. Nao existe auto-onboarding administrativo por esta interface."
      panelItems={[
        'apos sucesso, a sessao e aberta automaticamente e voce cai em /app',
        'nome, email, telefone e senha sao enviados sem campos adicionais fora da OpenAPI',
        'erros de validacao do backend aparecem inline para facilitar teste manual',
      ]}
      footnote="Este formulario cria apenas conta de cliente. Contas admin continuam dependendo do fluxo operacional do backend."
      fields={[
        {
          name: 'name',
          label: 'Nome',
          type: 'text',
          placeholder: 'Seu nome completo',
          autoComplete: 'name',
          description: 'Use o nome que deve aparecer na area autenticada.',
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'voce@exemplo.com',
          autoComplete: 'email',
          inputMode: 'email',
          description: 'Sera usado para login e identificacao da conta.',
        },
        {
          name: 'phone',
          label: 'Telefone',
          type: 'tel',
          placeholder: '(11) 99999-9999',
          autoComplete: 'tel',
          inputMode: 'tel',
          description: 'Informe um telefone valido conforme a expectativa atual do backend.',
        },
        {
          name: 'password',
          label: 'Senha',
          type: 'password',
          placeholder: 'Crie uma senha',
          autoComplete: 'new-password',
          description: 'A senha e enviada ao endpoint /auth/register e nao fica exposta na UI.',
        },
      ]}
      submitLabel="Criar conta"
      pendingLabel="Criando conta..."
      alternateHref={getLoginPath({ reason, returnTo })}
      alternateLabel="Entrar"
      alternatePrompt="Ja possui acesso?"
      action={registerAction}
      initialState={initialAuthFormState}
    />
  );
}

function readSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
