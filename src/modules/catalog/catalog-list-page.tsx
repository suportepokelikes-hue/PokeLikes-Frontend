import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { appendAffiliateCodeToPath } from '@/lib/affiliate-code';
import { listCatalogServices, type CatalogListParams } from '@/lib/api/catalog';
import type { CatalogServiceResource } from '@/lib/api/contracts';
import { ApiClientError } from '@/lib/api/http';
import { formatMoney } from '@/lib/format';
import { getCatalogAvailabilityView } from './availability-view';
import { AffiliateCodeCapture } from './affiliate-code-capture';

type CatalogListPageProps = {
  searchParams: CatalogListParams & {
    aff?: string;
  };
};

export async function CatalogListPage({ searchParams }: CatalogListPageProps) {
  try {
    const { aff: affiliateCodeFromUrl, ...catalogFilters } = searchParams;
    const response = await listCatalogServices(catalogFilters);
    const purchasableCount = response.items.filter((service) => service.availability.isPurchasable).length;
    const degradedCount = response.items.filter(
      (service) => service.availability.isPurchasable && service.availability.providerStatus === 'degraded_low_balance',
    ).length;
    const blockedCount = response.items.filter(
      (service) => !service.availability.isPurchasable,
    ).length;

    return (
      <main className="page page-public">
        <AffiliateCodeCapture initialAffiliateCode={affiliateCodeFromUrl} />
        <PageHeader
          eyebrow="Catalogo"
          title="Catalogo"
          description="Leia a disponibilidade antes de abrir o checkout: compra liberada, compra com atencao ou compra pausada."
          actions={<CatalogFilterBar initialValues={catalogFilters} affiliateCodeFromUrl={affiliateCodeFromUrl} />}
        />

        <section className="catalog-overview-grid">
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
            actionHref="/catalog"
            actionLabel="Limpar filtros"
          />
        ) : (
          <>
            <section className="catalog-grid">
              {response.items.map((service) => (
                <CatalogCard key={service.id} service={service} affiliateCodeFromUrl={affiliateCodeFromUrl} />
              ))}
            </section>

            <section className="pagination-panel">
              <span>{`Pagina ${response.page} de ${response.totalPages} · ${response.totalItems} servicos`}</span>
            </section>
          </>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-public">
        <PageHeader eyebrow="Catalogo" title="Catalogo" />
        <ErrorState title="Nao foi possivel carregar o catalogo" description={getErrorMessage(error, 'Tente novamente em instantes.')} />
      </main>
    );
  }
}

function CatalogCard({ service, affiliateCodeFromUrl }: { service: CatalogServiceResource; affiliateCodeFromUrl?: string }) {
  const availabilityView = getCatalogAvailabilityView(service);
  const serviceSummary = summarizeCopy(service.description || availabilityView.cardDescription, 112);

  return (
    <Link
      href={appendAffiliateCodeToPath(`/catalog/${service.id}`, affiliateCodeFromUrl)}
      className={`catalog-card catalog-card-${availabilityView.state}`}
    >
      <div className="catalog-card-head">
        <div className="stack-list">
          <StatusBadge label={availabilityView.badgeLabel} tone={availabilityView.badgeTone} />
          <span className="catalog-meta">{service.socialNetwork} / {service.category}</span>
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

function CatalogFilterBar({
  initialValues,
  affiliateCodeFromUrl,
}: {
  initialValues: CatalogListParams;
  affiliateCodeFromUrl?: string;
}) {
  return (
    <form className="toolbar" action="/catalog">
      {affiliateCodeFromUrl ? <input type="hidden" name="aff" value={affiliateCodeFromUrl} /> : null}
      <input
        type="search"
        name="search"
        placeholder="Buscar servicos"
        defaultValue={initialValues.search}
        className="toolbar-input"
      />
      <input
        type="text"
        name="socialNetwork"
        placeholder="Rede social"
        defaultValue={initialValues.socialNetwork}
        className="toolbar-input"
      />
      <input type="text" name="category" placeholder="Categoria" defaultValue={initialValues.category} className="toolbar-input" />
      <input type="text" name="type" placeholder="Tipo" defaultValue={initialValues.type} className="toolbar-input" />
      <button type="submit" className="primary-action">
        Filtrar
      </button>
    </form>
  );
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
