"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCustomer = registerCustomer;
exports.login = login;
exports.refreshSession = refreshSession;
exports.logout = logout;
exports.getAuthMe = getAuthMe;
exports.getCurrentUser = getCurrentUser;
const http_1 = require("@/lib/api/http");
function registerCustomer(payload) {
    return (0, http_1.apiRequest)({
        path: '/auth/register',
        method: 'POST',
        body: payload,
    });
}
function login(payload) {
    return (0, http_1.apiRequest)({
        path: '/auth/login',
        method: 'POST',
        body: payload,
    });
}
function refreshSession(payload) {
    return (0, http_1.apiRequest)({
        path: '/auth/refresh',
        method: 'POST',
        body: payload,
    });
}
function logout(payload) {
    return (0, http_1.apiRequest)({
        path: '/auth/logout',
        method: 'POST',
        body: payload,
    });
}
function getAuthMe(accessToken) {
    return (0, http_1.apiRequest)({
        path: '/auth/me',
        accessToken,
    });
}
function getCurrentUser(accessToken) {
    return (0, http_1.apiRequest)({
        path: '/me',
        accessToken,
    });
}
