import type { CatalogAvailabilityResource, CatalogServiceResource } from '@/lib/api/contracts';

type AvailabilityTone = 'success' | 'warning' | 'danger' | 'info';

export type CatalogAvailabilityView = {
  badgeTone: AvailabilityTone;
  badgeLabel: string;
  purchaseLabel: string;
  cardHeadline: string;
  cardDescription: string;
  detailHeadline: string;
  detailDescription: string;
  nextStep: string;
  cardCtaLabel: string;
  hasInlineNotice: boolean;
  state: 'healthy' | 'degraded' | 'blocked';
};

export function getCatalogAvailabilityView(service: Pick<CatalogServiceResource, 'availability'>): CatalogAvailabilityView {
  const availability = service.availability;

  if (!availability.isPurchasable) {
    return getBlockedAvailabilityView(availability);
  }

  if (availability.providerStatus === 'degraded_low_balance') {
    return {
      badgeTone: 'warning',
      badgeLabel: 'Com atencao',
      purchaseLabel: 'Liberada com atencao',
      cardHeadline: 'Compra aberta com operacao reduzida',
      cardDescription: 'O pedido ainda pode seguir, mas o servico merece revisao antes da compra.',
      detailHeadline: 'Compra liberada com atencao',
      detailDescription:
        'Este servico continua disponivel, mas o fornecedor esta operando com menos folga agora. O pedido pode oscilar ou levar mais tempo que o normal.',
      nextStep: 'Se essa pequena oscilacao fizer sentido para voce, revise a quantidade e siga para o checkout.',
      cardCtaLabel: 'Revisar antes de comprar',
      hasInlineNotice: true,
      state: 'degraded',
    };
  }

  return {
    badgeTone: 'success',
    badgeLabel: 'Disponivel',
    purchaseLabel: 'Liberada',
    cardHeadline: 'Compra liberada agora',
    cardDescription: '',
    detailHeadline: 'Compra liberada agora',
    detailDescription: 'O sistema confirmou que este servico pode receber novos pedidos neste momento.',
    nextStep: 'Se o servico fizer sentido para voce, basta informar a quantidade e concluir o pedido.',
    cardCtaLabel: 'Ver servico',
    hasInlineNotice: false,
    state: 'healthy',
  };
}

export function getCatalogAlternativePath(
  service: Pick<CatalogServiceResource, 'socialNetwork' | 'category'>,
  basePath = '/catalog',
) {
  const searchParams = new URLSearchParams();

  if (service.socialNetwork) {
    searchParams.set('socialNetwork', service.socialNetwork);
  }

  if (service.category) {
    searchParams.set('category', service.category);
  }

  const query = searchParams.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function getBlockedAvailabilityView(availability: CatalogAvailabilityResource): CatalogAvailabilityView {
  if (availability.reason === 'provider_low_balance') {
    return {
      badgeTone: 'warning',
      badgeLabel: 'Compra pausada',
      purchaseLabel: 'Pausada agora',
      cardHeadline: 'Compra pausada para evitar falha',
      cardDescription: 'O servico foi temporariamente travado porque o fornecedor esta operando com pouca folga.',
      detailHeadline: 'Compra pausada para evitar falha',
      detailDescription:
        'O fornecedor deste servico esta com operacao reduzida agora. Para evitar pedido preso ou tentativa frustrada, o checkout foi bloqueado de forma deliberada.',
      nextStep: 'Voce pode voltar ao catalogo e procurar outra opcao enquanto este servico segue pausado.',
      cardCtaLabel: 'Ver alternativas',
      hasInlineNotice: true,
      state: 'blocked',
    };
  }

  if (availability.reason === 'provider_status_unknown') {
    return {
      badgeTone: 'info',
      badgeLabel: 'Verificando',
      purchaseLabel: 'Aguardando checagem',
      cardHeadline: 'Compra aguardando nova checagem',
      cardDescription: 'Ainda nao ha confirmacao suficiente para liberar este servico com seguranca.',
      detailHeadline: 'Compra aguardando nova checagem',
      detailDescription:
        'O sistema ainda esta validando a disponibilidade deste servico. Enquanto essa confirmacao nao chega, novas compras ficam pausadas para evitar um fluxo quebrado.',
      nextStep: 'Por enquanto, o melhor caminho e procurar outro servico no catalogo.',
      cardCtaLabel: 'Ver alternativas',
      hasInlineNotice: true,
      state: 'blocked',
    };
  }

  return {
    badgeTone: 'danger',
    badgeLabel: 'Indisponivel',
    purchaseLabel: 'Bloqueada agora',
    cardHeadline: 'Compra bloqueada neste momento',
    cardDescription: 'O fornecedor deste servico esta indisponivel agora, entao novas compras foram interrompidas.',
    detailHeadline: 'Compra bloqueada neste momento',
    detailDescription:
      'Este servico saiu do checkout agora porque o fornecedor nao esta respondendo como deveria. O bloqueio evita que voce siga para uma compra sem confirmacao real.',
    nextStep: 'Volte ao catalogo para buscar outra opcao enquanto este servico permanece indisponivel.',
    cardCtaLabel: 'Ver alternativas',
    hasInlineNotice: true,
    state: 'blocked',
  };
}
