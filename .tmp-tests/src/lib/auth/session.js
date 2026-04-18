"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionCookieNames = getSessionCookieNames;
exports.readSession = readSession;
exports.createGuestSession = createGuestSession;
exports.serializeUser = serializeUser;
exports.deserializeUser = deserializeUser;
exports.toSessionCookieValues = toSessionCookieValues;
const ACCESS_TOKEN_COOKIE = 'likes_uai_access_token';
const REFRESH_TOKEN_COOKIE = 'likes_uai_refresh_token';
const USER_COOKIE = 'likes_uai_user';
function getSessionCookieNames() {
    return {
        accessToken: ACCESS_TOKEN_COOKIE,
        refreshToken: REFRESH_TOKEN_COOKIE,
        user: USER_COOKIE,
    };
}
function readSession(cookies) {
    const accessToken = cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    const encodedUser = cookies.get(USER_COOKIE)?.value;
    if (!accessToken || !refreshToken || !encodedUser) {
        return createGuestSession();
    }
    const user = deserializeUser(encodedUser);
    if (!user) {
        return createGuestSession();
    }
    return {
        status: 'authenticated',
        accessToken,
        refreshToken,
        user,
    };
}
function createGuestSession() {
    return {
        status: 'guest',
        accessToken: null,
        refreshToken: null,
        user: null,
    };
}
function serializeUser(user) {
    return encodeBase64Url(JSON.stringify(user));
}
function deserializeUser(value) {
    try {
        const parsed = JSON.parse(decodeBase64Url(value));
        if (typeof parsed.id !== 'string' ||
            !isUserRole(parsed.role) ||
            typeof parsed.name !== 'string' ||
            typeof parsed.email !== 'string' ||
            typeof parsed.status !== 'string') {
            return null;
        }
        return {
            id: parsed.id,
            role: parsed.role,
            name: parsed.name,
            email: parsed.email,
            status: parsed.status,
            phone: typeof parsed.phone === 'string' ? parsed.phone : undefined,
            taxId: typeof parsed.taxId === 'string' ? parsed.taxId : undefined,
            fiscalProfile: parsed.fiscalProfile &&
                typeof parsed.fiscalProfile === 'object' &&
                typeof parsed.fiscalProfile.taxId === 'string' &&
                (parsed.fiscalProfile.taxIdType === 'cpf' || parsed.fiscalProfile.taxIdType === 'cnpj')
                ? {
                    taxId: parsed.fiscalProfile.taxId,
                    taxIdType: parsed.fiscalProfile.taxIdType,
                }
                : parsed.fiscalProfile === null
                    ? null
                    : undefined,
            referralCode: typeof parsed.referralCode === 'string' ? parsed.referralCode : undefined,
            emailVerified: typeof parsed.emailVerified === 'boolean' ? parsed.emailVerified : undefined,
        };
    }
    catch {
        return null;
    }
}
function toSessionCookieValues(session) {
    return {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        user: serializeUser(session.user),
    };
}
function isUserRole(value) {
    return value === 'customer' || value === 'admin';
}
function encodeBase64Url(value) {
    const bytes = new TextEncoder().encode(value);
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function decodeBase64Url(value) {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
    const binary = atob(`${normalized}${padding}`);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}
