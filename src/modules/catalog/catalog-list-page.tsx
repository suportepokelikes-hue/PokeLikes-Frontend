import Link from 'next/link';
import { Search, ShoppingBag, Wallet } from 'lucide-react';

import { CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { appendAffiliateCodeToPath } from '@/lib/affiliate-code';
import { listCatalogServices, type CatalogListParams } from '@/lib/api/catalog';
import type { CatalogServiceResource } from '@/lib/api/contracts';
import { ApiClientError } from '@/lib/api/http';
import { getServerSession } from '@/lib/auth/cookies';
import { formatMoney } from '@/lib/format';
import { PublicShell } from '@/modules/app-shell/public-shell';
import { AffiliateCodeCapture } from './affiliate-code-capture';
import { AffiliateCodeNotice } from './affiliate-code-input';
import { getCatalogAvailabilityView } from './availability-view';

type CatalogListPageProps = {
  variant?: 'public' | 'customer';
  accessToken?: string;
  searchParams: CatalogListParams & {
    aff?: string;
  };
};

type CatalogListContentProps = {
  response: Awaited<ReturnType<typeof listCatalogServices>>;
  catalogFilters: CatalogListParams;
  affiliateCodeFromUrl?: string;
  listPath: string;
  detailBasePath: string;
  purchasableCount: number;
  degradedCount: number;
  blockedCount: number;
};

type CatalogFilterOptions = {
  socialNetworks: string[];
  categories: string[];
  types: string[];
};

export async function CatalogListPage({ variant = 'public', accessToken, searchParams }: CatalogListPageProps) {
  try {
    const { aff: affiliateCodeFromUrl, ...catalogFilters } = searchParams;
    const response = await listCatalogServices(catalogFilters, { accessToken });
    const listPath = variant === 'customer' ? '/app/services' : '/catalog';
    const detailBasePath = variant === 'customer' ? '/app/services' : '/catalog';
    const contentProps: CatalogListContentProps = {
      response,
      catalogFilters,
      affiliateCodeFromUrl,
      listPath,
      detailBasePath,
      purchasableCount: response.items.filter((service) => service.availability.isPurchasable).length,
      degradedCount: response.items.filter(
        (service) => service.availability.isPurchasable && service.availability.providerStatus === 'degraded_low_balance',
      ).length,
      blockedCount: response.items.filter((service) => !service.availability.isPurchasable).length,
    };
    const content =
      variant === 'customer' ? <CustomerCatalogListContent {...contentProps} /> : <PublicCatalogListContent {...contentProps} />;

    if (variant === 'public') {
      const session = await getServerSession();
      return <PublicShell session={session}>{content}</PublicShell>;
    }

    return content;
  } catch (error) {
    const errorContent = (
      <main className={variant === 'customer' ? 'page page-customer' : 'page page-public'}>
        <PageHeader eyebrow={variant === 'customer' ? 'Servicos' : 'Catalogo'} title={variant === 'customer' ? 'Servicos' : 'Catalogo'} />
        <ErrorState
          title={variant === 'customer' ? 'Nao foi possivel carregar os servicos' : 'Nao foi possivel carregar o catalogo'}
          description={getErrorMessage(error, 'Tente novamente em instantes.')}
        />
      </main>
    );

    if (variant === 'public') {
      const session = await getServerSession();
      return <PublicShell session={session}>{errorContent}</PublicShell>;
    }

    return errorContent;
  }
}

function PublicCatalogListContent({
  response,
  catalogFilters,
  affiliateCodeFromUrl,
  listPath,
  detailBasePath,
  purchasableCount,
  degradedCount,
  blockedCount,
}: CatalogListContentProps) {
  return (
    <main className="page page-public">
      <AffiliateCodeCapture initialAffiliateCode={affiliateCodeFromUrl} />
      <PageHeader
        eyebrow="Catalogo"
        title="Catalogo"
        actions={
          <CatalogFilterBar
            actionPath={listPath}
            initialValues={catalogFilters}
            affiliateCodeFromUrl={affiliateCodeFromUrl}
            options={buildFilterOptions(response.items, catalogFilters)}
          />
        }
      />
      <AffiliateCodeNotice initialAffiliateCode={affiliateCodeFromUrl} />

      <section className="catalog-overview-grid public-section">
        <article className="catalog-spotlight">
          <div className="catalog-spotlight-head">
            <span className="eyebrow">Resumo</span>
            <strong>{response.totalItems} servicos</strong>
          </div>
          <p>Preco, faixa e status na lista.</p>
          <div className="catalog-summary-strip">
            <div>
              <span>Compra liberada</span>
              <strong>{purchasableCount}</strong>
            </div>
            <div>
              <span>Com atencao</span>
              <strong>{degradedCount}</strong>
            </div>
            <div>
              <span>Pausados agora</span>
              <strong>{blockedCount}</strong>
            </div>
          </div>
        </article>

        <article className="public-note-card catalog-note-card">
          <strong>Como ler os status</strong>
          <div className="catalog-guidance-list">
            <p>
              <strong>Disponivel:</strong> compra liberada normalmente.
            </p>
            <p>
              <strong>Com atencao:</strong> o servico segue aberto, mas merece revisao antes do pedido.
            </p>
            <p>
              <strong>Compra pausada:</strong> o checkout foi bloqueado para evitar falha real.
            </p>
          </div>
        </article>
      </section>

      {response.items.length === 0 ? (
        <EmptyState
          title="Nenhum servico encontrado"
          description="Tente outra busca ou limpe os filtros para voltar ao catalogo completo."
          actionHref={appendAffiliateCodeToPath(listPath, affiliateCodeFromUrl)}
          actionLabel="Limpar filtros"
        />
      ) : (
        <>
          <section className="catalog-grid public-card-grid">
            {response.items.map((service) => (
              <CatalogCard
                key={service.id}
                service={service}
                affiliateCodeFromUrl={affiliateCodeFromUrl}
                detailHref={buildServiceDetailPath(detailBasePath, service.id)}
              />
            ))}
          </section>

          <section className="pagination-panel">
            <span>{`Pagina ${response.page} de ${response.totalPages} · ${response.totalItems} servicos`}</span>
          </section>
        </>
      )}
    </main>
  );
}

function CustomerCatalogListContent({
  response,
  catalogFilters,
  affiliateCodeFromUrl,
  listPath,
  detailBasePath,
}: CatalogListContentProps) {
  return (
    <main className="page page-customer">
      <AffiliateCodeCapture initialAffiliateCode={affiliateCodeFromUrl} />
      <PageHeader
        eyebrow="Servicos"
        title="Servicos"
        compact
        actions={
          <>
            <Link href="/app/orders" className="secondary-action">
              <ShoppingBag size={16} strokeWidth={2.15} aria-hidden="true" />
              Ver pedidos
            </Link>
            <Link href="/app/wallet" className="secondary-action">
              <Wallet size={16} strokeWidth={2.15} aria-hidden="true" />
              Ver carteira
            </Link>
          </>
        }
      />

      <CustomerSectionCard
        eyebrow="Checkout"
        title="Escolha um servico para criar seu pedido."
        meta={<span className="panel-meta">{response.totalItems} servico(s)</span>}
      >
        <div className="catalog-customer-intro">
          <p className="section-copy">Filtre por texto, rede social, categoria ou tipo para chegar mais rapido ao pedido certo.</p>
        </div>
        <CatalogFilterBar
          actionPath={listPath}
          initialValues={catalogFilters}
          affiliateCodeFromUrl={affiliateCodeFromUrl}
          options={buildFilterOptions(response.items, catalogFilters)}
          compact
        />
        <AffiliateCodeNotice initialAffiliateCode={affiliateCodeFromUrl} />
      </CustomerSectionCard>

      {response.items.length === 0 ? (
        <EmptyState
          title="Nenhum servico encontrado"
          description="Tente outra busca ou limpe os filtros para voltar a lista completa."
          actionHref={appendAffiliateCodeToPath(listPath, affiliateCodeFromUrl)}
          actionLabel="Limpar filtros"
        />
      ) : (
        <CustomerSectionCard
          title="Lista de servicos"
          meta={<span className="panel-meta">{`Pagina ${response.page} de ${response.totalPages}`}</span>}
        >
          <section className="catalog-service-list" aria-label="Lista de servicos">
            {response.items.map((service) => (
              <CatalogListItem
                key={service.id}
                service={service}
                affiliateCodeFromUrl={affiliateCodeFromUrl}
                detailHref={buildServiceDetailPath(detailBasePath, service.id)}
              />
            ))}
          </section>

          <section className="pagination-panel">
            <span>{`Pagina ${response.page} de ${response.totalPages} · ${response.totalItems} servicos`}</span>
          </section>
        </CustomerSectionCard>
      )}
    </main>
  );
}

function CatalogCard({
  service,
  affiliateCodeFromUrl,
  detailHref,
}: {
  service: CatalogServiceResource;
  affiliateCodeFromUrl?: string;
  detailHref: string;
}) {
  const availabilityView = getCatalogAvailabilityView(service);
  const serviceSummary = summarizeCopy(service.description || availabilityView.cardDescription, 112);

  return (
    <Link href={appendAffiliateCodeToPath(detailHref, affiliateCodeFromUrl)} className={`catalog-card catalog-card-${availabilityView.state}`}>
      <div className="catalog-card-head">
        <div className="stack-list">
          <StatusBadge label={availabilityView.badgeLabel} tone={availabilityView.badgeTone} />
          <span className="catalog-meta">
            {service.socialNetwork} / {service.category}
          </span>
        </div>
        <span className="catalog-meta">{service.type}</span>
      </div>

      <div className="catalog-card-body">
        <h2>{service.name}</h2>
        <p className="catalog-card-summary">{serviceSummary}</p>
        {availabilityView.hasInlineNotice ? (
          <div className={`catalog-card-note catalog-card-note-${availabilityView.badgeTone}`}>
            <strong>{availabilityView.cardHeadline}</strong>
            <p>{availabilityView.cardDescription}</p>
          </div>
        ) : null}
      </div>

      <dl className="catalog-stats">
        <div>
          <dt>Faixa</dt>
          <dd>
            {service.minQuantity} - {service.maxQuantity}
          </dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{availabilityView.badgeLabel}</dd>
        </div>
        <div>
          <dt>Compra</dt>
          <dd>{availabilityView.purchaseLabel}</dd>
        </div>
      </dl>

      <div className="catalog-card-foot">
        <strong className="catalog-card-price">{formatMoney(service.publicPrice)}</strong>
        <span className="panel-link">{availabilityView.cardCtaLabel}</span>
      </div>
    </Link>
  );
}

function CatalogListItem({
  service,
  affiliateCodeFromUrl,
  detailHref,
}: {
  service: CatalogServiceResource;
  affiliateCodeFromUrl?: string;
  detailHref: string;
}) {
  const availabilityView = getCatalogAvailabilityView(service);

  return (
    <article className={`catalog-list-item catalog-list-item-${availabilityView.state}`}>
      <div className="catalog-list-item-main">
        <div className="catalog-list-item-head">
          <div className="catalog-list-item-title">
            <h2>{service.name}</h2>
            <p>{summarizeCopy(service.description || availabilityView.cardDescription, 160)}</p>
          </div>
          <div className="catalog-list-item-status">
            <StatusBadge label={availabilityView.badgeLabel} tone={availabilityView.badgeTone} />
            <strong className="catalog-card-price">{formatMoney(service.publicPrice)}</strong>
          </div>
        </div>

        <dl className="catalog-list-item-meta">
          <div>
            <dt>Rede social</dt>
            <dd>{service.socialNetwork}</dd>
          </div>
          <div>
            <dt>Categoria</dt>
            <dd>{service.category}</dd>
          </div>
          <div>
            <dt>Tipo</dt>
            <dd>{service.type}</dd>
          </div>
          <div>
            <dt>Faixa</dt>
            <dd>
              {service.minQuantity} - {service.maxQuantity}
            </dd>
          </div>
          <div>
            <dt>Disponibilidade</dt>
            <dd>{availabilityView.purchaseLabel}</dd>
          </div>
        </dl>
      </div>

      <div className="catalog-list-item-actions">
        <Link href={appendAffiliateCodeToPath(detailHref, affiliateCodeFromUrl)} className="primary-action">
          <Search size={16} strokeWidth={2.15} aria-hidden="true" />
          Comprar
        </Link>
      </div>
    </article>
  );
}

function CatalogFilterBar({
  actionPath,
  initialValues,
  affiliateCodeFromUrl,
  options,
  compact = false,
}: {
  actionPath: string;
  initialValues: CatalogListParams;
  affiliateCodeFromUrl?: string;
  options: CatalogFilterOptions;
  compact?: boolean;
}) {
  return (
    <form className={`toolbar${compact ? ' toolbar-compact' : ''}`} action={actionPath}>
      {affiliateCodeFromUrl ? <input type="hidden" name="aff" value={affiliateCodeFromUrl} /> : null}
      <input
        type="search"
        name="search"
        placeholder="Buscar servicos"
        defaultValue={initialValues.search}
        className="toolbar-input toolbar-input-search"
      />
      <select name="socialNetwork" defaultValue={initialValues.socialNetwork || ''} className="toolbar-input">
        <option value="">Todas as redes</option>
        {options.socialNetworks.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <select name="category" defaultValue={initialValues.category || ''} className="toolbar-input">
        <option value="">Todas as categorias</option>
        {options.categories.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <select name="type" defaultValue={initialValues.type || ''} className="toolbar-input">
        <option value="">Todos os tipos</option>
        {options.types.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <button type="submit" className="primary-action">
        Filtrar
      </button>
      {(initialValues.search || initialValues.socialNetwork || initialValues.category || initialValues.type) && (
        <Link href={appendAffiliateCodeToPath(actionPath, affiliateCodeFromUrl)} className="secondary-action">
          Limpar
        </Link>
      )}
    </form>
  );
}

function buildFilterOptions(items: CatalogServiceResource[], filters: CatalogListParams): CatalogFilterOptions {
  return {
    socialNetworks: getUniqueFilterValues(items, 'socialNetwork', filters.socialNetwork),
    categories: getUniqueFilterValues(items, 'category', filters.category),
    types: getUniqueFilterValues(items, 'type', filters.type),
  };
}

function getUniqueFilterValues<T extends 'socialNetwork' | 'category' | 'type'>(
  items: CatalogServiceResource[],
  key: T,
  selectedValue?: string,
) {
  const values = new Set(items.map((item) => item[key]).filter(Boolean));

  if (selectedValue) {
    values.add(selectedValue);
  }

  return Array.from(values).sort((left, right) => left.localeCompare(right));
}

function buildServiceDetailPath(basePath: string, serviceId: string) {
  return `${basePath}/${serviceId}`;
}

function summarizeCopy(value: string, maxLength: number) {
  const compact = value.replace(/\s+/g, ' ').trim();

  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, Math.max(maxLength - 1, 1)).trimEnd()}...`;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiClientError) {
    return error.message || fallback;
  }

  return fallback;
}
