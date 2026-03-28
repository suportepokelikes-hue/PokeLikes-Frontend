"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletSummary = getWalletSummary;
exports.getCustomerProfile = getCustomerProfile;
exports.listCustomerPayments = listCustomerPayments;
exports.listCustomerOrders = listCustomerOrders;
exports.listWalletTransactions = listWalletTransactions;
exports.createPixPayment = createPixPayment;
exports.getCustomerPaymentDetail = getCustomerPaymentDetail;
exports.createCustomerOrder = createCustomerOrder;
exports.getCustomerOrderDetail = getCustomerOrderDetail;
const http_1 = require("@/lib/api/http");
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
function listCustomerPayments({ accessToken }) {
    return (0, http_1.apiRequest)({
        path: '/me/payments?page=1&pageSize=5&sortOrder=desc',
        accessToken,
    });
}
function listCustomerOrders({ accessToken }) {
    return (0, http_1.apiRequest)({
        path: '/me/orders?page=1&pageSize=5&sortOrder=desc',
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
