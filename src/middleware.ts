import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { refreshSession } from '@/lib/api/auth';
import { getLoginPath } from '@/lib/auth/navigation';
import { getSessionCookieNames, readSession } from '@/lib/auth/session';
import { applySessionCookies, clearSessionCookies } from '@/lib/auth/response-cookies';

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

      return applySessionCookies(NextResponse.next(), refreshedSession);
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
