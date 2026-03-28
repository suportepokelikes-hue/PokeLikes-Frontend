"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClientError = void 0;
exports.apiRequest = apiRequest;
const env_1 = require("@/lib/config/env");
class ApiClientError extends Error {
    status;
    code;
    details;
    constructor(message, status, code, details) {
        super(message);
        this.name = 'ApiClientError';
        this.status = status;
        this.code = code;
        this.details = details;
    }
}
exports.ApiClientError = ApiClientError;
async function apiRequest({ path, method = 'GET', body, accessToken, headers, cache = 'no-store', }) {
    const { apiBaseUrl } = (0, env_1.getPublicEnv)();
    const url = new URL(path, ensureTrailingSlash(apiBaseUrl));
    const requestHeaders = new Headers(headers);
    if (body !== undefined && !requestHeaders.has('Content-Type')) {
        requestHeaders.set('Content-Type', 'application/json');
    }
    if (accessToken) {
        requestHeaders.set('Authorization', `Bearer ${accessToken}`);
    }
    const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        cache,
    });
    if (!response.ok) {
        const payload = await readJsonBody(response);
        throw new ApiClientError(payload?.error?.message ?? `Backend request failed with status ${response.status}.`, response.status, payload?.error?.code, payload?.error?.details);
    }
    if (response.status === 204) {
        return undefined;
    }
    return (await readJsonBody(response));
}
async function readJsonBody(response) {
    const text = await response.text();
    if (!text) {
        return undefined;
    }
    return JSON.parse(text);
}
function ensureTrailingSlash(value) {
    return value.endsWith('/') ? value : `${value}/`;
}
