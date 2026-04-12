"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeServerSessionCookies = writeServerSessionCookies;
exports.clearServerSessionCookies = clearServerSessionCookies;
exports.writeServerUserCookie = writeServerUserCookie;
const headers_1 = require("next/headers");
const session_1 = require("@/lib/auth/session");
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const secureCookie = process.env.NODE_ENV === 'production';
async function writeServerSessionCookies(session) {
    const cookieStore = await (0, headers_1.cookies)();
    const values = (0, session_1.toSessionCookieValues)(session);
    const names = (0, session_1.getSessionCookieNames)();
    cookieStore.set(names.accessToken, values.accessToken, createCookieOptions());
    cookieStore.set(names.refreshToken, values.refreshToken, createCookieOptions());
    cookieStore.set(names.user, values.user, createCookieOptions());
}
async function clearServerSessionCookies() {
    const cookieStore = await (0, headers_1.cookies)();
    const names = (0, session_1.getSessionCookieNames)();
    cookieStore.set(names.accessToken, '', createExpiredCookieOptions());
    cookieStore.set(names.refreshToken, '', createExpiredCookieOptions());
    cookieStore.set(names.user, '', createExpiredCookieOptions());
}
async function writeServerUserCookie(user) {
    const cookieStore = await (0, headers_1.cookies)();
    const names = (0, session_1.getSessionCookieNames)();
    cookieStore.set(names.user, (0, session_1.serializeUser)(user), createCookieOptions());
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
