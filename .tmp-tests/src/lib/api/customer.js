"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletSummary = getWalletSummary;
exports.getCustomerProfile = getCustomerProfile;
exports.updateCustomerProfile = updateCustomerProfile;
exports.getCustomerReferralSummary = getCustomerReferralSummary;
exports.getCustomerAffiliateProfile = getCustomerAffiliateProfile;
exports.getCustomerAffiliatePix = getCustomerAffiliatePix;
exports.applyToAffiliateProgram = applyToAffiliateProgram;
exports.updateCustomerAffiliatePix = updateCustomerAffiliatePix;
exports.getCustomerAffiliateSummary = getCustomerAffiliateSummary;
exports.listCustomerAffiliateCommissions = listCustomerAffiliateCommissions;
exports.listCustomerPayments = listCustomerPayments;
exports.listCustomerOrders = listCustomerOrders;
exports.listWalletTransactions = listWalletTransactions;
exports.createPixPayment = createPixPayment;
exports.getCustomerPaymentDetail = getCustomerPaymentDetail;
exports.createCustomerOrder = createCustomerOrder;
exports.getCustomerOrderDetail = getCustomerOrderDetail;
const affiliate_normalizers_1 = require("./affiliate-normalizers");
const http_1 = require("./http");
function getWalletSummary({ accessToken }) {
    return (0, http_1.apiRequest)({
        path: '/me/wallet',
        accessToken,
    });
}
function getCustomerProfile({ accessToken }) {
    return (0, http_1.apiRequest)({
        path: '/me',
        accessToken,
    });
}
function updateCustomerProfile({ accessToken }, payload) {
    return (0, http_1.apiRequest)({
        path: '/me',
        method: 'PATCH',
        accessToken,
        body: payload,
    });
}
function getCustomerReferralSummary({ accessToken }) {
    return (0, http_1.apiRequest)({
        path: '/me/referral',
        accessToken,
    });
}
function getCustomerAffiliateProfile({ accessToken }) {
    return (0, http_1.apiRequest)({
        path: '/me/affiliate',
        accessToken,
    }).then(affiliate_normalizers_1.normalizeAffiliateProfile);
}
function getCustomerAffiliatePix({ accessToken }) {
    return (0, http_1.apiRequest)({
        path: '/me/affiliate/pix-key',
        accessToken,
    }).then(affiliate_normalizers_1.normalizeAffiliatePixKey);
}
function applyToAffiliateProgram({ accessToken }) {
    return (0, http_1.apiRequest)({
        path: '/me/affiliate/apply',
        method: 'POST',
        accessToken,
    }).then((response) => (0, affiliate_normalizers_1.normalizeAffiliateProfile)(response));
}
function updateCustomerAffiliatePix({ accessToken }, payload) {
    return (0, http_1.apiRequest)({
        path: '/me/affiliate/pix-key',
        method: 'PATCH',
        accessToken,
        body: payload,
    }).then(affiliate_normalizers_1.normalizeAffiliatePixKey);
}
function getCustomerAffiliateSummary({ accessToken }) {
    return (0, http_1.apiRequest)({
        path: '/me/affiliate/summary',
        accessToken,
    }).then(affiliate_normalizers_1.normalizeAffiliateSummary);
}
function listCustomerAffiliateCommissions({ accessToken }) {
    return (0, http_1.apiRequest)({
        path: '/me/affiliate/commissions?page=1&pageSize=10&sortOrder=desc',
        accessToken,
    }).then(affiliate_normalizers_1.normalizeAffiliateCommissionsResponse);
}
function listCustomerPayments({ accessToken }, { page = 1, pageSize = 5, sortOrder = 'desc' } = {}) {
    return (0, http_1.apiRequest)({
        path: `/me/payments?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`,
        accessToken,
    });
}
function listCustomerOrders({ accessToken }, { page = 1, pageSize = 5, sortOrder = 'desc', search, status } = {}) {
    const searchParams = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        sortOrder,
    });
    if (search) {
        searchParams.set('search', search);
    }
    if (status) {
        searchParams.set('status', status);
    }
    return (0, http_1.apiRequest)({
        path: `/me/orders?${searchParams.toString()}`,
        accessToken,
    });
}
function listWalletTransactions({ accessToken }) {
    return (0, http_1.apiRequest)({
        path: '/me/wallet/transactions?page=1&pageSize=10&sortOrder=desc',
        accessToken,
    });
}
function createPixPayment({ accessToken }, payload) {
    return (0, http_1.apiRequest)({
        path: '/me/payments/pix',
        method: 'POST',
        accessToken,
        body: payload,
    });
}
function getCustomerPaymentDetail({ accessToken }, paymentId) {
    return (0, http_1.apiRequest)({
        path: `/me/payments/${paymentId}`,
        accessToken,
    });
}
function createCustomerOrder({ accessToken }, payload) {
    return (0, http_1.apiRequest)({
        path: '/me/orders',
        method: 'POST',
        accessToken,
        body: payload,
    });
}
function getCustomerOrderDetail({ accessToken }, orderId) {
    return (0, http_1.apiRequest)({
        path: `/me/orders/${orderId}`,
        accessToken,
    });
}
