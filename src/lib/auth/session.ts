import type { AuthSessionResponse, UserRole, UserSummary } from '@/lib/api/contracts';

const ACCESS_TOKEN_COOKIE = 'likes_uai_access_token';
const REFRESH_TOKEN_COOKIE = 'likes_uai_refresh_token';
const USER_COOKIE = 'likes_uai_user';

type CookieReader = {
  get(name: string): { value: string } | undefined;
};

export type SessionState =
  | {
      status: 'authenticated';
      accessToken: string;
      refreshToken: string;
      user: UserSummary;
    }
  | {
      status: 'guest';
      accessToken: null;
      refreshToken: null;
      user: null;
    };

export function getSessionCookieNames() {
  return {
    accessToken: ACCESS_TOKEN_COOKIE,
    refreshToken: REFRESH_TOKEN_COOKIE,
    user: USER_COOKIE,
  } as const;
}

export function readSession(cookies: CookieReader): SessionState {
  const accessToken = cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const encodedUser = cookies.get(USER_COOKIE)?.value;

  if (!accessToken || !refreshToken || !encodedUser) {
    return createGuestSession();
  }

  const user = deserializeUser(encodedUser);

  if (!user) {
    return createGuestSession();
  }

  return {
    status: 'authenticated',
    accessToken,
    refreshToken,
    user,
  };
}

export function createGuestSession(): SessionState {
  return {
    status: 'guest',
    accessToken: null,
    refreshToken: null,
    user: null,
  };
}

export function serializeUser(user: UserSummary): string {
  return encodeBase64Url(JSON.stringify(user));
}

export function deserializeUser(value: string): UserSummary | null {
  try {
    const parsed = JSON.parse(decodeBase64Url(value)) as Partial<UserSummary>;

    if (
      typeof parsed.id !== 'string' ||
      !isUserRole(parsed.role) ||
      typeof parsed.name !== 'string' ||
      typeof parsed.email !== 'string' ||
      typeof parsed.status !== 'string'
    ) {
      return null;
    }

    return {
      id: parsed.id,
      role: parsed.role,
      name: parsed.name,
      email: parsed.email,
      status: parsed.status,
      phone: typeof parsed.phone === 'string' ? parsed.phone : undefined,
      referralCode: typeof parsed.referralCode === 'string' ? parsed.referralCode : undefined,
      emailVerified: typeof parsed.emailVerified === 'boolean' ? parsed.emailVerified : undefined,
    };
  } catch {
    return null;
  }
}

export function toSessionCookieValues(session: AuthSessionResponse) {
  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    user: serializeUser(session.user),
  } as const;
}

function isUserRole(value: unknown): value is UserRole {
  return value === 'customer' || value === 'admin';
}

function encodeBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const binary = atob(`${normalized}${padding}`);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}
