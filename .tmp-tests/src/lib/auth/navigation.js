"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoginPath = getLoginPath;
exports.getRegisterPath = getRegisterPath;
exports.getPostAuthRedirectPath = getPostAuthRedirectPath;
exports.getAuthNotice = getAuthNotice;
exports.normalizeReturnTo = normalizeReturnTo;
exports.normalizeReferralCode = normalizeReferralCode;
function getLoginPath(options = {}) {
    return buildAuthEntryPath('/login', options);
}
function getRegisterPath(options = {}) {
    return buildAuthEntryPath('/register', options);
}
function getPostAuthRedirectPath(role, returnTo) {
    const normalized = normalizeReturnTo(returnTo);
    if (!normalized) {
        return getDefaultAreaPath(role);
    }
    if (role === 'customer' && normalized.startsWith('/admin')) {
        return '/app/services';
    }
    if (role === 'admin' && normalized.startsWith('/app')) {
        return '/admin';
    }
    return normalized;
}
function getAuthNotice(searchParams) {
    const reason = readSingle(searchParams.reason);
    const hasReturnTo = Boolean(normalizeReturnTo(readSingle(searchParams.returnTo)));
    if (reason === 'expired') {
        return {
            tone: 'warning',
            title: 'Sessao expirada',
            description: hasReturnTo
                ? 'Sua sessao nao pode ser renovada. Entre novamente para voltar ao fluxo que estava aberto.'
                : 'Sua sessao nao pode ser renovada. Entre novamente para continuar.',
        };
    }
    if (reason === 'logged_out') {
        return {
            tone: 'success',
            title: 'Logout concluido',
            description: 'Sua sessao foi encerrada com sucesso. Quando quiser, entre novamente.',
        };
    }
    if (reason === 'required') {
        return {
            tone: 'info',
            title: 'Acesso necessario',
            description: hasReturnTo
                ? 'Entre para continuar exatamente na rota protegida que originou este redirecionamento.'
                : 'Entre para acessar a area autenticada.',
        };
    }
    return null;
}
function normalizeReturnTo(value) {
    if (!value || !value.startsWith('/') || value.startsWith('//')) {
        return null;
    }
    try {
        const url = new URL(value, 'https://likesuai.local');
        const normalized = `${url.pathname}${url.search}`;
        if (url.pathname === '/login' || url.pathname === '/register') {
            return null;
        }
        return normalized;
    }
    catch {
        return null;
    }
}
function normalizeReferralCode(value) {
    if (!value) {
        return null;
    }
    const normalized = value.trim();
    if (!normalized || normalized.length > 128) {
        return null;
    }
    return normalized;
}
function buildAuthEntryPath(pathname, options) {
    const searchParams = new URLSearchParams();
    const returnTo = normalizeReturnTo(options.returnTo);
    const referralCode = normalizeReferralCode(options.referralCode);
    if (options.reason) {
        searchParams.set('reason', options.reason);
    }
    if (returnTo) {
        searchParams.set('returnTo', returnTo);
    }
    if (referralCode) {
        searchParams.set('ref', referralCode);
    }
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
}
function getDefaultAreaPath(role) {
    return role === 'admin' ? '/admin' : '/app/services';
}
function readSingle(value) {
    return Array.isArray(value) ? value[0] : value;
}
