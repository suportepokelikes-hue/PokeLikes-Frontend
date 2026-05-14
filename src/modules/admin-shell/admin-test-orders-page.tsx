import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { AdminSectionCard } from '@/components/ui/admin-surfaces';
import { listAdminCatalogServices } from '@/lib/api/admin';
import { getCatalogService } from '@/lib/api/catalog';
import type { CatalogServiceResource } from '@/lib/api/contracts';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatMoney } from '@/lib/format';
import { AdminTestOrderForm } from '@/modules/admin-shell/admin-test-order-form';
import {
  formatSupplierOriginalRate,
  getSupplierRateBrlText,
  getSupplierRateConversionWarning,
} from '@/modules/admin-shell/catalog-rate-info';
import type { AdminCatalogListParams } from '@/modules/admin-shell/query';
import {
  AdminFilterBar,
  AdminSummaryCard,
  PaginationSummary,
  buildPathWithSearch,
  mapCatalogStatusTone,
  renderCatalogAvailability,
} from '@/modules/admin-shell/shared';

type AdminTestOrdersPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminCatalogListParams;
  selectedServiceId?: string;
};

export async function AdminTestOrdersPage({ session, filters, selectedServiceId }: AdminTestOrdersPageProps) {
  try {
    const catalog = await listAdminCatalogServices(session.accessToken, filters);
    const returnTo = buildPathWithSearch('/admin/test-orders', {
      ...filters,
      serviceId: selectedServiceId,
      pageSize: filters.pageSize ?? catalog.pageSize,
    });
    const selectedService = selectedServiceId
      ? await resolveCatalogService(selectedServiceId, catalog.items, session.accessToken)
      : catalog.items[0] ?? null;
    const activeCount = catalog.items.filter((service) => service.status === 'active').length;
    const purchasableCount = catalog.items.filter((service) => service.availability.isPurchasable).length;
    const withConvertedCostCount = catalog.items.filter((service) => service.supplierService.rateInfo?.convertedToBrl).length;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / testes"
          title="Testar servicos"
          description="Envie pedidos reais ao fornecedor usando o custo original, sem debitar carteira de cliente."
          actions={
            <AdminFilterBar
              pathname="/admin/test-orders"
              hiddenFields={selectedServiceId ? [{ name: 'serviceId', value: selectedServiceId }] : []}
              fields={[
                { name: 'search', label: 'Busca', type: 'search', placeholder: 'Nome, rede ou categoria', defaultValue: filters.search },
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
                {
                  name: 'pageSize',
                  label: 'Pagina',
                  type: 'select',
                  defaultValue: filters.pageSize ?? catalog.pageSize,
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
          <AdminSummaryCard label="Publicados" value={String(catalog.totalItems)} meta="Catalogo admin" />
          <AdminSummaryCard label="Ativos na pagina" value={String(activeCount)} tone="accent" />
          <AdminSummaryCard label="Compraveis" value={String(purchasableCount)} tone="warning" />
          <AdminSummaryCard label="Com custo BRL" value={String(withConvertedCostCount)} meta="Rate convertido" />
        </section>

        <section className="detail-grid">
          <AdminSectionCard
            title="Servicos publicados"
            description="Busque e selecione um item do catalogo para abrir o formulario de teste."
            meta={<span className="panel-meta">{catalog.totalItems} itens</span>}
            className="detail-card-wide"
          >
            {catalog.items.length === 0 ? (
              <EmptyState title="Nenhum servico publicado encontrado" description="Ajuste a busca ou confira o catalogo admin." />
            ) : (
              <>
                <DataTable columns={['Servico', 'Operacao', 'Disponibilidade', 'Custo teste', 'Acao']} minWidth="78rem">
                  {catalog.items.map((service) => {
                    const isSelected = selectedService?.id === service.id;
                    const rateBrlText = getSupplierRateBrlText(service.supplierService);
                    const rateConversionWarning = getSupplierRateConversionWarning(service.supplierService);

                    return (
                      <tr key={service.id}>
                        <td>
                          <div className="stack-list">
                            <strong title={service.name}>{service.name}</strong>
                            <span className="panel-meta" title={service.description ?? 'Sem descricao'}>
                              {service.description || 'Sem descricao'}
                            </span>
                            <span className="panel-meta" title={`${service.socialNetwork} / ${service.category} / ${service.type}`}>
                              {service.socialNetwork} / {service.category} / {service.type}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="stack-list">
                            <StatusBadge label={service.status} tone={mapCatalogStatusTone(service.status)} />
                            <span className="panel-meta">
                              {service.minQuantity} - {service.maxQuantity}
                            </span>
                            {service.estimatedDeliveryTime ? <span className="panel-meta">{service.estimatedDeliveryTime}</span> : null}
                          </div>
                        </td>
                        <td>{renderCatalogAvailability(service)}</td>
                        <td>
                          <div className="stack-list">
                            <strong>{formatSupplierOriginalRate(service.supplierService)}</strong>
                            {rateBrlText ? <span className="panel-meta">BRL estimado: {rateBrlText}</span> : null}
                            {rateConversionWarning ? <span className="panel-meta">{rateConversionWarning}</span> : null}
                          </div>
                        </td>
                        <td>
                          {isSelected ? (
                            <StatusBadge label="Selecionado" tone="info" />
                          ) : (
                            <Link href={buildSelectServicePath(filters, service.id, catalog.page, catalog.pageSize)} className="table-link">
                              Selecionar
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </DataTable>

                <PaginationSummary
                  page={catalog.page}
                  pageSize={catalog.pageSize}
                  totalItems={catalog.totalItems}
                  totalPages={catalog.totalPages}
                  pathname="/admin/test-orders"
                  params={{ ...filters, pageSize: filters.pageSize ?? catalog.pageSize, serviceId: selectedServiceId }}
                  label="servicos"
                />
              </>
            )}
          </AdminSectionCard>

          <AdminSectionCard
            title="Pedido de teste"
            description="O envio usa o custo original do fornecedor e nao movimenta carteira de cliente."
          >
            {selectedService ? (
              <section className="admin-drawer-stack">
                <article className="admin-inline-panel">
                  <div className="panel-heading">
                    <div>
                      <p className="eyebrow">Servico selecionado</p>
                      <h3>{selectedService.name}</h3>
                    </div>
                    <div className="feedback-actions">
                      <StatusBadge label={selectedService.status} tone={mapCatalogStatusTone(selectedService.status)} />
                      <StatusBadge
                        label={selectedService.availability.isPurchasable ? 'compravel' : 'indisponivel'}
                        tone={selectedService.availability.isPurchasable ? 'success' : 'danger'}
                      />
                    </div>
                  </div>

                  <dl className="detail-list">
                    <div>
                      <dt>Descricao</dt>
                      <dd>{selectedService.description || '-'}</dd>
                    </div>
                    <div>
                      <dt>Rede social</dt>
                      <dd>{selectedService.socialNetwork}</dd>
                    </div>
                    <div>
                      <dt>Categoria</dt>
                      <dd>{selectedService.category}</dd>
                    </div>
                    <div>
                      <dt>Tipo</dt>
                      <dd>{selectedService.type}</dd>
                    </div>
                    <div>
                      <dt>Minimo / maximo</dt>
                      <dd>
                        {selectedService.minQuantity} - {selectedService.maxQuantity}
                      </dd>
                    </div>
                    {selectedService.estimatedDeliveryTime ? (
                      <div>
                        <dt>Tempo estimado</dt>
                        <dd>{selectedService.estimatedDeliveryTime}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt>Preco publico</dt>
                      <dd>{formatMoney(selectedService.publicPrice)}</dd>
                    </div>
                    <div>
                      <dt>Preco de teste</dt>
                      <dd>{renderTestPrice(selectedService)}</dd>
                    </div>
                  </dl>
                </article>

                {!selectedService.availability.isPurchasable ? (
                  <div className="auth-notice auth-notice-warning" role="status">
                    <strong>Disponibilidade com atencao</strong>
                    <p>O backend pode recusar o envio conforme o estado atual do fornecedor.</p>
                  </div>
                ) : null}

                <AdminTestOrderForm service={selectedService} returnTo={returnTo} />
              </section>
            ) : (
              <EmptyState title="Selecione um servico" description="Escolha um item publicado para montar o pedido de teste." />
            )}
          </AdminSectionCard>
        </section>
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar os testes"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar os servicos publicados.'}
        />
      </main>
    );
  }
}

async function resolveCatalogService(serviceId: string, currentItems: CatalogServiceResource[], accessToken: string) {
  const currentItem = currentItems.find((service) => service.id === serviceId);

  if (currentItem) {
    return currentItem;
  }

  return getCatalogService(serviceId, { accessToken });
}

function renderTestPrice(service: CatalogServiceResource) {
  const originalRate = formatSupplierOriginalRate(service.supplierService);
  const brlRate = getSupplierRateBrlText(service.supplierService);
  const warning = getSupplierRateConversionWarning(service.supplierService);

  return (
    <span>
      {originalRate}
      {brlRate ? ` / ${brlRate} estimado` : ''}
      {warning ? ` / ${warning}` : ''}
    </span>
  );
}

function buildSelectServicePath(filters: AdminCatalogListParams, serviceId: string, page: number, pageSize: number) {
  return buildPathWithSearch('/admin/test-orders', {
    ...filters,
    page,
    pageSize,
    serviceId,
  });
}
