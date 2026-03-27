import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { listCatalogServices, type CatalogListParams } from '@/lib/api/catalog';
import type { CatalogServiceResource } from '@/lib/api/contracts';
import { ApiClientError } from '@/lib/api/http';
import { formatMoney } from '@/lib/format';

type CatalogListPageProps = {
  searchParams: CatalogListParams;
};

export async function CatalogListPage({ searchParams }: CatalogListPageProps) {
  try {
    const response = await listCatalogServices(searchParams);

    return (
      <main className="page page-public">
        <PageHeader
          eyebrow="Catalogo publico"
          title="Servicos reais disponiveis no backend."
          description="A listagem publica respeita o contrato da API e destaca availability, preco e limites sem recalculo local."
          actions={<CatalogFilterBar initialValues={searchParams} />}
        />

        {response.items.length === 0 ? (
          <EmptyState
            title="Nenhum servico encontrado"
            description="Ajuste a busca ou os filtros para explorar outros servicos do catalogo."
          />
        ) : (
          <>
            <section className="catalog-grid">
              {response.items.map((service) => (
                <CatalogCard key={service.id} service={service} />
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
        <PageHeader
          eyebrow="Catalogo publico"
          title="Servicos reais disponiveis no backend."
          description="A listagem publica respeita o contrato da API e destaca availability, preco e limites sem recalculo local."
        />
        <ErrorState
          title="Nao foi possivel carregar o catalogo"
          description={getErrorMessage(error, 'Verifique a disponibilidade da API do backend e tente novamente.')}
        />
      </main>
    );
  }
}

function CatalogCard({ service }: { service: CatalogServiceResource }) {
  return (
    <Link href={`/catalog/${service.id}`} className="catalog-card">
      <div className="catalog-card-head">
        <StatusBadge
          label={service.availability.isPurchasable ? 'Compravel' : 'Indisponivel'}
          tone={mapAvailabilityTone(service)}
        />
        <span className="catalog-meta">
          {service.socialNetwork} / {service.category} / {service.type}
        </span>
      </div>

      <div className="catalog-card-body">
        <h2>{service.name}</h2>
        <p>{service.description || 'Servico sem descricao publica informada no contrato atual.'}</p>
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
          <dt>Fornecedor</dt>
          <dd>{service.supplierService.supplierName}</dd>
        </div>
      </dl>
    </Link>
  );
}

function CatalogFilterBar({ initialValues }: { initialValues: CatalogListParams }) {
  return (
    <form className="toolbar" action="/catalog">
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
      <input
        type="text"
        name="category"
        placeholder="Categoria"
        defaultValue={initialValues.category}
        className="toolbar-input"
      />
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
