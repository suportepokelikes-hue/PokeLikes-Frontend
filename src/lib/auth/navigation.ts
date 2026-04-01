import type { UserRole } from '@/lib/api/contracts';

export type AuthRedirectReason = 'required' | 'expired' | 'logged_out';

type AuthNotice = {
  tone: 'info' | 'warning' | 'success';
  title: string;
  description: string;
};

type AuthEntrySearchParams = {
  reason?: string | string[];
  returnTo?: string | string[];
  ref?: string | string[];
};

export function getLoginPath(options: {
  reason?: AuthRedirectReason;
  returnTo?: string | null;
  referralCode?: string | null;
} = {}) {
  return buildAuthEntryPath('/login', options);
}

export function getRegisterPath(options: {
  reason?: AuthRedirectReason;
  returnTo?: string | null;
  referralCode?: string | null;
} = {}) {
  return buildAuthEntryPath('/register', options);
}

export function getPostAuthRedirectPath(role: UserRole, returnTo?: string | null) {
  const normalized = normalizeReturnTo(returnTo);

  if (!normalized) {
    return getDefaultAreaPath(role);
  }

  if (role === 'customer' && normalized.startsWith('/admin')) {
    return '/app';
  }

  if (role === 'admin' && normalized.startsWith('/app')) {
    return '/admin';
  }

  return normalized;
}

export function getAuthNotice(searchParams: AuthEntrySearchParams): AuthNotice | null {
  const reason = readSingle(searchParams.reason);
  const hasReturnTo = Boolean(normalizeReturnTo(readSingle(searchParams.returnTo)));

  if (reason === 'expired') {
    return {
      tone: 'warning',
      title: 'Sessao expirada',
      description: hasReturnTo
        ? 'Sua sessao nao pode ser renovada. Entre novamente para voltar ao fluxo que estava aberto.'
        : 'Sua sessao nao pode ser renovada. Entre novamente para continuar.',
    };
  }

  if (reason === 'logged_out') {
    return {
      tone: 'success',
      title: 'Logout concluido',
      description: 'Sua sessao foi encerrada com sucesso. Quando quiser, entre novamente.',
    };
  }

  if (reason === 'required') {
    return {
      tone: 'info',
      title: 'Acesso necessario',
      description: hasReturnTo
        ? 'Entre para continuar exatamente na rota protegida que originou este redirecionamento.'
        : 'Entre para acessar a area autenticada.',
    };
  }

  return null;
}

export function normalizeReturnTo(value?: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return null;
  }

  try {
    const url = new URL(value, 'https://likesuai.local');
    const normalized = `${url.pathname}${url.search}`;

    if (url.pathname === '/login' || url.pathname === '/register') {
      return null;
    }

    return normalized;
  } catch {
    return null;
  }
}

export function normalizeReferralCode(value?: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.trim();

  if (!normalized || normalized.length > 128) {
    return null;
  }

  return normalized;
}

function buildAuthEntryPath(
  pathname: '/login' | '/register',
  options: { reason?: AuthRedirectReason; returnTo?: string | null; referralCode?: string | null },
) {
  const searchParams = new URLSearchParams();
  const returnTo = normalizeReturnTo(options.returnTo);
  const referralCode = normalizeReferralCode(options.referralCode);

  if (options.reason) {
    searchParams.set('reason', options.reason);
  }

  if (returnTo) {
    searchParams.set('returnTo', returnTo);
  }

  if (referralCode) {
    searchParams.set('ref', referralCode);
  }

  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

function getDefaultAreaPath(role: UserRole) {
  return role === 'admin' ? '/admin' : '/app';
}

function readSingle(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
