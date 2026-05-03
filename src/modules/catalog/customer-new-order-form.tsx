'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { StatusBadge } from '@/components/ui/status-badge';
import { formatMoney } from '@/lib/format';
import { getCatalogAvailabilityView } from '@/modules/catalog/availability-view';
import { AffiliateCodeInput } from '@/modules/catalog/affiliate-code-input';
import { createOrderAction } from '@/modules/customer-transactions/actions';
import { initialTransactionFormState } from '@/modules/customer-transactions/types';
import type { Money } from '@/lib/api/contracts';

export type CustomerNewOrderService = {
  id: string;
  name: string;
  description: string | null;
  publicPrice: Money;
  status: string;
  socialNetwork: string;
  category: string;
  type: string;
  minQuantity: number;
  maxQuantity: number;
  availability: {
    providerStatus: 'unknown' | 'healthy' | 'degraded_low_balance' | 'unavailable';
    isPurchasable: boolean;
    reason: 'provider_status_unknown' | 'provider_healthy' | 'provider_low_balance' | 'provider_unavailable';
  };
};

type CustomerNewOrderFormProps = {
  services: CustomerNewOrderService[];
  affiliateCodeFromUrl?: string;
  returnTo: string;
};

export function CustomerNewOrderForm({
  services,
  affiliateCodeFromUrl,
  returnTo,
}: CustomerNewOrderFormProps) {
  const [state, formAction] = useActionState(createOrderAction, initialTransactionFormState);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(() => services[0]?.id ?? '');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');

  const categories = useMemo(
    () => Array.from(new Set(services.map((service) => service.category))).sort((left, right) => left.localeCompare(right)),
    [services],
  );

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      const matchesSearch =
        !normalizedSearch ||
        [
          service.name,
          service.description ?? '',
          service.category,
          service.socialNetwork,
          service.type,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory, services]);

  useEffect(() => {
    if (!filteredServices.some((service) => service.id === selectedServiceId)) {
      setSelectedServiceId(filteredServices[0]?.id ?? '');
    }
  }, [filteredServices, selectedServiceId]);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? filteredServices[0] ?? null,
    [filteredServices, selectedServiceId, services],
  );

  useEffect(() => {
    if (!selectedService) {
      setQuantity('');
      return;
    }

    setQuantity((current) => {
      const parsed = Number.parseInt(current, 10);

      if (!current || Number.isNaN(parsed) || parsed < selectedService.minQuantity || parsed > selectedService.maxQuantity) {
        return String(selectedService.minQuantity);
      }

      return current;
    });
  }, [selectedService]);

  const availabilityView = selectedService ? getCatalogAvailabilityView(selectedService) : null;
  const parsedQuantity = Number.parseInt(quantity, 10);
  const isQuantityValid =
    Boolean(selectedService) &&
    Number.isInteger(parsedQuantity) &&
    parsedQuantity >= selectedService.minQuantity &&
    parsedQuantity <= selectedService.maxQuantity;
  const estimatedAmount = selectedService ? buildEstimatedMoney(selectedService.publicPrice, parsedQuantity) : null;
  const isLinkValid = link.trim().length > 0;
  const isPurchasable = selectedService?.availability.isPurchasable ?? false;
  const canSubmit = Boolean(selectedService) && isLinkValid && isQuantityValid && isPurchasable;
  return (
    <div className="new-order-shell">
      <form action={formAction} className="new-order-form">
        <input type="hidden" name="returnTo" value={returnTo} />
        {selectedService ? <input type="hidden" name="catalogServiceId" value={selectedService.id} /> : null}

        <div className="new-order-main">
          <div className="new-order-filter-grid">
            <label className="auth-field">
              <span>Busca opcional</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder="Busque por nome, rede ou tipo"
                className="transaction-input"
              />
            </label>

            <label className="auth-field">
              <span>Categoria</span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.currentTarget.value)}
                className="transaction-input"
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="auth-field">
              <span>Servico</span>
              <select
                value={selectedService?.id ?? ''}
                onChange={(event) => setSelectedServiceId(event.currentTarget.value)}
                className="transaction-input"
                disabled={filteredServices.length === 0}
              >
                {filteredServices.length === 0 ? <option value="">Nenhum servico encontrado</option> : null}
                {filteredServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="new-order-description-card">
            <div className="new-order-description-head">
              <strong>Informacoes do produto</strong>
              {availabilityView ? <StatusBadge label={availabilityView.badgeLabel} tone={availabilityView.badgeTone} /> : null}
            </div>
            {selectedService ? (
              <dl className="new-order-product-grid">
                <div>
                  <dt>Nome</dt>
                  <dd>{selectedService.name}</dd>
                </div>
                <div>
                  <dt>Preco por 1000</dt>
                  <dd>{formatMoney(selectedService.publicPrice)}</dd>
                </div>
                <div>
                  <dt>Descricao</dt>
                  <dd>{selectedService.description?.trim() || availabilityView?.cardDescription || '-'}</dd>
                </div>
                <div>
                  <dt>Rede social</dt>
                  <dd>{selectedService.socialNetwork}</dd>
                </div>
              </dl>
            ) : (
              <p>Selecione um servico para ver os detalhes.</p>
            )}
          </div>

          <label className="auth-field">
            <span>Link do destino</span>
            <input
              name="link"
              type="url"
              required
              value={link}
              onChange={(event) => setLink(event.currentTarget.value)}
              placeholder="https://instagram.com/seu-perfil"
              className="transaction-input"
            />
          </label>

          <label className="auth-field">
            <span>Quantidade</span>
            <input
              name="quantity"
              type="number"
              required
              value={quantity}
              onChange={(event) => setQuantity(event.currentTarget.value)}
              min={selectedService?.minQuantity}
              max={selectedService?.maxQuantity}
              className="transaction-input"
              disabled={!selectedService}
            />
            {selectedService ? (
              <small>
                Use uma quantidade entre {selectedService.minQuantity} e {selectedService.maxQuantity}.
              </small>
            ) : null}
          </label>

          <div className="new-order-estimate-card">
            <span>Estimativa de valor</span>
            <strong>{estimatedAmount ? formatMoney(estimatedAmount) : '-'}</strong>
          </div>

          <AffiliateCodeInput initialAffiliateCode={affiliateCodeFromUrl} />

          {!selectedService ? (
            <div className="availability-callout availability-callout-info">
              <strong>Selecione um servico</strong>
              <p>Escolha uma categoria ou ajuste a busca para continuar.</p>
            </div>
          ) : null}

          {selectedService && !isPurchasable && availabilityView ? (
            <div className="availability-callout availability-callout-warning">
              <strong>{availabilityView.detailHeadline}</strong>
              <p>Este servico esta indisponivel agora. Escolha outra opcao para enviar o pedido.</p>
            </div>
          ) : null}

          {selectedService && !isQuantityValid ? (
            <div className="availability-callout availability-callout-warning">
              <strong>Quantidade fora da faixa</strong>
              <p>
                Ajuste a quantidade para um valor entre {selectedService.minQuantity} e {selectedService.maxQuantity}.
              </p>
            </div>
          ) : null}

          {state.status !== 'idle' ? (
            state.status === 'blocked' ? (
              <div className="auth-notice auth-notice-warning" role="alert" aria-live="polite">
                <strong>CPF/CNPJ necessario para concluir</strong>
                <p>{state.message}</p>
                {state.actionHref && state.actionLabel ? (
                  <a href={state.actionHref} className="secondary-action">
                    {state.actionLabel}
                  </a>
                ) : null}
              </div>
            ) : (
              <p className="auth-error" role="alert" aria-live="polite">
                {state.message ?? 'Nao foi possivel criar o pedido.'}
              </p>
            )
          ) : null}

          <SubmitButton disabled={!canSubmit} />
        </div>
      </form>
    </div>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="auth-submit" disabled={pending || disabled}>
      {pending ? 'Enviando...' : 'Enviar pedido'}
    </button>
  );
}

function buildEstimatedMoney(price: Money, quantity: number): Money | null {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return null;
  }

  const unitPrice = Number(price.amount);

  if (Number.isNaN(unitPrice)) {
    return null;
  }

  return {
    amount: ((unitPrice * quantity) / 1000).toFixed(2),
    currency: price.currency,
  };
}
