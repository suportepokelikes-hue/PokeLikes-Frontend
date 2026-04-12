"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentStatusView = getPaymentStatusView;
exports.getPaymentQrImageSrc = getPaymentQrImageSrc;
exports.getPaymentShortId = getPaymentShortId;
function getPaymentStatusView(status) {
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
function getPaymentQrImageSrc(brCodeBase64) {
    if (!brCodeBase64) {
        return null;
    }
    if (brCodeBase64.startsWith('data:')) {
        return brCodeBase64;
    }
    return `data:image/png;base64,${brCodeBase64}`;
}
function getPaymentShortId(paymentId) {
    const normalized = paymentId.trim();
    if (normalized.length <= 10) {
        return normalized;
    }
    return `${normalized.slice(0, 6)}...${normalized.slice(-4)}`;
}
