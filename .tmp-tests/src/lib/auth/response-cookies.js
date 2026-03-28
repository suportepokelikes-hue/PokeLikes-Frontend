"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySessionCookies = applySessionCookies;
exports.clearSessionCookies = clearSessionCookies;
const session_1 = require("@/lib/auth/session");
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const secureCookie = process.env.NODE_ENV === 'production';
function applySessionCookies(response, session) {
    const values = (0, session_1.toSessionCookieValues)(session);
    const names = (0, session_1.getSessionCookieNames)();
    response.cookies.set(names.accessToken, values.accessToken, createCookieOptions());
    response.cookies.set(names.refreshToken, values.refreshToken, createCookieOptions());
    response.cookies.set(names.user, values.user, createCookieOptions());
    return response;
}
function clearSessionCookies(response) {
    const names = (0, session_1.getSessionCookieNames)();
    response.cookies.set(names.accessToken, '', createExpiredCookieOptions());
    response.cookies.set(names.refreshToken, '', createExpiredCookieOptions());
    response.cookies.set(names.user, '', createExpiredCookieOptions());
    return response;
}
function createCookieOptions() {
    return {
        httpOnly: true,
        sameSite: 'lax',
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
