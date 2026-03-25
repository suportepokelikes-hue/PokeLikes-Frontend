import { cookies } from 'next/headers';

import type { AuthSessionResponse } from '@/lib/api/contracts';
import { getSessionCookieNames, toSessionCookieValues } from '@/lib/auth/session';

const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const secureCookie = process.env.NODE_ENV === 'production';

export async function writeServerSessionCookies(session: AuthSessionResponse) {
  const cookieStore = await cookies();
  const values = toSessionCookieValues(session);
  const names = getSessionCookieNames();

  cookieStore.set(names.accessToken, values.accessToken, createCookieOptions());
  cookieStore.set(names.refreshToken, values.refreshToken, createCookieOptions());
  cookieStore.set(names.user, values.user, createCookieOptions());
}

export async function clearServerSessionCookies() {
  const cookieStore = await cookies();
  const names = getSessionCookieNames();

  cookieStore.set(names.accessToken, '', createExpiredCookieOptions());
  cookieStore.set(names.refreshToken, '', createExpiredCookieOptions());
  cookieStore.set(names.user, '', createExpiredCookieOptions());
}

function createCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: secureCookie,
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE,
  };
}

function createExpiredCookieOptions() {
  return {
    ...createCookieOptions(),
    maxAge: 0,
  };
}
