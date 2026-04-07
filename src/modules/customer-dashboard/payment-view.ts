import type { PaymentResource } from '@/lib/api/contracts';

type PaymentStatusView = {
  badgeLabel: string;
  title: string;
  description: string;
  tone: 'neutral' | 'success' | 'warning' | 'danger';
  autoRefresh: boolean;
};

export function getPaymentStatusView(status: PaymentResource['status']): PaymentStatusView {
  switch (status) {
    case 'confirmed':
      return {
        badgeLabel: 'Confirmado',
        title: 'Pagamento confirmado',
        description: 'O valor ja foi confirmado. O saldo deve aparecer na carteira em seguida.',
        tone: 'success',
        autoRefresh: false,
      };
    case 'expired':
      return {
        badgeLabel: 'Expirado',
        title: 'PIX expirado',
        description: 'Este codigo venceu. Gere um novo PIX para continuar adicionando saldo.',
        tone: 'danger',
        autoRefresh: false,
      };
    case 'failed':
      return {
        badgeLabel: 'Falhou',
        title: 'Pagamento falhou',
        description: 'Nao foi possivel concluir este pagamento. Gere um novo PIX se precisar.',
        tone: 'danger',
        autoRefresh: false,
      };
    case 'cancelled':
      return {
        badgeLabel: 'Cancelado',
        title: 'Pagamento cancelado',
        description: 'Este pagamento foi cancelado. Gere um novo PIX se quiser tentar novamente.',
        tone: 'danger',
        autoRefresh: false,
      };
    case 'pending':
    default:
      return {
        badgeLabel: 'Pendente',
        title: 'Aguardando pagamento',
        description: 'Use o QR code ou copie o codigo PIX. O status atualiza automaticamente enquanto estiver pendente.',
        tone: 'warning',
        autoRefresh: true,
      };
  }
}

export function getPaymentQrImageSrc(brCodeBase64: string | null): string | null {
  if (!brCodeBase64) {
    return null;
  }

  if (brCodeBase64.startsWith('data:')) {
    return brCodeBase64;
  }

  return `data:image/png;base64,${brCodeBase64}`;
}
