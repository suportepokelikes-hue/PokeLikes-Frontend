import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { getCatalogService } from '@/lib/api/catalog';
import { ApiClientError } from '@/lib/api/http';
import { formatDateTime, formatMoney } from '@/lib/format';

type CatalogDetailPageProps = {
  serviceId: string;
};

export async function CatalogDetailPage({ serviceId }: CatalogDetailPageProps) {
  try {
    const service = await getCatalogService(serviceId);

    return (
      <main className="page page-public">
        <PageHeader
          eyebrow="Detalhe do servico"
          title={service.name}
          description={service.description || 'Servico sem descricao detalhada publicada no contrato atual.'}
          actions={
            <div className="page-actions">
              <StatusBadge
                label={service.availability.providerStatus}
                tone={service.availability.isPurchasable ? 'success' : 'danger'}
              />
              <Link href="/catalog" className="secondary-action">
                Voltar ao catalogo
              </Link>
            </div>
          }
        />

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Resumo comercial</h2>
            <dl className="detail-list">
              <div>
                <dt>Preco publico</dt>
                <dd>{formatMoney(service.publicPrice)}</dd>
              </div>
              <div>
                <dt>Quantidade minima</dt>
                <dd>{service.minQuantity}</dd>
              </div>
              <div>
                <dt>Quantidade maxima</dt>
                <dd>{service.maxQuantity}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{service.status}</dd>
              </div>
            </dl>
          </article>

          <article className="detail-card">
            <h2>Availability operacional</h2>
            <dl className="detail-list">
              <div>
                <dt>Purchasable</dt>
                <dd>{service.availability.isPurchasable ? 'Sim' : 'Nao'}</dd>
              </div>
              <div>
                <dt>Provider status</dt>
                <dd>{service.availability.providerStatus}</dd>
              </div>
              <div>
                <dt>Reason</dt>
                <dd>{service.availability.reason}</dd>
              </div>
              <div>
                <dt>Ultima checagem</dt>
                <dd>{formatDateTime(service.supplierService.providerStatus?.lastCheckedAt)}</dd>
              </div>
            </dl>
          </article>

          <article className="detail-card detail-card-wide">
            <h2>Fornecedor</h2>
            <dl className="detail-list">
              <div>
                <dt>Nome</dt>
                <dd>{service.supplierService.supplierName}</dd>
              </div>
              <div>
                <dt>Supplier service ID</dt>
                <dd>{service.supplierService.supplierServiceId}</dd>
              </div>
              <div>
                <dt>Nome do servico no fornecedor</dt>
                <dd>{service.supplierService.name || '-'}</dd>
              </div>
              <div>
                <dt>Ultimo erro</dt>
                <dd>{service.supplierService.providerStatus?.lastErrorMessage || '-'}</dd>
              </div>
            </dl>
          </article>
        </section>
      </main>
    );
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound();
    }

    return (
      <main className="page page-public">
        <ErrorState
          title="Nao foi possivel carregar o servico"
          description="A API nao retornou os dados esperados para este item do catalogo."
        />
      </main>
    );
  }
}
