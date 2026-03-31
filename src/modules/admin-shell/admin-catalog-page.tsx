import { Fragment } from 'react';

import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listAdminCatalogServices, listSupplierServices } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatMoney } from '@/lib/format';
import { createCatalogServiceAction } from '@/modules/admin-shell/actions';
import { AdminCatalogMutationForm } from '@/modules/admin-shell/admin-catalog-mutation-form';
import {
  AdminFilterBar,
  AdminSummaryCard,
  PaginationSummary,
  buildPathWithSearch,
  mapCatalogStatusTone,
  mapProviderTone,
  renderCatalogAvailability,
  renderSupplierFlags,
} from '@/modules/admin-shell/shared';
import type { AdminCatalogCreationDraft, AdminCatalogListParams, SupplierServicesListParams } from '@/modules/admin-shell/query';

type AdminCatalogPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminCatalogListParams;
  supplierServiceFilters: SupplierServicesListParams;
  creationDraft?: AdminCatalogCreationDraft;
};

export async function AdminCatalogPage({
  session,
  filters,
  supplierServiceFilters,
  creationDraft,
}: AdminCatalogPageProps) {
  try {
    const [catalog, supplierServices] = await Promise.all([
      listAdminCatalogServices(session.accessToken, filters),
      listSupplierServices(session.accessToken, supplierServiceFilters),
    ]);

    const returnTo = buildPathWithSearch('/admin/catalog', {
      ...filters,
      servicesPage: supplierServiceFilters.page,
      servicesPageSize: supplierServiceFilters.pageSize,
      servicesSearch: supplierServiceFilters.search,
      servicesSupplierName: supplierServiceFilters.supplierName,
      servicesCategory: supplierServiceFilters.category,
      servicesType: supplierServiceFilters.type,
      isActiveAtSupplier: supplierServiceFilters.isActiveAtSupplier,
      ...buildDraftParams(creationDraft),
    });
    const activeCount = catalog.items.filter((service) => service.status === 'active').length;
    const purchasableCount = catalog.items.filter((service) => service.availability.isPurchasable).length;
    const degradedCount = catalog.items.filter(
      (service) => service.availability.providerStatus === 'degraded_low_balance' || service.availability.providerStatus === 'unavailable',
    ).length;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / catalogo"
          title="Catalogo"
          description="Selecione um servico sincronizado e publique a versao publica da plataforma."
          actions={
            <AdminFilterBar
              pathname="/admin/catalog"
              hiddenFields={buildSupplierFilterHiddenFields(supplierServiceFilters, creationDraft)}
              fields={[
                { name: 'search', label: 'Busca', type: 'search', placeholder: 'Servico ou descricao', defaultValue: filters.search },
                {
                  name: 'status',
                  label: 'Status',
                  type: 'select',
                  defaultValue: filters.status,
                  options: [
                    { label: 'Ativo', value: 'active' },
                    { label: 'Inativo', value: 'inactive' },
                  ],
                },
                { name: 'socialNetwork', label: 'Rede', placeholder: 'instagram', defaultValue: filters.socialNetwork },
                { name: 'category', label: 'Categoria', defaultValue: filters.category },
                { name: 'type', label: 'Tipo', defaultValue: filters.type },
                {
                  name: 'pageSize',
                  label: 'Pagina',
                  type: 'select',
                  defaultValue: filters.pageSize ?? 10,
                  options: [
                    { label: '10', value: '10' },
                    { label: '20', value: '20' },
                    { label: '50', value: '50' },
                  ],
                },
              ]}
            />
          }
        />

        <section className="metric-list">
          <AdminSummaryCard label="Servicos publicos" value={String(catalog.items.length)} meta={`${catalog.totalItems} cadastrados no total`} />
          <AdminSummaryCard label="Ativos" value={String(activeCount)} meta="Disponiveis para venda" tone="accent" />
          <AdminSummaryCard label="Compraveis" value={String(purchasableCount)} meta={`${degradedCount} com risco operacional`} tone="warning" />
        </section>

        <section className="detail-card detail-card-wide">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Catalogo sincronizado do fornecedor</p>
              <h2>Selecionar e publicar</h2>
            </div>
            <span className="panel-meta">{supplierServices.totalItems} servicos sincronizados</span>
          </div>
          <p className="section-copy">
            Escolha um servico sincronizado para publicar no catalogo publico. O formulario abaixo preenche automaticamente
            IDs, categoria, tipo e limites tecnicos.
          </p>

          <AdminFilterBar
            pathname="/admin/catalog"
            hiddenFields={buildCatalogFilterHiddenFields(filters, creationDraft)}
            fields={[
              {
                name: 'servicesSearch',
                label: 'Busca',
                type: 'search',
                placeholder: 'Servico sincronizado',
                defaultValue: supplierServiceFilters.search,
              },
              { name: 'servicesSupplierName', label: 'Fornecedor', defaultValue: supplierServiceFilters.supplierName },
              { name: 'servicesCategory', label: 'Categoria', defaultValue: supplierServiceFilters.category },
              { name: 'servicesType', label: 'Tipo', defaultValue: supplierServiceFilters.type },
              {
                name: 'isActiveAtSupplier',
                label: 'Ativo no fornecedor',
                type: 'select',
                defaultValue: supplierServiceFilters.isActiveAtSupplier,
                options: [
                  { label: 'Sim', value: 'true' },
                  { label: 'Nao', value: 'false' },
                ],
              },
              {
                name: 'servicesPageSize',
                label: 'Pagina',
                type: 'select',
                defaultValue: supplierServiceFilters.pageSize ?? 10,
                options: [
                  { label: '10', value: '10' },
                  { label: '20', value: '20' },
                  { label: '50', value: '50' },
                ],
              },
            ]}
          />

          {supplierServices.items.length === 0 ? (
            <EmptyState title="Nenhum servico sincronizado encontrado" description="Ajuste os filtros para encontrar um servico do fornecedor." />
          ) : (
            <>
              <DataTable columns={['Fornecedor / SID', 'Servico', 'Categoria / tipo', 'Rate', 'Faixa', 'Flags', 'Acao']}>
                {supplierServices.items.map((service) => {
                  const isSelected = creationDraft?.supplierServiceId === service.supplierServiceId;

                  return (
                    <tr key={service.id}>
                      <td>
                        <div className="stack-list">
                          <strong>{service.supplierName}</strong>
                          <span className="panel-meta">SID {service.supplierServiceId}</span>
                        </div>
                      </td>
                      <td>{service.name}</td>
                      <td>
                        <div className="stack-list">
                          <strong>{service.category}</strong>
                          <span className="panel-meta">{service.type}</span>
                        </div>
                      </td>
                      <td>{service.rate}</td>
                      <td>
                        {service.min} - {service.max}
                      </td>
                      <td>
                        <div className="stack-list">
                          <span>{renderSupplierFlags(service)}</span>
                          <StatusBadge label={service.isActiveAtSupplier ? 'ativo' : 'inativo'} tone={service.isActiveAtSupplier ? 'success' : 'neutral'} />
                        </div>
                      </td>
                      <td>
                        {isSelected ? (
                          <StatusBadge label="Selecionado" tone="info" />
                        ) : (
                          <Link href={buildCreateDraftPath(filters, supplierServiceFilters, service)} className="table-link">
                            Criar no catalogo
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </DataTable>
              <PaginationSummary
                page={supplierServices.page}
                pageSize={supplierServices.pageSize}
                totalItems={supplierServices.totalItems}
                totalPages={supplierServices.totalPages}
                pathname="/admin/catalog"
                params={{
                  search: filters.search,
                  status: filters.status,
                  socialNetwork: filters.socialNetwork,
                  category: filters.category,
                  type: filters.type,
                  pageSize: filters.pageSize,
                  ...buildDraftParams(creationDraft),
                  servicesPageSize: supplierServiceFilters.pageSize ?? supplierServices.pageSize,
                  servicesSearch: supplierServiceFilters.search,
                  servicesSupplierName: supplierServiceFilters.supplierName,
                  servicesCategory: supplierServiceFilters.category,
                  servicesType: supplierServiceFilters.type,
                  isActiveAtSupplier: supplierServiceFilters.isActiveAtSupplier,
                }}
                label="servicos sincronizados"
              />
            </>
          )}
        </section>

        <section className="feedback-panel" id="catalog-create-form">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Publicar no catalogo</p>
              <h2>{creationDraft ? 'Novo servico publico' : 'Selecione um servico sincronizado'}</h2>
            </div>
          </div>
          <p>
            {creationDraft
              ? 'Revise os dados publicos, ajuste preco e status e publique o servico.'
              : 'Use a lista acima para escolher um servico sincronizado do fornecedor antes de criar o item publico.'}
          </p>
          <AdminCatalogMutationForm
            mode="create"
            action={createCatalogServiceAction}
            returnTo={returnTo}
            creationDraft={creationDraft}
          />
        </section>

        {catalog.items.length === 0 ? (
          <EmptyState title="Nenhum servico publicado" description="Publique um servico sincronizado para ele aparecer no catalogo da plataforma." />
        ) : (
          <>
            <DataTable columns={['Servico', 'Preco publico', 'Status', 'Disponibilidade', 'Fornecedor', 'Faixa', 'Acoes']}>
              {catalog.items.map((service) => (
                <Fragment key={service.id}>
                  <tr>
                    <td>
                      <div className="stack-list">
                        <strong>{service.name}</strong>
                        <span className="panel-meta">
                          {service.socialNetwork} / {service.category} / {service.type}
                        </span>
                      </div>
                    </td>
                    <td>{formatMoney(service.publicPrice)}</td>
                    <td>
                      <StatusBadge label={service.status} tone={mapCatalogStatusTone(service.status)} />
                    </td>
                    <td>{renderCatalogAvailability(service)}</td>
                    <td>
                      <div className="stack-list">
                        <strong>{service.supplierService.supplierName}</strong>
                        <span className="panel-meta">SID {service.supplierService.supplierServiceId}</span>
                        {service.supplierService.providerStatus ? (
                          <StatusBadge
                            label={service.supplierService.providerStatus.providerStatus}
                            tone={mapProviderTone(service.supplierService.providerStatus.providerStatus)}
                          />
                        ) : null}
                      </div>
                    </td>
                    <td>
                      {service.minQuantity} - {service.maxQuantity}
                    </td>
                    <td>
                      <Link href={`/admin/catalog/${service.id}`} className="table-link">
                        Abrir detalhe
                      </Link>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </DataTable>

            <PaginationSummary
              page={catalog.page}
              pageSize={catalog.pageSize}
              totalItems={catalog.totalItems}
              totalPages={catalog.totalPages}
              pathname="/admin/catalog"
              params={{
                ...filters,
                servicesPage: supplierServiceFilters.page,
                servicesPageSize: supplierServiceFilters.pageSize,
                servicesSearch: supplierServiceFilters.search,
                servicesSupplierName: supplierServiceFilters.supplierName,
                servicesCategory: supplierServiceFilters.category,
                servicesType: supplierServiceFilters.type,
                isActiveAtSupplier: supplierServiceFilters.isActiveAtSupplier,
                ...buildDraftParams(creationDraft),
              }}
              label="servicos"
            />
          </>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar o catalogo admin"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar a lista do catalogo.'}
        />
      </main>
    );
  }
}

function buildCreateDraftPath(
  filters: AdminCatalogListParams,
  supplierServiceFilters: SupplierServicesListParams,
  service: {
    supplierServiceId: number;
    supplierName: string;
    name: string;
    category: string;
    type: string;
    min: number;
    max: number;
  },
) {
  return `${buildPathWithSearch('/admin/catalog', {
    ...filters,
    servicesPage: supplierServiceFilters.page,
    servicesPageSize: supplierServiceFilters.pageSize,
    servicesSearch: supplierServiceFilters.search,
    servicesSupplierName: supplierServiceFilters.supplierName,
    servicesCategory: supplierServiceFilters.category,
    servicesType: supplierServiceFilters.type,
    isActiveAtSupplier: supplierServiceFilters.isActiveAtSupplier,
    createSupplierServiceId: service.supplierServiceId,
    createSupplierName: service.supplierName,
    createName: service.name,
    createCategory: service.category,
    createType: service.type,
    createMinQuantity: service.min,
    createMaxQuantity: service.max,
  })}#catalog-create-form`;
}

function buildDraftParams(creationDraft?: AdminCatalogCreationDraft) {
  if (!creationDraft) {
    return {};
  }

  return {
    createSupplierServiceId: creationDraft.supplierServiceId,
    createSupplierName: creationDraft.supplierName,
    createName: creationDraft.name,
    createCategory: creationDraft.category,
    createType: creationDraft.type,
    createMinQuantity: creationDraft.minQuantity,
    createMaxQuantity: creationDraft.maxQuantity,
  };
}

function buildCatalogFilterHiddenFields(filters: AdminCatalogListParams, creationDraft?: AdminCatalogCreationDraft) {
  return [
    ...(filters.search ? [{ name: 'search', value: filters.search }] : []),
    ...(filters.status ? [{ name: 'status', value: filters.status }] : []),
    ...(filters.socialNetwork ? [{ name: 'socialNetwork', value: filters.socialNetwork }] : []),
    ...(filters.category ? [{ name: 'category', value: filters.category }] : []),
    ...(filters.type ? [{ name: 'type', value: filters.type }] : []),
    ...(filters.pageSize ? [{ name: 'pageSize', value: filters.pageSize }] : []),
    ...Object.entries(buildDraftParams(creationDraft)).map(([name, value]) => ({ name, value })),
  ];
}

function buildSupplierFilterHiddenFields(supplierServiceFilters: SupplierServicesListParams, creationDraft?: AdminCatalogCreationDraft) {
  return [
    ...(supplierServiceFilters.page ? [{ name: 'servicesPage', value: supplierServiceFilters.page }] : []),
    ...(supplierServiceFilters.pageSize ? [{ name: 'servicesPageSize', value: supplierServiceFilters.pageSize }] : []),
    ...(supplierServiceFilters.search ? [{ name: 'servicesSearch', value: supplierServiceFilters.search }] : []),
    ...(supplierServiceFilters.supplierName ? [{ name: 'servicesSupplierName', value: supplierServiceFilters.supplierName }] : []),
    ...(supplierServiceFilters.category ? [{ name: 'servicesCategory', value: supplierServiceFilters.category }] : []),
    ...(supplierServiceFilters.type ? [{ name: 'servicesType', value: supplierServiceFilters.type }] : []),
    ...(supplierServiceFilters.isActiveAtSupplier ? [{ name: 'isActiveAtSupplier', value: supplierServiceFilters.isActiveAtSupplier }] : []),
    ...Object.entries(buildDraftParams(creationDraft)).map(([name, value]) => ({ name, value })),
  ];
}
