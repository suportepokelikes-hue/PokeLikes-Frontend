"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const payment_view_1 = require("../src/modules/customer-dashboard/payment-view");
(0, node_test_1.default)('getPaymentStatusView maps backend statuses into customer-facing PIX states', () => {
    strict_1.default.deepEqual((0, payment_view_1.getPaymentStatusView)('pending'), {
        badgeLabel: 'Pendente',
        title: 'Aguardando pagamento',
        description: 'Use o QR code ou copie o codigo PIX. O status atualiza automaticamente enquanto estiver pendente.',
        tone: 'warning',
        autoRefresh: true,
    });
    strict_1.default.equal((0, payment_view_1.getPaymentStatusView)('confirmed').tone, 'success');
    strict_1.default.equal((0, payment_view_1.getPaymentStatusView)('expired').badgeLabel, 'Expirado');
    strict_1.default.equal((0, payment_view_1.getPaymentStatusView)('failed').badgeLabel, 'Falhou');
    strict_1.default.equal((0, payment_view_1.getPaymentStatusView)('cancelled').badgeLabel, 'Cancelado');
});
(0, node_test_1.default)('getPaymentQrImageSrc normalizes raw base64 into a usable image src', () => {
    strict_1.default.equal((0, payment_view_1.getPaymentQrImageSrc)(null), null);
    strict_1.default.equal((0, payment_view_1.getPaymentQrImageSrc)('data:image/png;base64,abc123'), 'data:image/png;base64,abc123');
    strict_1.default.equal((0, payment_view_1.getPaymentQrImageSrc)('abc123'), 'data:image/png;base64,abc123');
});
(0, node_test_1.default)('getPaymentShortId shortens long ids and preserves short ones', () => {
    strict_1.default.equal((0, payment_view_1.getPaymentShortId)('1234567890'), '1234567890');
    strict_1.default.equal((0, payment_view_1.getPaymentShortId)('pay_1234567890abcd'), 'pay_12...abcd');
});
