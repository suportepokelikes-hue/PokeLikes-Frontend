import { getLoginPath, getRegisterPath, type AuthRedirectReason } from '../../lib/auth/navigation';

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

  return {
    brandLabel: 'Likes Uai',
    title: 'Entre na sua conta.',
    eyebrow: 'Acesso',
    description: 'Use seu email e senha para entrar.',
    notice,
    returnTo,
    panelTitle: 'Acesso',
    panelCopy: 'Entre para seguir para a area correspondente ao seu perfil.',
    panelItems: [
      'clientes acessam saldo, pagamentos e pedidos',
      'admins acessam o painel operacional',
      'erros de acesso aparecem nesta tela',
    ],
    footnote: 'Se voce ja tem cadastro, entre com as credenciais da sua conta.',
    fields: [
      {
        name: 'email' as const,
        label: 'Email',
        type: 'email' as const,
        placeholder: 'voce@likesuai.com',
        autoComplete: 'email',
        inputMode: 'email' as const,
        description: 'Informe o email da sua conta.',
      },
      {
        name: 'password' as const,
        label: 'Senha',
        type: 'password' as const,
        placeholder: 'Sua senha',
        autoComplete: 'current-password',
        description: 'Informe a senha da sua conta.',
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

  return {
    brandLabel: 'Likes Uai',
    title: 'Crie sua conta.',
    eyebrow: 'Cadastro',
    description: 'Preencha seus dados para comecar.',
    notice,
    returnTo,
    panelTitle: 'Cadastro',
    panelCopy: 'Depois do cadastro, sua conta ja fica pronta para uso.',
    panelItems: [
      'acesso a saldo, pagamentos e pedidos',
      'entrada imediata na area do cliente',
      'mensagens de erro exibidas na propria tela',
    ],
    footnote: 'Este cadastro cria conta de cliente.',
    fields: [
      {
        name: 'name' as const,
        label: 'Nome',
        type: 'text' as const,
        placeholder: 'Seu nome completo',
        autoComplete: 'name',
        description: 'Este nome sera exibido na sua conta.',
      },
      {
        name: 'email' as const,
        label: 'Email',
        type: 'email' as const,
        placeholder: 'voce@exemplo.com',
        autoComplete: 'email',
        inputMode: 'email' as const,
        description: 'Sera usado para entrar na sua conta.',
      },
      {
        name: 'phone' as const,
        label: 'Telefone',
        type: 'tel' as const,
        placeholder: '(11) 99999-9999',
        autoComplete: 'tel',
        inputMode: 'tel' as const,
        description: 'Informe um telefone valido.',
      },
      {
        name: 'password' as const,
        label: 'Senha',
        type: 'password' as const,
        placeholder: 'Crie uma senha',
        autoComplete: 'new-password',
        description: 'Crie uma senha para acessar sua conta.',
      },
      {
        name: 'referralCode' as const,
        label: 'Codigo de indicacao',
        type: 'text' as const,
        placeholder: 'Opcional',
        autoComplete: 'off',
        description: 'Se voce recebeu um codigo, confirme aqui para vincular a indicacao.',
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
