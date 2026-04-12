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
      (service) => service.availability.providerStatus === 'degraded_low_balance' || service.availability.providerStatus === 'unavailable',
    ).length;

    return (
      <main className="page page-public">
        <AffiliateCodeCapture initialAffiliateCode={affiliateCodeFromUrl} />
        <PageHeader
          eyebrow="Catalogo publico"
          title="Servicos disponiveis"
          description="Explore os servicos disponiveis e filtre o que voce precisa."
          actions={<CatalogFilterBar initialValues={catalogFilters} affiliateCodeFromUrl={affiliateCodeFromUrl} />}
        />

        <section className="catalog-overview-grid">
          <article className="catalog-spotlight">
            <div className="catalog-spotlight-head">
              <span className="eyebrow">Catalogo</span>
              <strong>{response.totalItems} servicos publicados</strong>
            </div>
            <p>Veja o que esta disponivel, o que precisa de atencao e em qual pagina voce esta.</p>
            <div className="catalog-summary-strip">
              <div>
                <span>Compraveis agora</span>
                <strong>{purchasableCount}</strong>
              </div>
              <div>
                <span>Com atencao</span>
                <strong>{degradedCount}</strong>
              </div>
              <div>
                <span>Pagina atual</span>
                <strong>
                  {response.page} / {response.totalPages}
                </strong>
              </div>
            </div>
          </article>

          <article className="public-note-card catalog-note-card">
            <strong>Antes de comprar</strong>
            <p>Confira disponibilidade, faixa minima e maxima e status do servico.</p>
          </article>
        </section>

        <section className="public-bento">
          <article className="public-bento-card">
            <span>Itens na pagina</span>
            <strong>{response.items.length}</strong>
            <p>{response.totalItems} servicos no total.</p>
          </article>
          <article className="public-bento-card">
            <span>Compraveis</span>
            <strong>{purchasableCount}</strong>
            <p>Servicos prontos para checkout.</p>
          </article>
          <article className="public-bento-card">
            <span>Com atencao</span>
            <strong>{degradedCount}</strong>
            <p>Itens degradados ou indisponiveis nesta pagina.</p>
          </article>
        </section>

        {response.items.length === 0 ? (
          <EmptyState title="Nenhum servico encontrado" description="Ajuste a busca ou os filtros para explorar outros servicos." />
        ) : (
          <>
            <section className="catalog-grid">
              {response.items.map((service) => (
                <CatalogCard key={service.id} service={service} affiliateCodeFromUrl={affiliateCodeFromUrl} />
              ))}
            </section>

            <section className="pagination-panel">
              <span>
                Pagina {response.page} de {response.totalPages} · {response.totalItems} servicos
              </span>
            </section>
          </>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-public">
        <PageHeader eyebrow="Catalogo publico" title="Servicos disponiveis" description="Veja preco, disponibilidade e filtros do catalogo." />
        <ErrorState title="Nao foi possivel carregar o catalogo" description={getErrorMessage(error, 'Tente novamente em instantes.')} />
      </main>
    );
  }
}

function CatalogCard({ service, affiliateCodeFromUrl }: { service: CatalogServiceResource; affiliateCodeFromUrl?: string }) {
  return (
    <Link href={appendAffiliateCodeToPath(`/catalog/${service.id}`, affiliateCodeFromUrl)} className="catalog-card">
      <div className="catalog-card-head">
        <div className="stack-list">
          <StatusBadge
            label={service.availability.isPurchasable ? 'Compravel' : 'Indisponivel'}
            tone={mapAvailabilityTone(service)}
          />
          <span className="catalog-meta">
            {service.socialNetwork} / {service.category} / {service.type}
          </span>
        </div>
        <span className="catalog-meta">{service.supplierService.supplierName}</span>
      </div>

      <div className="catalog-card-body">
        <h2>{service.name}</h2>
        <p>{service.description || 'Servico sem descricao publicada.'}</p>
      </div>

      <div className="catalog-card-foot">
        <StatusBadge label={service.availability.providerStatus} tone={mapAvailabilityTone(service)} />
        <span className="panel-link">Abrir detalhe</span>
      </div>

      <dl className="catalog-stats">
        <div>
          <dt>Preco</dt>
          <dd>{formatMoney(service.publicPrice)}</dd>
        </div>
        <div>
          <dt>Min / Max</dt>
          <dd>
            {service.minQuantity} / {service.maxQuantity}
          </dd>
        </div>
        <div>
          <dt>Motivo</dt>
          <dd>{service.availability.reason}</dd>
        </div>
      </dl>
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

function mapAvailabilityTone(service: CatalogServiceResource) {
  if (!service.availability.isPurchasable) {
    return 'danger';
  }

  if (service.availability.providerStatus === 'degraded_low_balance') {
    return 'warning';
  }

  return 'success';
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiClientError) {
    return error.message || fallback;
  }

  return fallback;
}
