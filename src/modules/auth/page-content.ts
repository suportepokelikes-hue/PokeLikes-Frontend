import { getLoginPath, getRegisterPath, type AuthRedirectReason } from '../../lib/auth/navigation';
import { getPublicEnv } from '../../lib/config/env';

type AuthNotice = {
  tone: 'info' | 'warning' | 'success';
  title: string;
  description: string;
} | null;

export function getLoginPageContent(options: {
  reason?: AuthRedirectReason;
  returnTo?: string | null;
  notice?: AuthNotice;
  referralCode?: string | null;
}) {
  const { reason, returnTo, notice, referralCode } = options;
  const { appName } = getPublicEnv();

  return {
    brandLabel: appName,
    title: 'Entrar',
    eyebrow: 'Acesso',
    description: 'Entre para continuar.',
    notice,
    returnTo,
    panelTitle: '',
    panelCopy: '',
    panelItems: [],
    footnote: '',
    fields: [
      {
        name: 'email' as const,
        label: 'Email',
        type: 'email' as const,
        placeholder: 'voce@exemplo.com',
        autoComplete: 'email',
        inputMode: 'email' as const,
      },
      {
        name: 'password' as const,
        label: 'Senha',
        type: 'password' as const,
        placeholder: 'Sua senha',
        autoComplete: 'current-password',
      },
    ],
    submitLabel: 'Entrar',
    pendingLabel: 'Validando acesso...',
    alternateHref: getRegisterPath({ reason, returnTo, referralCode }),
    alternateLabel: 'Criar conta',
    alternatePrompt: 'Ainda nao tem cadastro?',
  };
}

export function getRegisterPageContent(options: {
  reason?: AuthRedirectReason;
  returnTo?: string | null;
  notice?: AuthNotice;
  referralCode?: string | null;
}) {
  const { reason, returnTo, notice, referralCode } = options;
  const { appName } = getPublicEnv();

  return {
    brandLabel: appName,
    title: 'Criar conta',
    eyebrow: 'Cadastro',
    description: 'Crie sua conta.',
    notice,
    returnTo,
    panelTitle: '',
    panelCopy: '',
    panelItems: [],
    footnote: '',
    fields: [
      {
        name: 'name' as const,
        label: 'Nome',
        type: 'text' as const,
        placeholder: 'Seu nome completo',
        autoComplete: 'name',
      },
      {
        name: 'email' as const,
        label: 'Email',
        type: 'email' as const,
        placeholder: 'voce@exemplo.com',
        autoComplete: 'email',
        inputMode: 'email' as const,
      },
      {
        name: 'phone' as const,
        label: 'Telefone',
        type: 'tel' as const,
        placeholder: '(11) 99999-9999',
        autoComplete: 'tel',
        inputMode: 'tel' as const,
      },
      {
        name: 'password' as const,
        label: 'Senha',
        type: 'password' as const,
        placeholder: 'Crie uma senha',
        autoComplete: 'new-password',
      },
      {
        name: 'referralCode' as const,
        label: 'Codigo de indicacao',
        type: 'text' as const,
        placeholder: 'Opcional',
        autoComplete: 'off',
        defaultValue: referralCode ?? undefined,
        required: false,
      },
    ],
    submitLabel: 'Criar conta',
    pendingLabel: 'Criando conta...',
    alternateHref: getLoginPath({ reason, returnTo, referralCode }),
    alternateLabel: 'Entrar',
    alternatePrompt: 'Ja possui acesso?',
  };
}
