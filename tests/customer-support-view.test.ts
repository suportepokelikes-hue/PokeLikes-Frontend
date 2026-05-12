import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getSupportMessageSenderLabel,
  getSupportTicketStatusView,
} from '../src/modules/customer-support/support-view';

test('getSupportTicketStatusView maps customer support statuses to UI state', () => {
  assert.deepEqual(getSupportTicketStatusView('open'), {
    label: 'Aberto',
    tone: 'success',
    canReply: true,
  });
  assert.deepEqual(getSupportTicketStatusView('waiting_customer'), {
    label: 'Aguardando voce',
    tone: 'warning',
    canReply: true,
  });
  assert.deepEqual(getSupportTicketStatusView('closed'), {
    label: 'Fechado',
    tone: 'neutral',
    canReply: false,
  });
});

test('getSupportMessageSenderLabel keeps chat sides readable for customers', () => {
  assert.equal(getSupportMessageSenderLabel('customer'), 'Voce');
  assert.equal(getSupportMessageSenderLabel('admin'), 'Suporte');
});
