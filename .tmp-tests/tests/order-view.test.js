"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const order_view_1 = require("../src/modules/orders/order-view");
(0, node_test_1.default)('getOrderStatusView treats queued supplier balance as operational waiting', () => {
    const view = (0, order_view_1.getOrderStatusView)('queued_supplier_balance');
    strict_1.default.equal(view.label, 'Aguardando saldo do fornecedor');
    strict_1.default.equal(view.tone, 'warning');
    strict_1.default.match(view.description, /saldo/i);
});
(0, node_test_1.default)('getOrderEventView explains queue and recovery without technical jargon for customers', () => {
    const queuedView = (0, order_view_1.getOrderEventView)({
        id: 'evt_1',
        eventType: 'status_changed',
        fromStatus: 'submitted',
        toStatus: 'queued_supplier_balance',
        metadata: null,
        createdAt: '2026-04-11T10:00:00.000Z',
    }, 'customer');
    strict_1.default.equal(queuedView.title, 'Pedido em espera operacional');
    strict_1.default.match(queuedView.description, /reservado/i);
    const resumedView = (0, order_view_1.getOrderEventView)({
        id: 'evt_2',
        eventType: 'status_changed',
        fromStatus: 'queued_supplier_balance',
        toStatus: 'submitted',
        metadata: null,
        createdAt: '2026-04-11T11:00:00.000Z',
    }, 'customer');
    strict_1.default.equal(resumedView.title, 'Processamento retomado');
    strict_1.default.match(resumedView.description, /retomado/i);
});
(0, node_test_1.default)('sortOrderEvents keeps the timeline in chronological order and queued history is detectable', () => {
    const sorted = (0, order_view_1.sortOrderEvents)([
        {
            id: 'evt_2',
            eventType: 'status_changed',
            fromStatus: 'queued_supplier_balance',
            toStatus: 'submitted',
            metadata: null,
            createdAt: '2026-04-11T11:00:00.000Z',
        },
        {
            id: 'evt_1',
            eventType: 'status_changed',
            fromStatus: 'submitted',
            toStatus: 'queued_supplier_balance',
            metadata: null,
            createdAt: '2026-04-11T10:00:00.000Z',
        },
    ]);
    strict_1.default.deepEqual(sorted.map((event) => event.id), ['evt_1', 'evt_2']);
    strict_1.default.equal((0, order_view_1.orderHasQueuedSupplierBalance)({
        status: 'submitted',
        events: sorted,
    }), true);
});
