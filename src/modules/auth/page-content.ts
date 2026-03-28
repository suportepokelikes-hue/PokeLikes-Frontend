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
}) {
  const { reason, returnTo, notice } = options;

  return {
    brandLabel: 'Likes Uai',
    title: 'Entre para continuar no cliente ou no admin.',
    eyebrow: 'Acesso',
    description:
      'A autenticacao usa cookies HTTP-only e redireciona voce automaticamente para a area correta conforme o papel retornado pelo backend.',
    notice,
    returnTo,
    panelTitle: 'O que acontece depois do login',
    panelCopy: 'Este fluxo e real e ja serve para validar a sessao pela UI, sem mocks nem bootstrap artificial.',
    panelItems: [
      'cliente segue para /app com wallet, pagamentos e pedidos',
      'admin segue para /admin com modulos operacionais e monitoramento',
      'falhas de credencial retornam feedback direto do servidor na propria tela',
    ],
    footnote: 'Use as mesmas credenciais cadastradas no backend V1. O acesso permanece em cookies seguros de sessao.',
    fields: [
      {
        name: 'email' as const,
        label: 'Email',
        type: 'email' as const,
        placeholder: 'voce@likesuai.com',
        autoComplete: 'email',
        inputMode: 'email' as const,
        description: 'Informe o email usado no login do backend.',
      },
      {
        name: 'password' as const,
        label: 'Senha',
        type: 'password' as const,
        placeholder: 'Sua senha',
        autoComplete: 'current-password',
        description: 'A senha e validada diretamente pelo endpoint /auth/login.',
      },
    ],
    submitLabel: 'Entrar',
    pendingLabel: 'Validando acesso...',
    alternateHref: getRegisterPath({ reason, returnTo }),
    alternateLabel: 'Criar conta',
    alternatePrompt: 'Ainda nao tem cadastro?',
  };
}

export function getRegisterPageContent(options: {
  reason?: AuthRedirectReason;
  returnTo?: string | null;
  notice?: AuthNotice;
}) {
  const { reason, returnTo, notice } = options;

  return {
    brandLabel: 'Likes Uai',
    title: 'Crie sua conta para iniciar wallet, pagamentos e pedidos.',
    eyebrow: 'Cadastro',
    description:
      'O cadastro segue estritamente o contrato atual do backend: nome, email, telefone e senha. Se o servidor aprovar, a sessao ja nasce autenticada.',
    notice,
    returnTo,
    panelTitle: 'Cadastro real de cliente',
    panelCopy: 'A rota /auth/register cria conta de cliente. Nao existe auto-onboarding administrativo por esta interface.',
    panelItems: [
      'apos sucesso, a sessao e aberta automaticamente e voce cai em /app',
      'nome, email, telefone e senha sao enviados sem campos adicionais fora da OpenAPI',
      'erros de validacao do backend aparecem inline para facilitar teste manual',
    ],
    footnote: 'Este formulario cria apenas conta de cliente. Contas admin continuam dependendo do fluxo operacional do backend.',
    fields: [
      {
        name: 'name' as const,
        label: 'Nome',
        type: 'text' as const,
        placeholder: 'Seu nome completo',
        autoComplete: 'name',
        description: 'Use o nome que deve aparecer na area autenticada.',
      },
      {
        name: 'email' as const,
        label: 'Email',
        type: 'email' as const,
        placeholder: 'voce@exemplo.com',
        autoComplete: 'email',
        inputMode: 'email' as const,
        description: 'Sera usado para login e identificacao da conta.',
      },
      {
        name: 'phone' as const,
        label: 'Telefone',
        type: 'tel' as const,
        placeholder: '(11) 99999-9999',
        autoComplete: 'tel',
        inputMode: 'tel' as const,
        description: 'Informe um telefone valido conforme a expectativa atual do backend.',
      },
      {
        name: 'password' as const,
        label: 'Senha',
        type: 'password' as const,
        placeholder: 'Crie uma senha',
        autoComplete: 'new-password',
        description: 'A senha e enviada ao endpoint /auth/register e nao fica exposta na UI.',
      },
    ],
    submitLabel: 'Criar conta',
    pendingLabel: 'Criando conta...',
    alternateHref: getLoginPath({ reason, returnTo }),
    alternateLabel: 'Entrar',
    alternatePrompt: 'Ja possui acesso?',
  };
}
