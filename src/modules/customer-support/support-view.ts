import type { SupportTicketStatus } from '@/lib/api/contracts';

type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export function getSupportTicketStatusView(status: SupportTicketStatus): {
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
      label: 'Aguardando voce',
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

export function getSupportMessageSenderLabel(senderRole: string) {
  return senderRole === 'admin' ? 'Suporte' : 'Voce';
}
