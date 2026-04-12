'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPixPaymentAction = createPixPaymentAction;
exports.createOrderAction = createOrderAction;
const navigation_1 = require("next/navigation");
const customer_1 = require("@/lib/api/customer");
const cookies_1 = require("@/lib/auth/cookies");
const navigation_2 = require("@/lib/auth/navigation");
const action_helpers_1 = require("@/modules/customer-transactions/action-helpers");
async function createPixPaymentAction(_, formData) {
    const session = await (0, cookies_1.getServerSession)();
    const returnTo = (0, navigation_2.normalizeReturnTo)((0, action_helpers_1.readRequiredString)(formData, 'returnTo'));
    if (session.status !== 'authenticated' || session.user.role !== 'customer') {
        (0, navigation_1.redirect)((0, navigation_2.getLoginPath)({ reason: 'required', returnTo }));
    }
    const payload = (0, action_helpers_1.parseCreatePixPayload)(formData);
    if ('error' in payload) {
        return payload.error;
    }
    let paymentId;
    try {
        const payment = await (0, customer_1.createPixPayment)({ accessToken: session.accessToken }, payload.value);
        paymentId = payment.id;
    }
    catch (error) {
        return (0, action_helpers_1.mapTransactionFormError)(error, 'Nao foi possivel criar a cobranca PIX agora.');
    }
    (0, navigation_1.redirect)(`/app/payments?paymentId=${encodeURIComponent(paymentId)}`);
}
async function createOrderAction(_, formData) {
    const session = await (0, cookies_1.getServerSession)();
    const returnTo = (0, navigation_2.normalizeReturnTo)((0, action_helpers_1.readRequiredString)(formData, 'returnTo'));
    if (session.status !== 'authenticated' || session.user.role !== 'customer') {
        (0, navigation_1.redirect)((0, navigation_2.getLoginPath)({ reason: 'required', returnTo }));
    }
    const payload = (0, action_helpers_1.parseCreateOrderPayload)(formData);
    if ('error' in payload) {
        return payload.error;
    }
    let orderId;
    try {
        const order = await (0, customer_1.createCustomerOrder)({ accessToken: session.accessToken }, payload.value);
        orderId = order.id;
    }
    catch (error) {
        return (0, action_helpers_1.mapTransactionFormError)(error, 'Nao foi possivel criar o pedido agora.');
    }
    (0, navigation_1.redirect)(`/app/orders/${orderId}`);
}
