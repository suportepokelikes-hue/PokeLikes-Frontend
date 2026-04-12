"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAffiliateCode = normalizeAffiliateCode;
exports.readAffiliateCodeFromSearchParams = readAffiliateCodeFromSearchParams;
exports.persistAffiliateCode = persistAffiliateCode;
exports.getStoredAffiliateCode = getStoredAffiliateCode;
exports.clearStoredAffiliateCode = clearStoredAffiliateCode;
exports.appendAffiliateCodeToPath = appendAffiliateCodeToPath;
const AFFILIATE_CODE_STORAGE_KEY = 'likes-uai.affiliate-code';
function normalizeAffiliateCode(value) {
    if (typeof value !== 'string') {
        return undefined;
    }
    const normalized = value.trim();
    return normalized ? normalized : undefined;
}
function readAffiliateCodeFromSearchParams(searchParams) {
    return normalizeAffiliateCode(searchParams.get('aff'));
}
function persistAffiliateCode(value) {
    const normalized = normalizeAffiliateCode(value);
    if (!normalized || typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(AFFILIATE_CODE_STORAGE_KEY, normalized);
    }
    catch {
        // Ignore storage failures and keep checkout flow working without affiliate attribution.
    }
}
function getStoredAffiliateCode() {
    if (typeof window === 'undefined') {
        return undefined;
    }
    try {
        return normalizeAffiliateCode(window.localStorage.getItem(AFFILIATE_CODE_STORAGE_KEY));
    }
    catch {
        return undefined;
    }
}
function clearStoredAffiliateCode() {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.removeItem(AFFILIATE_CODE_STORAGE_KEY);
    }
    catch {
        // Ignore storage failures.
    }
}
function appendAffiliateCodeToPath(path, affiliateCode) {
    const normalized = normalizeAffiliateCode(affiliateCode);
    if (!normalized) {
        return path;
    }
    const [pathname, search = ''] = path.split('?', 2);
    const searchParams = new URLSearchParams(search);
    searchParams.set('aff', normalized);
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
}
