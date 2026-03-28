import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listAdminCatalogServices } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatMoney } from '@/lib/format';
import {
  AdminFilterBar,
  AdminSummaryCard,
  PaginationSummary,
  mapCatalogStatusTone,
  mapProviderTone,
  renderCatalogAvailability,
} from '@/modules/admin-shell/shared';
import type { AdminCatalogListParams } from '@/modules/admin-shell/query';

type AdminCatalogPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminCatalogListParams;
};

export async function AdminCatalogPage({ session, filters }: AdminCatalogPageProps) {
  try {
    const catalog = await listAdminCatalogServices(session.accessToken, filters);
    const activeCount = catalog.items.filter((service) => service.status === 'active').length;
    const purchasableCount = catalog.items.filter((service) => service.availability.isPurchasable).length;
    const degradedCount = catalog.items.filter(
      (service) => service.availability.providerStatus === 'degraded_low_balance' || service.availability.providerStatus === 'unavailable',
    ).length;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / catalogo"
          title="Catalogo operacional do fornecedor."
          description="A tela administrativa do catalogo segue o contrato oficial e prioriza preco publico, disponibilidade real e vinculo com o servico fornecedor."
          actions={
            <AdminFilterBar
              pathname="/admin/catalog"
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
          <AdminSummaryCard label="Servicos na pagina" value={String(catalog.items.length)} meta={`${catalog.totalItems} cadastrados no total`} />
          <AdminSummaryCard label="Ativos" value={String(activeCount)} meta="Status retornado pela API" tone="accent" />
          <AdminSummaryCard label="Compraveis" value={String(purchasableCount)} meta={`${degradedCount} com risco operacional`} tone="warning" />
        </section>

        {catalog.items.length === 0 ? (
          <EmptyState title="Nenhum servico encontrado" description="O backend nao retornou servicos de catalogo para a listagem administrativa atual." />
        ) : (
          <>
            <DataTable columns={['Servico', 'Preco publico', 'Status', 'Disponibilidade', 'Fornecedor', 'Faixa']} >
              {catalog.items.map((service) => (
                <tr key={service.id}>
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
                </tr>
              ))}
            </DataTable>

            <PaginationSummary
              page={catalog.page}
              pageSize={catalog.pageSize}
              totalItems={catalog.totalItems}
              totalPages={catalog.totalPages}
              pathname="/admin/catalog"
              params={{ ...filters, pageSize: filters.pageSize ?? catalog.pageSize }}
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
          description={error instanceof ApiClientError ? error.message : 'A API nao retornou a lista administrativa de catalogo.'}
        />
      </main>
    );
  }
}
