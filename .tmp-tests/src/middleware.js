"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.middleware = middleware;
const server_1 = require("next/server");
const auth_1 = require("@/lib/api/auth");
const navigation_1 = require("@/lib/auth/navigation");
const session_1 = require("@/lib/auth/session");
const response_cookies_1 = require("@/lib/auth/response-cookies");
const customerMatcher = /^\/app(?:\/.*)?$/;
const adminMatcher = /^\/admin(?:\/.*)?$/;
async function middleware(request) {
    const pathname = request.nextUrl.pathname;
    if (!customerMatcher.test(pathname) && !adminMatcher.test(pathname)) {
        return server_1.NextResponse.next();
    }
    const session = (0, session_1.readSession)(request.cookies);
    if (session.status === 'guest') {
        const refreshToken = request.cookies.get((0, session_1.getSessionCookieNames)().refreshToken)?.value;
        if (!refreshToken) {
            return redirectToPublic(request, 'required');
        }
        try {
            const refreshedSession = await (0, auth_1.refreshSession)({ refreshToken });
            if (adminMatcher.test(pathname) && refreshedSession.user.role !== 'admin') {
                return (0, response_cookies_1.applySessionCookies)(server_1.NextResponse.redirect(new URL('/app', request.url)), refreshedSession);
            }
            if (customerMatcher.test(pathname) && refreshedSession.user.role !== 'customer') {
                return (0, response_cookies_1.applySessionCookies)(server_1.NextResponse.redirect(new URL('/admin', request.url)), refreshedSession);
            }
            return (0, response_cookies_1.applySessionCookies)(server_1.NextResponse.next(), refreshedSession);
        }
        catch {
            return (0, response_cookies_1.clearSessionCookies)(redirectToPublic(request, 'expired'));
        }
    }
    if (adminMatcher.test(pathname) && session.user.role !== 'admin') {
        return server_1.NextResponse.redirect(new URL('/app', request.url));
    }
    if (customerMatcher.test(pathname) && session.user.role !== 'customer') {
        return server_1.NextResponse.redirect(new URL('/admin', request.url));
    }
    return server_1.NextResponse.next();
}
exports.config = {
    matcher: ['/app/:path*', '/admin/:path*'],
};
function redirectToPublic(request, reason) {
    const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    return server_1.NextResponse.redirect(new URL((0, navigation_1.getLoginPath)({ reason, returnTo }), request.url));
}
