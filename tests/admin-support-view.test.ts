import test from 'node:test';
import assert from 'node:assert/strict';

import type { AdminSupportTicketResource } from '../src/lib/api/contracts';
import {
  getAdminSupportMessageSenderLabel,
  getAdminSupportTicketStatusView,
  sortAdminSupportTickets,
} from '../src/modules/admin-support/support-view';

test('getAdminSupportTicketStatusView maps support statuses for admin', () => {
  assert.deepEqual(getAdminSupportTicketStatusView('open'), {
    label: 'Aberto',
    tone: 'success',
    canReply: true,
  });
  assert.deepEqual(getAdminSupportTicketStatusView('waiting_customer'), {
    label: 'Aguardando cliente',
    tone: 'warning',
    canReply: true,
  });
  assert.deepEqual(getAdminSupportTicketStatusView('closed'), {
    label: 'Fechado',
    tone: 'neutral',
    canReply: false,
  });
});

test('sortAdminSupportTickets prioritizes open tickets then latest update', () => {
  const tickets: AdminSupportTicketResource[] = [
    makeTicket('closed-new', 'closed', '2026-05-01T12:00:00.000Z'),
    makeTicket('open-old', 'open', '2026-05-01T08:00:00.000Z'),
    makeTicket('waiting-new', 'waiting_customer', '2026-05-01T11:00:00.000Z'),
    makeTicket('open-new', 'open', '2026-05-01T10:00:00.000Z'),
  ];

  assert.deepEqual(sortAdminSupportTickets(tickets).map((ticket) => ticket.id), [
    'open-new',
    'open-old',
    'waiting-new',
    'closed-new',
  ]);
});

test('getAdminSupportMessageSenderLabel keeps chat labels operational', () => {
  assert.equal(getAdminSupportMessageSenderLabel('customer'), 'Cliente');
  assert.equal(getAdminSupportMessageSenderLabel('admin'), 'Admin');
});

function makeTicket(id: string, status: AdminSupportTicketResource['status'], lastMessageAt: string): AdminSupportTicketResource {
  return {
    id,
    userId: 'user-1',
    subject: id,
    status,
    lastMessageAt,
    closedAt: null,
    closedByAdminId: null,
    createdAt: '2026-05-01T07:00:00.000Z',
    updatedAt: lastMessageAt,
    messages: [],
    user: { id: 'user-1', name: 'Cliente', email: 'cliente@example.com' },
  };
}
