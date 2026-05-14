import type { AdminSupportTicketResource, SupportTicketMessageResource, SupportTicketStatus } from '@/lib/api/contracts';

type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const statusPriority: Record<SupportTicketStatus, number> = {
  open: 0,
  waiting_customer: 1,
  closed: 2,
};

export function getAdminSupportTicketStatusView(status: SupportTicketStatus): {
  label: string;
  tone: BadgeTone;
  canReply: boolean;
} {
  if (status === 'closed') {
    return {
      label: 'Fechado',
      tone: 'neutral',
      canReply: false,
    };
  }

  if (status === 'waiting_customer') {
    return {
      label: 'Aguardando cliente',
      tone: 'warning',
      canReply: true,
    };
  }

  return {
    label: 'Aberto',
    tone: 'success',
    canReply: true,
  };
}

export function sortAdminSupportTickets(tickets: AdminSupportTicketResource[]) {
  return [...tickets].sort((first, second) => {
    const priorityDelta = statusPriority[first.status] - statusPriority[second.status];

    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    return getTicketTimestamp(second) - getTicketTimestamp(first);
  });
}

export function sortSupportMessages(messages: SupportTicketMessageResource[]) {
  return [...messages].sort((first, second) => {
    return new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime();
  });
}

export function getAdminSupportMessageSenderLabel(senderRole: string) {
  return senderRole === 'admin' ? 'Admin' : 'Cliente';
}

function getTicketTimestamp(ticket: AdminSupportTicketResource) {
  return new Date(ticket.lastMessageAt || ticket.updatedAt || ticket.createdAt).getTime();
}
