import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { getCatalogService } from '@/lib/api/catalog';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { updateCatalogServiceAction } from '@/modules/admin-shell/actions';
import { AdminCatalogMutationForm } from '@/modules/admin-shell/admin-catalog-mutation-form';

type AdminCatalogDetailPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  serviceId: string;
};

export async function AdminCatalogDetailPage({ session, serviceId }: AdminCatalogDetailPageProps) {
  void session;

  try {
    const service = await getCatalogService(serviceId);
    const returnTo = `/admin/catalog/${service.id}`;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / catalogo / detalhe"
          title={service.name}
          description="A pagina dedicada concentra a edicao do servico e deixa a listagem principal focada em leitura operacional."
          actions={
            <>
              <StatusBadge label={service.status} tone={service.status === 'active' ? 'success' : 'neutral'} />
              <StatusBadge
                label={service.availability.isPurchasable ? 'compravel' : 'indisponivel'}
                tone={service.availability.isPurchasable ? 'success' : 'danger'}
              />
              <Link href="/admin/catalog" className="secondary-action">
                Voltar ao catalogo
              </Link>
            </>
          }
        />

        <section className="detail-grid">
          <article className="detail-card">
            <h2>Resumo comercial</h2>
            <dl className="detail-list">
              <div>
                <dt>ID</dt>
                <dd className="code-block">{service.id}</dd>
              </div>
              <div>
                <dt>Preco publico</dt>
                <dd>{formatMoney(service.publicPrice)}</dd>
              </div>
              <div>
                <dt>Faixa</dt>
                <dd>
                  {service.minQuantity} - {service.maxQuantity}
                </dd>
              </div>
              <div>
                <dt>Sort order</dt>
                <dd>{service.sortOrder}</dd>
              </div>
              <div>
                <dt>Availability</dt>
                <dd>{service.availability.reason}</dd>
              </div>
              <div>
                <dt>Ultima checagem</dt>
                <dd>{formatDateTime(service.supplierService.providerStatus?.lastCheckedAt)}</dd>
              </div>
            </dl>
          </article>

          <article className="detail-card">
            <h2>Fornecedor</h2>
            <dl className="detail-list">
              <div>
                <dt>Fornecedor</dt>
                <dd>{service.supplierService.supplierName}</dd>
              </div>
              <div>
                <dt>Supplier service ID</dt>
                <dd>{service.supplierService.supplierServiceId}</dd>
              </div>
              <div>
                <dt>Status do provider</dt>
                <dd>{service.supplierService.providerStatus?.providerStatus || '-'}</dd>
              </div>
              <div>
                <dt>Ultimo erro</dt>
                <dd>{service.supplierService.providerStatus?.lastErrorMessage || '-'}</dd>
              </div>
            </dl>
          </article>

          <article className="detail-card detail-card-wide">
            <h2>Atualizar servico</h2>
            <p className="section-copy">A atualizacao usa o endpoint admin de PATCH e reaproveita o detalhe publico apenas como leitura base do recurso.</p>
            <AdminCatalogMutationForm mode="update" action={updateCatalogServiceAction} returnTo={returnTo} service={service} />
          </article>
        </section>
      </main>
    );
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound();
    }

    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar o detalhe do servico"
          description="A API nao retornou os dados esperados para este servico de catalogo."
        />
      </main>
    );
  }
}
