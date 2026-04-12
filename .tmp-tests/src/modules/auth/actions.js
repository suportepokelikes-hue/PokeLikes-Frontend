'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAction = loginAction;
exports.registerAction = registerAction;
exports.logoutAction = logoutAction;
exports.requestEmailVerificationAction = requestEmailVerificationAction;
const cache_1 = require("next/cache");
const navigation_1 = require("next/navigation");
const auth_1 = require("@/lib/api/auth");
const cookies_1 = require("@/lib/auth/cookies");
const navigation_2 = require("@/lib/auth/navigation");
const server_cookies_1 = require("@/lib/auth/server-cookies");
const action_helpers_1 = require("@/modules/auth/action-helpers");
async function loginAction(_, formData) {
    const email = (0, action_helpers_1.readTrimmedString)(formData, 'email');
    const password = (0, action_helpers_1.readTrimmedString)(formData, 'password');
    const returnTo = (0, navigation_2.normalizeReturnTo)((0, action_helpers_1.readTrimmedString)(formData, 'returnTo'));
    if (!email || !password) {
        return {
            status: 'error',
            message: 'Preencha email e senha para entrar.',
        };
    }
    let role;
    try {
        const session = await (0, auth_1.login)({ email, password });
        await (0, server_cookies_1.writeServerSessionCookies)(session);
        role = session.user.role;
    }
    catch (error) {
        return (0, action_helpers_1.mapLoginError)(error);
    }
    (0, navigation_1.redirect)((0, navigation_2.getPostAuthRedirectPath)(role, returnTo));
}
async function registerAction(_, formData) {
    const name = (0, action_helpers_1.readTrimmedString)(formData, 'name');
    const email = (0, action_helpers_1.readTrimmedString)(formData, 'email');
    const phone = (0, action_helpers_1.readTrimmedString)(formData, 'phone');
    const password = (0, action_helpers_1.readTrimmedString)(formData, 'password');
    const referralCode = (0, navigation_2.normalizeReferralCode)((0, action_helpers_1.readTrimmedString)(formData, 'referralCode'));
    const returnTo = (0, navigation_2.normalizeReturnTo)((0, action_helpers_1.readTrimmedString)(formData, 'returnTo'));
    if (!name || !email || !phone || !password) {
        return {
            status: 'error',
            message: 'Preencha nome, email, telefone e senha para criar a conta.',
        };
    }
    let role;
    try {
        const session = await (0, auth_1.registerCustomer)({
            name,
            email,
            phone,
            password,
            ...(referralCode ? { referralCode } : {}),
        });
        await (0, server_cookies_1.writeServerSessionCookies)(session);
        role = session.user.role;
    }
    catch (error) {
        return (0, action_helpers_1.mapRegisterError)(error);
    }
    (0, navigation_1.redirect)((0, navigation_2.getPostAuthRedirectPath)(role, returnTo));
}
async function logoutAction() {
    const session = await (0, cookies_1.getServerSession)();
    try {
        if (session.status === 'authenticated') {
            await (0, auth_1.logout)({ refreshToken: session.refreshToken });
        }
    }
    catch {
        // The frontend should still clear local session even if backend revocation fails.
    }
    await (0, server_cookies_1.clearServerSessionCookies)();
    (0, navigation_1.redirect)((0, navigation_2.getLoginPath)({ reason: 'logged_out' }));
}
async function requestEmailVerificationAction(_, _formData) {
    const session = await (0, cookies_1.getServerSession)();
    if (session.status !== 'authenticated') {
        (0, navigation_1.redirect)((0, navigation_2.getLoginPath)({ reason: 'required', returnTo: '/app/profile' }));
    }
    try {
        const response = await (0, auth_1.requestEmailVerification)(session.accessToken);
        if (response.status === 'already_verified') {
            await (0, server_cookies_1.writeServerUserCookie)({
                ...session.user,
                emailVerified: true,
            });
            (0, cache_1.revalidatePath)('/app');
            (0, cache_1.revalidatePath)('/app/profile');
            return {
                status: 'success',
                message: 'Seu email ja esta verificado.',
                delivery: response.delivery,
                expiresAt: response.expiresAt,
            };
        }
        return {
            status: 'success',
            message: response.delivery === 'preview'
                ? 'Token de verificacao gerado para desenvolvimento.'
                : 'Enviamos um email com o link de verificacao.',
            delivery: response.delivery,
            expiresAt: response.expiresAt,
            ...(process.env.NODE_ENV !== 'production' && response.previewToken
                ? {
                    previewToken: response.previewToken,
                    previewHref: `/verify-email?token=${encodeURIComponent(response.previewToken)}`,
                }
                : {}),
        };
    }
    catch (error) {
        return (0, action_helpers_1.mapEmailVerificationRequestError)(error);
    }
}
