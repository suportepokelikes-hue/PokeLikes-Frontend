import type { OrderEventResource, OrderResource } from '@/lib/api/contracts';

export type OrderStatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

type OrderAudience = 'customer' | 'admin';

type OrderStatusView = {
  label: string;
  tone: OrderStatusTone;
  description: string;
};

type OrderEventView = {
  title: string;
  description: string;
  fromLabel: string | null;
  toLabel: string | null;
};

const ORDER_STATUS_VIEW: Record<OrderResource['status'], OrderStatusView> = {
  pending: {
    label: 'Aguardando envio',
    tone: 'warning',
    description: 'Seu pedido foi recebido e esta pronto para seguir para processamento.',
  },
  submitted: {
    label: 'Enviado ao fornecedor',
    tone: 'info',
    description: 'O pedido ja foi encaminhado para processamento.',
  },
  queued_supplier_balance: {
    label: 'Aguardando saldo do fornecedor',
    tone: 'warning',
    description: 'O pedido segue em espera operacional. Seu saldo continua reservado ate o fornecedor retomar o processamento.',
  },
  in_progress: {
    label: 'Em processamento',
    tone: 'warning',
    description: 'O fornecedor ja esta executando o pedido.',
  },
  completed: {
    label: 'Concluido',
    tone: 'success',
    description: 'O pedido foi concluido com sucesso.',
  },
  partial: {
    label: 'Parcial',
    tone: 'danger',
    description: 'O pedido foi entregue parcialmente e exige revisao operacional.',
  },
  canceled: {
    label: 'Cancelado',
    tone: 'danger',
    description: 'O pedido foi cancelado.',
  },
  failed: {
    label: 'Falhou',
    tone: 'danger',
    description: 'O pedido nao foi concluido e precisa de atencao.',
  },
};

const ORDER_EVENT_LABELS: Record<string, string> = {
  order_created: 'Pedido criado',
  order_submitted: 'Pedido enviado',
  order_synced: 'Pedido sincronizado',
  order_updated: 'Pedido atualizado',
  status_changed: 'Status atualizado',
  supplier_synced: 'Sincronizacao com fornecedor',
};

export function getOrderStatusView(status: OrderResource['status'] | string): OrderStatusView {
  if (status in ORDER_STATUS_VIEW) {
    return ORDER_STATUS_VIEW[status as OrderResource['status']];
  }

  return {
    label: humanizeToken(status),
    tone: 'neutral',
    description: 'Status operacional atualizado pelo backend.',
  };
}

export function getOrderEventView(event: OrderEventResource, audience: OrderAudience): OrderEventView {
  const fromLabel = event.fromStatus ? getOrderStatusView(event.fromStatus).label : null;
  const toLabel = event.toStatus ? getOrderStatusView(event.toStatus).label : null;

  if (event.toStatus === 'queued_supplier_balance') {
    return {
      title: audience === 'customer' ? 'Pedido em espera operacional' : 'Fornecedor sem saldo para seguir',
      description:
        audience === 'customer'
          ? 'O fornecedor esta sem saldo suficiente no momento. O pedido continua ativo e o valor do cliente segue reservado.'
          : 'O pedido entrou em espera por saldo insuficiente no fornecedor. O valor cobrado do cliente continua reservado ate nova tentativa.',
      fromLabel,
      toLabel,
    };
  }

  if (event.fromStatus === 'queued_supplier_balance' && event.toStatus === 'submitted') {
    return {
      title: audience === 'customer' ? 'Processamento retomado' : 'Pedido voltou para envio',
      description:
        audience === 'customer'
          ? 'O fornecedor recuperou condicao de processar o pedido e o fluxo foi retomado.'
          : 'Depois da espera por saldo do fornecedor, o pedido voltou para o fluxo normal de envio.',
      fromLabel,
      toLabel,
    };
  }

  if (event.toStatus) {
    return {
      title: toLabel ? `Status: ${toLabel}` : getOrderEventLabel(event.eventType),
      description:
        fromLabel && toLabel
          ? `Mudou de ${fromLabel} para ${toLabel}.`
          : toLabel
            ? `Status atualizado para ${toLabel}.`
            : 'Status atualizado pelo backend.',
      fromLabel,
      toLabel,
    };
  }

  return {
    title: getOrderEventLabel(event.eventType),
    description: audience === 'customer' ? 'Atualizacao registrada para este pedido.' : 'Evento operacional registrado para este pedido.',
    fromLabel,
    toLabel,
  };
}

export function sortOrderEvents(events: OrderEventResource[] | null | undefined): OrderEventResource[] {
  if (!events?.length) {
    return [];
  }

  return [...events].sort((left, right) => {
    const leftTime = Date.parse(left.createdAt);
    const rightTime = Date.parse(right.createdAt);

    if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
      return left.createdAt.localeCompare(right.createdAt);
    }

    return leftTime - rightTime;
  });
}

export function orderHasQueuedSupplierBalance(order: Pick<OrderResource, 'status' | 'events'>): boolean {
  if (order.status === 'queued_supplier_balance') {
    return true;
  }

  return sortOrderEvents(order.events).some(
    (event) => event.fromStatus === 'queued_supplier_balance' || event.toStatus === 'queued_supplier_balance',
  );
}

function getOrderEventLabel(eventType: string) {
  return ORDER_EVENT_LABELS[eventType] ?? humanizeToken(eventType);
}

function humanizeToken(value: string) {
  return value
    .split('_')
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}
