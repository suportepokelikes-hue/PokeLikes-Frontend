import { NextResponse } from 'next/server';

import type { AuthSessionResponse } from '@/lib/api/contracts';
import { getSessionCookieNames, toSessionCookieValues } from '@/lib/auth/session';

const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const secureCookie = process.env.NODE_ENV === 'production';

export function applySessionCookies(response: NextResponse, session: AuthSessionResponse) {
  const values = toSessionCookieValues(session);
  const names = getSessionCookieNames();

  response.cookies.set(names.accessToken, values.accessToken, createCookieOptions());
  response.cookies.set(names.refreshToken, values.refreshToken, createCookieOptions());
  response.cookies.set(names.user, values.user, createCookieOptions());

  return response;
}

export function clearSessionCookies(response: NextResponse) {
  const names = getSessionCookieNames();

  response.cookies.set(names.accessToken, '', createExpiredCookieOptions());
  response.cookies.set(names.refreshToken, '', createExpiredCookieOptions());
  response.cookies.set(names.user, '', createExpiredCookieOptions());

  return response;
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
