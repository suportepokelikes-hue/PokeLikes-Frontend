'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAction = loginAction;
exports.registerAction = registerAction;
exports.logoutAction = logoutAction;
const navigation_1 = require("next/navigation");
const http_1 = require("@/lib/api/http");
const auth_1 = require("@/lib/api/auth");
const cookies_1 = require("@/lib/auth/cookies");
const navigation_2 = require("@/lib/auth/navigation");
const server_cookies_1 = require("@/lib/auth/server-cookies");
async function loginAction(_, formData) {
    const email = readRequiredString(formData, 'email');
    const password = readRequiredString(formData, 'password');
    const returnTo = (0, navigation_2.normalizeReturnTo)(readRequiredString(formData, 'returnTo'));
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
        return mapLoginError(error);
    }
    (0, navigation_1.redirect)((0, navigation_2.getPostAuthRedirectPath)(role, returnTo));
}
async function registerAction(_, formData) {
    const name = readRequiredString(formData, 'name');
    const email = readRequiredString(formData, 'email');
    const phone = readRequiredString(formData, 'phone');
    const password = readRequiredString(formData, 'password');
    const returnTo = (0, navigation_2.normalizeReturnTo)(readRequiredString(formData, 'returnTo'));
    if (!name || !email || !phone || !password) {
        return {
            status: 'error',
            message: 'Preencha nome, email, telefone e senha para criar a conta.',
        };
    }
    let role;
    try {
        const session = await (0, auth_1.registerCustomer)({ name, email, phone, password });
        await (0, server_cookies_1.writeServerSessionCookies)(session);
        role = session.user.role;
    }
    catch (error) {
        return mapRegisterError(error);
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
function readRequiredString(formData, key) {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}
function mapAuthError(error, fallbackMessage) {
    if (error instanceof http_1.ApiClientError) {
        return {
            status: 'error',
            message: error.message || fallbackMessage,
        };
    }
    return {
        status: 'error',
        message: fallbackMessage,
    };
}
function mapLoginError(error) {
    if (error instanceof http_1.ApiClientError && error.status === 401) {
        return {
            status: 'error',
            message: 'Email ou senha invalidos. Revise as credenciais e tente novamente.',
        };
    }
    return mapAuthError(error, 'Nao foi possivel autenticar agora. Tente novamente em instantes.');
}
function mapRegisterError(error) {
    if (error instanceof http_1.ApiClientError && error.status === 400) {
        return {
            status: 'error',
            message: error.message || 'Revise nome, email, telefone e senha antes de enviar o cadastro.',
        };
    }
    return mapAuthError(error, 'Nao foi possivel concluir o cadastro agora. Tente novamente em instantes.');
}
