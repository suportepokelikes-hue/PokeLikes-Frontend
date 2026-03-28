"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireCustomerSession = requireCustomerSession;
exports.requireAdminSession = requireAdminSession;
exports.redirectAuthenticatedUser = redirectAuthenticatedUser;
const navigation_1 = require("next/navigation");
const cookies_1 = require("@/lib/auth/cookies");
const navigation_2 = require("@/lib/auth/navigation");
async function requireCustomerSession(returnTo) {
    const session = await (0, cookies_1.getServerSession)();
    if (session.status !== 'authenticated') {
        (0, navigation_1.redirect)((0, navigation_2.getLoginPath)({ reason: 'required', returnTo: (0, navigation_2.normalizeReturnTo)(returnTo) }));
    }
    if (session.user.role !== 'customer') {
        (0, navigation_1.redirect)('/admin');
    }
    return session;
}
async function requireAdminSession(returnTo) {
    const session = await (0, cookies_1.getServerSession)();
    if (session.status !== 'authenticated') {
        (0, navigation_1.redirect)((0, navigation_2.getLoginPath)({ reason: 'required', returnTo: (0, navigation_2.normalizeReturnTo)(returnTo) }));
    }
    if (session.user.role !== 'admin') {
        (0, navigation_1.redirect)('/app');
    }
    return session;
}
async function redirectAuthenticatedUser(returnTo) {
    const session = await (0, cookies_1.getServerSession)();
    if (session.status !== 'authenticated') {
        return;
    }
    (0, navigation_1.redirect)((0, navigation_2.getPostAuthRedirectPath)(session.user.role, returnTo));
}
