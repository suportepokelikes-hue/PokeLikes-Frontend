import test from 'node:test';
import assert from 'node:assert/strict';

import { getOrderEventView, getOrderStatusView, orderHasQueuedSupplierBalance, sortOrderEvents } from '../src/modules/orders/order-view';

test('getOrderStatusView treats queued supplier balance as operational waiting', () => {
  const view = getOrderStatusView('queued_supplier_balance');

  assert.equal(view.label, 'Aguardando saldo do fornecedor');
  assert.equal(view.tone, 'warning');
  assert.match(view.description, /saldo/i);
});

test('getOrderEventView explains queue and recovery without technical jargon for customers', () => {
  const queuedView = getOrderEventView(
    {
      id: 'evt_1',
      eventType: 'status_changed',
      fromStatus: 'submitted',
      toStatus: 'queued_supplier_balance',
      metadata: null,
      createdAt: '2026-04-11T10:00:00.000Z',
    },
    'customer',
  );

  assert.equal(queuedView.title, 'Pedido em espera operacional');
  assert.match(queuedView.description, /ativo|saldo/i);

  const resumedView = getOrderEventView(
    {
      id: 'evt_2',
      eventType: 'status_changed',
      fromStatus: 'queued_supplier_balance',
      toStatus: 'submitted',
      metadata: null,
      createdAt: '2026-04-11T11:00:00.000Z',
    },
    'customer',
  );

  assert.equal(resumedView.title, 'Processamento retomado');
  assert.match(resumedView.description, /processar|fluxo/i);
});

test('sortOrderEvents keeps the timeline in chronological order and queued history is detectable', () => {
  const sorted = sortOrderEvents([
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

  assert.deepEqual(sorted.map((event) => event.id), ['evt_1', 'evt_2']);
  assert.equal(
    orderHasQueuedSupplierBalance({
      status: 'submitted',
      events: sorted,
    }),
    true,
  );
});
