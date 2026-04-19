import { Fragment } from 'react';

import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { AdminSectionCard } from '@/components/ui/admin-surfaces';
import {
  listAdminCatalogAffiliateSettings,
  listAdminCatalogServices,
  listSupplierProviders,
  listSupplierServices,
} from '@/lib/api/admin';
import type { AdminCatalogAffiliateSettingsResource, CatalogServiceResource } from '@/lib/api/contracts';
import { getCatalogService } from '@/lib/api/catalog';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import {
  createCatalogServiceAction,
  updateCatalogAffiliateSettingsAction,
  updateCatalogServiceAction,
} from '@/modules/admin-shell/actions';
import { AdminCatalogAffiliateSettingsForm } from '@/modules/admin-shell/admin-catalog-affiliate-settings-form';
import { AdminCatalogMutationForm } from '@/modules/admin-shell/admin-catalog-mutation-form';
import { AdminSlideOver } from '@/modules/admin-shell/admin-slide-over';
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
  createSupplierServiceId?: number;
  activeServiceId?: string;
  activeAffiliateServiceId?: string;
};

export async function AdminCatalogPage({
  session,
  filters,
  supplierServiceFilters,
  creationDraft,
  createSupplierServiceId,
  activeServiceId,
  activeAffiliateServiceId,
}: AdminCatalogPageProps) {
  try {
    const [catalog, providerStatuses, supplierServices] = await Promise.all([
      listAdminCatalogServices(session.accessToken, filters),
      listSupplierProviders(session.accessToken),
      listSupplierServices(session.accessToken, supplierServiceFilters),
    ]);

    const currentCatalogPage = filters.page ?? catalog.page;
    const currentCatalogPageSize = filters.pageSize ?? catalog.pageSize;
    const currentServicesPage = supplierServiceFilters.page ?? supplierServices.page;
    const currentServicesPageSize = supplierServiceFilters.pageSize ?? supplierServices.pageSize;
    const returnTo = buildPathWithSearch('/admin/catalog', {
      search: filters.search,
      page: currentCatalogPage,
      pageSize: currentCatalogPageSize,
      servicesPage: currentServicesPage,
      servicesPageSize: currentServicesPageSize,
      supplierName: supplierServiceFilters.supplierName,
    });
    const providerOptions = providerStatuses.items
      .map((provider) => provider.supplierName)
      .filter((name, index, items) => items.indexOf(name) === index)
      .sort((left, right) => left.localeCompare(right, 'pt-BR'));
    const selectedSupplierName = supplierServiceFilters.supplierName;
    const resolvedCreationDraft = creationDraft ?? resolveCatalogCreationDraft(createSupplierServiceId, supplierServices.items);
    const creationDraftError =
      createSupplierServiceId && !resolvedCreationDraft
        ? 'Nao foi possivel reencontrar o servico sincronizado selecionado para publicar no catalogo.'
        : null;

    const targetAffiliateServiceIds = Array.from(
      new Set(
        [...catalog.items.map((service) => service.id), activeServiceId, activeAffiliateServiceId].filter(
          (value): value is string => Boolean(value),
        ),
      ),
    );

    let affiliateSettingsByServiceId = new Map<string, AdminCatalogAffiliateSettingsResource>();
    let affiliateSettingsError: string | null = null;

    try {
      affiliateSettingsByServiceId = await loadCatalogAffiliateSettingsByServiceId(
        session.accessToken,
        targetAffiliateServiceIds,
        filters.search,
        currentCatalogPage,
        currentCatalogPageSize,
      );
    } catch (error) {
      affiliateSettingsError =
        error instanceof ApiClientError ? error.message : 'Nao foi possivel carregar a leitura de afiliacao do catalogo.';
    }

    let activeService: CatalogServiceResource | null = null;
    let activeServiceError: string | null = null;

    if (activeServiceId) {
      try {
        activeService = await resolveCatalogServiceForDrawer(activeServiceId, catalog.items);
      } catch (error) {
        activeServiceError = error instanceof ApiClientError ? error.message : 'Nao foi possivel carregar este servico.';
      }
    }

    let activeAffiliateService: CatalogServiceResource | null = null;
    let activeAffiliateServiceError: string | null = null;

    if (activeAffiliateServiceId) {
      try {
        activeAffiliateService =
          activeService?.id === activeAffiliateServiceId
            ? activeService
            : await resolveCatalogServiceForDrawer(activeAffiliateServiceId, catalog.items);
      } catch (error) {
        activeAffiliateServiceError =
          error instanceof ApiClientError ? error.message : 'Nao foi possivel carregar este servico para configurar afiliacao.';
      }
    }

    const visibleCatalogItems = selectedSupplierName
      ? catalog.items.filter((service) => service.supplierService.supplierName === selectedSupplierName)
      : catalog.items;
    const activeCount = visibleCatalogItems.filter((service) => service.status === 'active').length;
    const purchasableCount = visibleCatalogItems.filter((service) => service.availability.isPurchasable).length;
    const degradedCount = visibleCatalogItems.filter(
      (service) => service.availability.providerStatus === 'degraded_low_balance' || service.availability.providerStatus === 'unavailable',
    ).length;
    const affiliateEnabledCount = visibleCatalogItems.filter(
      (service) => affiliateSettingsByServiceId.get(service.id)?.affiliateEnabled,
    ).length;
    const activeAffiliateSettings = activeAffiliateServiceId ? affiliateSettingsByServiceId.get(activeAffiliateServiceId) : undefined;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / catalogo"
          title="Catalogo"
          description="Hierarquia entre sincronizado, publicado e afiliacao com foco em leitura e acao."
          actions={
            <AdminFilterBar
              pathname="/admin/catalog"
              hiddenFields={buildSharedCatalogHiddenFields(filters, supplierServiceFilters, createSupplierServiceId)}
              fields={[
                { name: 'search', label: 'Busca', type: 'search', placeholder: 'Busque por nome, descricao ou termo relevante', defaultValue: filters.search },
                {
                  name: 'supplierName',
                  label: 'Fornecedor',
                  type: 'select',
                  defaultValue: supplierServiceFilters.supplierName,
                  options: providerOptions.map((supplierName) => ({ label: supplierName, value: supplierName })),
                },
              ]}
            />
          }
        />

        <section className="metric-list">
          <AdminSummaryCard
            label="Servicos publicos"
            value={String(visibleCatalogItems.length)}
            meta={selectedSupplierName ? selectedSupplierName : `${catalog.totalItems} no total`}
          />
          <AdminSummaryCard label="Ativos" value={String(activeCount)} tone="accent" />
          <AdminSummaryCard label="Compraveis" value={String(purchasableCount)} meta={`${degradedCount} com risco`} tone="warning" />
          <AdminSummaryCard label="Afiliaveis" value={String(affiliateEnabledCount)} meta="Na pagina" />
        </section>

        <AdminSectionCard
          eyebrow="Catalogo sincronizado do fornecedor"
          title="Sincronizados"
          description="Base herdada do fornecedor para criar novos servicos publicos."
          meta={<span className="panel-meta">{supplierServices.totalItems} itens</span>}
          className="detail-card-wide"
        >
          {supplierServices.items.length === 0 ? (
            <EmptyState title="Nenhum servico sincronizado encontrado" description="Ajuste os filtros." />
          ) : (
            <>
              <DataTable columns={['Fornecedor / SID', 'Servico', 'Categoria / tipo', 'Rate', 'Faixa', 'Flags', 'Acao']}>
                {supplierServices.items.map((service) => {
                  const isSelected = creationDraft?.supplierServiceId === service.supplierServiceId;
                  const isActiveCreateTarget = resolvedCreationDraft?.supplierServiceId === service.supplierServiceId;

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
                        {isSelected || isActiveCreateTarget ? (
                          <StatusBadge label="Selecionado" tone="info" />
                        ) : (
                          <Link href={buildCreateDraftPath(filters, supplierServiceFilters, service, currentCatalogPage, currentCatalogPageSize)} className="table-link">
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
                  page: currentCatalogPage,
                  pageSize: currentCatalogPageSize,
                  supplierName: supplierServiceFilters.supplierName,
                  ...buildDraftParams(resolvedCreationDraft),
                  servicesPageSize: currentServicesPageSize,
                }}
                label="servicos sincronizados"
              />
            </>
          )}
        </AdminSectionCard>

        {affiliateSettingsError ? (
          <section className="feedback-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Afiliados no catalogo</p>
                <h2>Leitura indisponivel</h2>
              </div>
            </div>
            <p>{affiliateSettingsError}</p>
          </section>
        ) : null}

        {visibleCatalogItems.length === 0 ? (
          <EmptyState title="Nenhum servico publicado" description="Publique um servico sincronizado." />
        ) : (
          <>
            <AdminSectionCard
              eyebrow="Catalogo publicado"
              title="Servicos publicos"
              description="Disponibilidade, afiliacao e origem do fornecedor no mesmo bloco."
              meta={<span className="panel-meta">{catalog.totalItems} itens</span>}
            >
              <DataTable columns={['Servico', 'Preco publico', 'Status', 'Disponibilidade', 'Afiliados', 'Fornecedor', 'Faixa', 'Acoes']}>
                {visibleCatalogItems.map((service) => {
                  const affiliateSettings = affiliateSettingsByServiceId.get(service.id);

                  return (
                    <Fragment key={service.id}>
                      <tr>
                        <td>
                          <div className="stack-list">
                            <strong>{service.name}</strong>
                            <span className="panel-meta">
                              {service.socialNetwork} / {service.category} / {service.type}
                            </span>
                            <span className="panel-meta">ID {service.id}</span>
                          </div>
                        </td>
                        <td>{formatMoney(service.publicPrice)}</td>
                        <td>
                          <StatusBadge label={service.status} tone={mapCatalogStatusTone(service.status)} />
                        </td>
                        <td>{renderCatalogAvailability(service)}</td>
                        <td>{renderCatalogAffiliateState(affiliateSettings, affiliateSettingsError)}</td>
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
                          <div className="stack-list">
                            <Link
                              href={buildCatalogEditPath(filters, supplierServiceFilters, service.id, currentCatalogPage, currentCatalogPageSize)}
                              className="table-link"
                            >
                              Editar servico
                            </Link>
                            <Link
                              href={buildCatalogAffiliateEditPath(filters, supplierServiceFilters, service.id, currentCatalogPage, currentCatalogPageSize)}
                              className="table-link"
                            >
                              Editar afiliacao
                            </Link>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </DataTable>

              <PaginationSummary
                page={catalog.page}
                pageSize={catalog.pageSize}
                totalItems={catalog.totalItems}
                totalPages={catalog.totalPages}
                pathname="/admin/catalog"
                params={{
                  search: filters.search,
                  pageSize: currentCatalogPageSize,
                  supplierName: supplierServiceFilters.supplierName,
                  servicesPage: currentServicesPage,
                  servicesPageSize: currentServicesPageSize,
                  ...buildDraftParams(creationDraft),
                }}
                label="servicos"
              />
            </AdminSectionCard>
          </>
        )}

        {resolvedCreationDraft ? (
          <AdminSlideOver
            eyebrow="Publicar no catalogo"
            title="Novo servico publico"
            closeHref={returnTo}
          >
            <AdminCatalogMutationForm
              mode="create"
              action={createCatalogServiceAction}
              returnTo={returnTo}
              creationDraft={resolvedCreationDraft}
            />
          </AdminSlideOver>
        ) : creationDraftError ? (
          <AdminSlideOver eyebrow="Publicar no catalogo" title="Servico sincronizado indisponivel" description={creationDraftError} closeHref={returnTo}>
            <ErrorState title="Nao foi possivel abrir este servico" description="Feche o painel e tente novamente a partir da lista sincronizada." />
          </AdminSlideOver>
        ) : null}

        {activeService ? (
          <AdminSlideOver
            eyebrow="Catalogo publicado"
            title={activeService.name}
            closeHref={returnTo}
          >
            <section className="admin-drawer-stack">
              <article className="admin-inline-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Editar servico</p>
                    <h3>Dados publicos</h3>
                  </div>
                  <div className="feedback-actions">
                    <StatusBadge label={activeService.status} tone={mapCatalogStatusTone(activeService.status)} />
                    <StatusBadge
                      label={activeService.availability.isPurchasable ? 'compravel' : 'indisponivel'}
                      tone={activeService.availability.isPurchasable ? 'success' : 'danger'}
                    />
                  </div>
                </div>
                <AdminCatalogMutationForm mode="update" action={updateCatalogServiceAction} returnTo={returnTo} service={activeService} />
              </article>
            </section>
          </AdminSlideOver>
        ) : activeServiceError ? (
          <AdminSlideOver eyebrow="Catalogo publicado" title="Servico indisponivel" description={activeServiceError} closeHref={returnTo}>
            <ErrorState title="Nao foi possivel abrir este servico" description="Feche o painel e tente novamente pela listagem." />
          </AdminSlideOver>
        ) : null}

        {activeAffiliateService ? (
          <AdminSlideOver
            eyebrow="Catalogo / afiliados"
            title={activeAffiliateService.name}
            closeHref={returnTo}
          >
            <section className="admin-drawer-stack">
              <article className="admin-inline-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Afiliacao do servico</p>
                    <h3>Configuracao operacional</h3>
                  </div>
                  <div className="feedback-actions">
                    <StatusBadge
                      label={activeAffiliateSettings?.affiliateEnabled ? 'habilitado' : activeAffiliateSettings ? 'desligado' : 'sem leitura'}
                      tone={activeAffiliateSettings?.affiliateEnabled ? 'success' : activeAffiliateSettings ? 'neutral' : 'warning'}
                    />
                    <StatusBadge
                      label={
                        activeAffiliateSettings?.affiliateEnabled && activeAffiliateSettings.affiliateCommissionPercent
                          ? formatAffiliateCommissionPercent(activeAffiliateSettings.affiliateCommissionPercent)
                          : 'sem percentual ativo'
                      }
                      tone={activeAffiliateSettings?.affiliateEnabled ? 'info' : 'neutral'}
                    />
                  </div>
                </div>
                <p className="section-copy">
                  {activeAffiliateSettings
                    ? `Atualizado em ${formatDateTime(activeAffiliateSettings.updatedAt)}.`
                    : affiliateSettingsError
                      ? affiliateSettingsError
                      : 'Sem leitura previa.'}
                </p>
                <AdminCatalogAffiliateSettingsForm
                  action={updateCatalogAffiliateSettingsAction}
                  returnTo={returnTo}
                  service={activeAffiliateService}
                  settings={activeAffiliateSettings}
                />
              </article>
            </section>
          </AdminSlideOver>
        ) : activeAffiliateServiceError ? (
          <AdminSlideOver eyebrow="Catalogo / afiliados" title="Servico indisponivel" description={activeAffiliateServiceError} closeHref={returnTo}>
            <ErrorState title="Nao foi possivel abrir a afiliacao deste servico" description="Feche o painel e tente novamente pela listagem." />
          </AdminSlideOver>
        ) : null}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState title="Nao foi possivel carregar o catalogo admin" description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar a lista do catalogo.'} />
      </main>
    );
  }
}

async function resolveCatalogServiceForDrawer(serviceId: string, currentItems: CatalogServiceResource[]) {
  const cachedService = currentItems.find((service) => service.id === serviceId);

  if (cachedService) {
    return cachedService;
  }

  return getCatalogService(serviceId);
}

async function loadCatalogAffiliateSettingsByServiceId(
  accessToken: string,
  serviceIds: string[],
  search?: string,
  preferredPage = 1,
  preferredPageSize = 10,
) {
  const remaining = new Set(serviceIds);
  const settingsByServiceId = new Map<string, AdminCatalogAffiliateSettingsResource>();

  if (remaining.size === 0) {
    return settingsByServiceId;
  }

  const pageSize = Math.max(preferredPageSize, remaining.size, 25);
  const firstPage = Math.max(preferredPage, 1);
  const firstResponse = await listAdminCatalogAffiliateSettings(accessToken, {
    search,
    page: firstPage,
    pageSize,
  });

  collectCatalogAffiliateSettings(firstResponse.items, remaining, settingsByServiceId);

  for (let page = 1; page <= firstResponse.totalPages && remaining.size > 0; page += 1) {
    if (page === firstPage) {
      continue;
    }

    const response = await listAdminCatalogAffiliateSettings(accessToken, {
      search,
      page,
      pageSize,
    });

    collectCatalogAffiliateSettings(response.items, remaining, settingsByServiceId);
  }

  return settingsByServiceId;
}

function collectCatalogAffiliateSettings(
  items: AdminCatalogAffiliateSettingsResource[],
  remaining: Set<string>,
  settingsByServiceId: Map<string, AdminCatalogAffiliateSettingsResource>,
) {
  for (const item of items) {
    if (!remaining.has(item.catalogServiceId)) {
      continue;
    }

    settingsByServiceId.set(item.catalogServiceId, item);
    remaining.delete(item.catalogServiceId);
  }
}

function renderCatalogAffiliateState(settings: AdminCatalogAffiliateSettingsResource | undefined, loadError: string | null) {
  if (loadError) {
    return (
      <div className="stack-list">
        <StatusBadge label="sem leitura" tone="warning" />
        <span className="panel-meta">Falha na leitura</span>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="stack-list">
        <StatusBadge label="nao configurado" tone="neutral" />
        <span className="panel-meta">Definir no drawer</span>
      </div>
    );
  }

  return (
    <div className="stack-list">
      <StatusBadge label={settings.affiliateEnabled ? 'habilitado' : 'desligado'} tone={settings.affiliateEnabled ? 'success' : 'neutral'} />
      <span className="panel-meta">
        {settings.affiliateCommissionPercent
          ? `${formatAffiliateCommissionPercent(settings.affiliateCommissionPercent)}${settings.affiliateEnabled ? '' : ' em referencia'}`
          : 'Sem percentual ativo'}
      </span>
      <span className="panel-meta">{formatDateTime(settings.updatedAt)}</span>
    </div>
  );
}

function formatAffiliateCommissionPercent(value: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return `${value}%`;
  }

  return `${new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: parsed % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(parsed)}%`;
}

function buildCatalogEditPath(
  filters: AdminCatalogListParams,
  supplierServiceFilters: SupplierServicesListParams,
  serviceId: string,
  page: number,
  pageSize: number,
) {
  return buildPathWithSearch('/admin/catalog', {
    search: filters.search,
    page,
    pageSize,
    supplierName: supplierServiceFilters.supplierName,
    servicesPage: supplierServiceFilters.page,
    servicesPageSize: supplierServiceFilters.pageSize,
    editServiceId: serviceId,
  });
}

function buildCatalogAffiliateEditPath(
  filters: AdminCatalogListParams,
  supplierServiceFilters: SupplierServicesListParams,
  serviceId: string,
  page: number,
  pageSize: number,
) {
  return buildPathWithSearch('/admin/catalog', {
    search: filters.search,
    page,
    pageSize,
    supplierName: supplierServiceFilters.supplierName,
    servicesPage: supplierServiceFilters.page,
    servicesPageSize: supplierServiceFilters.pageSize,
    editAffiliateServiceId: serviceId,
  });
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
  page: number,
  pageSize: number,
) {
  return `${buildPathWithSearch('/admin/catalog', {
    search: filters.search,
    page,
    pageSize,
    servicesPage: supplierServiceFilters.page,
    servicesPageSize: supplierServiceFilters.pageSize,
    supplierName: supplierServiceFilters.supplierName,
    createSupplierServiceId: service.supplierServiceId,
  })}`;
}

function buildDraftParams(creationDraft?: AdminCatalogCreationDraft) {
  if (!creationDraft) {
    return {};
  }

  return {
    createSupplierServiceId: creationDraft.supplierServiceId,
  };
}

function buildSharedCatalogHiddenFields(
  filters: AdminCatalogListParams,
  supplierServiceFilters: SupplierServicesListParams,
  createSupplierServiceId?: number,
) {
  return [
    ...(filters.search ? [{ name: 'search', value: filters.search }] : []),
    ...(supplierServiceFilters.supplierName ? [{ name: 'supplierName', value: supplierServiceFilters.supplierName }] : []),
    ...(filters.pageSize ? [{ name: 'pageSize', value: filters.pageSize }] : []),
    ...(supplierServiceFilters.page ? [{ name: 'servicesPage', value: supplierServiceFilters.page }] : []),
    ...(supplierServiceFilters.pageSize ? [{ name: 'servicesPageSize', value: supplierServiceFilters.pageSize }] : []),
    ...(createSupplierServiceId ? [{ name: 'createSupplierServiceId', value: createSupplierServiceId }] : []),
  ];
}

function resolveCatalogCreationDraft(
  supplierServiceId: number | undefined,
  supplierServices: Array<{
    supplierServiceId: number;
    supplierName: string;
    name: string;
    category: string;
    type: string;
    min: number;
    max: number;
  }>,
): AdminCatalogCreationDraft | undefined {
  if (!supplierServiceId) {
    return undefined;
  }

  const service = supplierServices.find((item) => item.supplierServiceId === supplierServiceId);

  if (!service) {
    return undefined;
  }

  return {
    supplierServiceId: service.supplierServiceId,
    supplierName: service.supplierName,
    name: service.name,
    category: service.category,
    type: service.type,
    minQuantity: service.min,
    maxQuantity: service.max,
  };
}
