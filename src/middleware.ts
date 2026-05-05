import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { refreshSession } from '@/lib/api/auth';
import { getLoginPath } from '@/lib/auth/navigation';
import { getSessionCookieNames, isAccessTokenExpired, readSession, toSessionCookieValues } from '@/lib/auth/session';
import { applySessionCookies, clearSessionCookies } from '@/lib/auth/response-cookies';
import type { AuthSessionResponse } from '@/lib/api/contracts';

const customerMatcher = /^\/app(?:\/.*)?$/;
const adminMatcher = /^\/admin(?:\/.*)?$/;

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!customerMatcher.test(pathname) && !adminMatcher.test(pathname)) {
    return NextResponse.next();
  }

  const session = readSession(request.cookies);

  if (session.status === 'guest') {
    const refreshToken = request.cookies.get(getSessionCookieNames().refreshToken)?.value;

    if (!refreshToken) {
      return redirectToPublic(request, 'required');
    }

    try {
      const refreshedSession = await refreshSession({ refreshToken });

      if (adminMatcher.test(pathname) && refreshedSession.user.role !== 'admin') {
        return applySessionCookies(NextResponse.redirect(new URL('/app', request.url)), refreshedSession);
      }

      if (customerMatcher.test(pathname) && refreshedSession.user.role !== 'customer') {
        return applySessionCookies(NextResponse.redirect(new URL('/admin', request.url)), refreshedSession);
      }

      return continueWithSession(request, refreshedSession);
    } catch {
      return clearSessionCookies(redirectToPublic(request, 'expired'));
    }
  }

  if (isAccessTokenExpired(session.accessToken)) {
    try {
      const refreshedSession = await refreshSession({ refreshToken: session.refreshToken });

      if (adminMatcher.test(pathname) && refreshedSession.user.role !== 'admin') {
        return applySessionCookies(NextResponse.redirect(new URL('/app', request.url)), refreshedSession);
      }

      if (customerMatcher.test(pathname) && refreshedSession.user.role !== 'customer') {
        return applySessionCookies(NextResponse.redirect(new URL('/admin', request.url)), refreshedSession);
      }

      return continueWithSession(request, refreshedSession);
    } catch {
      return clearSessionCookies(redirectToPublic(request, 'expired'));
    }
  }

  if (adminMatcher.test(pathname) && session.user.role !== 'admin') {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  if (customerMatcher.test(pathname) && session.user.role !== 'customer') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/admin/:path*'],
};

function redirectToPublic(request: NextRequest, reason: 'required' | 'expired') {
  const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  return NextResponse.redirect(new URL(getLoginPath({ reason, returnTo }), request.url));
}

function continueWithSession(request: NextRequest, session: AuthSessionResponse) {
  return applySessionCookies(
    NextResponse.next({
      request: {
        headers: createSessionRequestHeaders(request, session),
      },
    }),
    session,
  );
}

function createSessionRequestHeaders(request: NextRequest, session: AuthSessionResponse) {
  const headers = new Headers(request.headers);
  const names = getSessionCookieNames();
  const values = toSessionCookieValues(session);
  const cookieValues = new Map(request.cookies.getAll().map((cookie) => [cookie.name, cookie.value]));

  cookieValues.set(names.accessToken, values.accessToken);
  cookieValues.set(names.refreshToken, values.refreshToken);
  cookieValues.set(names.user, values.user);
  headers.set(
    'cookie',
    Array.from(cookieValues.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join('; '),
  );

  return headers;
}
