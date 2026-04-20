import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { AdminSectionCard } from '@/components/ui/admin-surfaces';
import { listSupplierProviders, listSupplierServices, listSupplierSyncLogs } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime } from '@/lib/format';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { refreshSupplierProvidersAction, syncSupplierServicesAction } from '@/modules/admin-shell/actions';
import {
  AdminFilterBar,
  AdminSummaryCard,
  PaginationSummary,
  buildPathWithSearch,
  formatProviderBalance,
  mapProviderTone,
  mapSyncStatusTone,
  renderSupplierFlags,
  summarizeSupplierStatus,
  summarizeSupplierSync,
} from '@/modules/admin-shell/shared';
import type { SupplierServicesListParams, SupplierSyncLogsListParams } from '@/modules/admin-shell/query';

const supplierSyncOptions = [
  { label: 'Fornecedor default', value: '' },
  { label: 'CheapSMMGlobal', value: 'cheapsmmglobal' },
  { label: 'Instabarato', value: 'instabarato' },
] as const;

type AdminSupplierPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  serviceFilters: SupplierServicesListParams;
  logFilters: SupplierSyncLogsListParams;
};

export async function AdminSupplierPage({ session, serviceFilters, logFilters }: AdminSupplierPageProps) {
  try {
    const [providers, services, logs] = await Promise.all([
      listSupplierProviders(session.accessToken),
      listSupplierServices(session.accessToken, serviceFilters),
      listSupplierSyncLogs(session.accessToken, logFilters),
    ]);
    const serviceReturnTo = buildPathWithSearch('/admin/supplier', {
      ...serviceFilters,
      logsPage: logFilters.page,
      logsPageSize: logFilters.pageSize,
      logSupplierName: logFilters.supplierName,
      syncType: logFilters.syncType,
      logStatus: logFilters.status,
      targetType: logFilters.targetType,
    });

    const unavailableCount = providers.items.filter((provider) => provider.operationalStatus === 'unavailable').length;
    const lowBalanceCount = providers.items.filter((provider) => provider.operationalStatus === 'degraded_low_balance').length;
    const failedLogs = logs.items.filter((log) => log.status === 'failed').length;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / fornecedores"
          title="Fornecedores"
          actions={
            <>
              <AdminActionForm
                action={refreshSupplierProvidersAction}
                submitLabel="Atualizar fornecedores"
                pendingLabel="Atualizando..."
                tone="secondary"
                returnTo={serviceReturnTo}
              />
              <AdminActionForm
                action={syncSupplierServicesAction}
                submitLabel="Sincronizar catalogo"
                pendingLabel="Sincronizando..."
                tone="primary"
                returnTo={serviceReturnTo}
              >
                <label className="admin-user-field">
                  <span>Fornecedor</span>
                  <select name="supplierName" defaultValue="" className="toolbar-input">
                    {supplierSyncOptions.map((option) => (
                      <option key={option.value || 'default'} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </AdminActionForm>
            </>
          }
        />

        <section className="metric-list">
          <AdminSummaryCard label="Providers" value={String(providers.items.length)} meta={`${unavailableCount} indisponiveis`} />
          <AdminSummaryCard label="Baixo saldo" value={String(lowBalanceCount)} tone="warning" />
          <AdminSummaryCard label="Falhas" value={String(failedLogs)} meta={`${services.totalItems} servicos`} tone="danger" />
        </section>

        <section className="dashboard-grid">
          <AdminSectionCard
            title="Providers"
            meta={<span className="panel-meta">{providers.items.length} itens</span>}
          >
            {providers.items.length === 0 ? (
              <EmptyState title="Nenhum fornecedor encontrado" description="Ajuste os filtros." />
            ) : (
              <DataTable columns={['Fornecedor', 'Status operacional', 'Ultima checagem']}>
                {providers.items.map((provider) => (
                  <tr key={provider.supplierName}>
                    <td>
                      <div className="stack-list">
                        <strong>{provider.supplierName}</strong>
                        <span className="panel-meta">{summarizeSupplierStatus(provider)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="stack-list">
                        <StatusBadge label={provider.operationalStatus} tone={mapProviderTone(provider.operationalStatus)} />
                        <span className="panel-meta">{formatProviderBalance(provider)}</span>
                      </div>
                    </td>
                    <td>{formatDateTime(provider.lastCheckedAt)}</td>
                  </tr>
                ))}
              </DataTable>
            )}
          </AdminSectionCard>

          <AdminSectionCard
            title="Logs de sincronizacao"
            meta={<span className="panel-meta">{logs.totalItems} registros</span>}
          >
            <AdminFilterBar
              pathname="/admin/supplier"
              hiddenFields={[
                { name: 'servicesPage', value: serviceFilters.page ?? 1 },
                { name: 'servicesPageSize', value: serviceFilters.pageSize ?? 10 },
                ...(serviceFilters.search ? [{ name: 'servicesSearch', value: serviceFilters.search }] : []),
                ...(serviceFilters.supplierName ? [{ name: 'supplierName', value: serviceFilters.supplierName }] : []),
                ...(serviceFilters.category ? [{ name: 'category', value: serviceFilters.category }] : []),
                ...(serviceFilters.type ? [{ name: 'type', value: serviceFilters.type }] : []),
                ...(serviceFilters.isActiveAtSupplier ? [{ name: 'isActiveAtSupplier', value: serviceFilters.isActiveAtSupplier }] : []),
              ]}
              fields={[
                { name: 'logSupplierName', label: 'Fornecedor', defaultValue: logFilters.supplierName },
                { name: 'syncType', label: 'Tipo sync', defaultValue: logFilters.syncType },
                {
                  name: 'logStatus',
                  label: 'Status',
                  type: 'select',
                  defaultValue: logFilters.status,
                  options: [
                    { label: 'Sucesso', value: 'success' },
                    { label: 'Falha', value: 'failed' },
                  ],
                },
                { name: 'targetType', label: 'Alvo', defaultValue: logFilters.targetType },
                {
                  name: 'logsPageSize',
                  label: 'Tamanho',
                  type: 'select',
                  defaultValue: logFilters.pageSize ?? 10,
                  options: [
                    { label: '10', value: '10' },
                    { label: '20', value: '20' },
                    { label: '50', value: '50' },
                  ],
                },
              ]}
            />

            {logs.items.length === 0 ? (
              <EmptyState title="Nenhum log encontrado" description="Sem eventos." />
            ) : (
              <>
              <DataTable columns={['Fornecedor', 'Tipo', 'Alvo', 'Status', 'Janela']}>
                  {logs.items.map((log) => (
                    <tr key={log.id}>
                      <td>{log.supplierName || 'Fornecedor nao informado'}</td>
                      <td>{log.syncType}</td>
                      <td>
                        <div className="stack-list">
                          <strong>{log.targetType}</strong>
                          <span className="panel-meta">{log.targetId || '-'}</span>
                        </div>
                      </td>
                      <td>
                        <StatusBadge label={log.status} tone={mapSyncStatusTone(log.status)} />
                      </td>
                      <td>{summarizeSupplierSync(log)}</td>
                    </tr>
                  ))}
                </DataTable>
                <PaginationSummary
                  page={logs.page}
                  pageSize={logs.pageSize}
                  totalItems={logs.totalItems}
                  totalPages={logs.totalPages}
                  pathname="/admin/supplier"
                  params={{
                    servicesPage: serviceFilters.page ?? 1,
                    servicesPageSize: serviceFilters.pageSize ?? 10,
                    servicesSearch: serviceFilters.search,
                    supplierName: serviceFilters.supplierName,
                    category: serviceFilters.category,
                    type: serviceFilters.type,
                    isActiveAtSupplier: serviceFilters.isActiveAtSupplier,
                    logsPageSize: logFilters.pageSize ?? logs.pageSize,
                    logSupplierName: logFilters.supplierName,
                    syncType: logFilters.syncType,
                    logStatus: logFilters.status,
                    targetType: logFilters.targetType,
                  }}
                  label="logs"
                />
              </>
            )}
          </AdminSectionCard>
        </section>

        <AdminSectionCard
          title="Servicos sincronizados"
          meta={<span className="panel-meta">{services.totalItems} itens</span>}
          className="detail-card-wide"
        >
          <AdminFilterBar
            pathname="/admin/supplier"
            hiddenFields={[
              { name: 'logsPage', value: logFilters.page ?? 1 },
              { name: 'logsPageSize', value: logFilters.pageSize ?? 10 },
              ...(logFilters.supplierName ? [{ name: 'logSupplierName', value: logFilters.supplierName }] : []),
              ...(logFilters.syncType ? [{ name: 'syncType', value: logFilters.syncType }] : []),
              ...(logFilters.status ? [{ name: 'logStatus', value: logFilters.status }] : []),
              ...(logFilters.targetType ? [{ name: 'targetType', value: logFilters.targetType }] : []),
            ]}
            fields={[
              { name: 'servicesSearch', label: 'Busca', type: 'search', placeholder: 'Servico', defaultValue: serviceFilters.search },
              { name: 'supplierName', label: 'Fornecedor', defaultValue: serviceFilters.supplierName },
              { name: 'category', label: 'Categoria', defaultValue: serviceFilters.category },
              { name: 'type', label: 'Tipo', defaultValue: serviceFilters.type },
              {
                name: 'isActiveAtSupplier',
                label: 'Ativo',
                type: 'select',
                defaultValue: serviceFilters.isActiveAtSupplier,
                options: [
                  { label: 'Sim', value: 'true' },
                  { label: 'Nao', value: 'false' },
                ],
              },
              {
                name: 'servicesPageSize',
                label: 'Tamanho',
                type: 'select',
                defaultValue: serviceFilters.pageSize ?? 10,
                options: [
                  { label: '10', value: '10' },
                  { label: '20', value: '20' },
                  { label: '50', value: '50' },
                ],
              },
            ]}
          />

          {services.items.length === 0 ? (
            <EmptyState title="Nenhum servico sincronizado" description="Ajuste os filtros." />
          ) : (
            <>
              <DataTable columns={['Origem', 'Servico', 'Operacao', 'Flags', 'Sync']} >
                {services.items.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="stack-list">
                        <strong>{service.supplierName}</strong>
                        <span className="panel-meta">SID {service.supplierServiceId}</span>
                      </div>
                    </td>
                    <td>
                      <div className="stack-list">
                        <strong>{service.name}</strong>
                        <span className="panel-meta">
                          {service.category} / {service.type}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="stack-list">
                        <strong>Rate {service.rate}</strong>
                        <span className="panel-meta">
                          {service.min} - {service.max}
                        </span>
                      </div>
                    </td>
                    <td>{renderSupplierFlags(service)}</td>
                    <td>
                      <div className="stack-list">
                        <span className="panel-meta">{formatDateTime(service.syncedAt)}</span>
                        <AdminActionForm
                          action={syncSupplierServicesAction}
                          submitLabel="Sincronizar"
                          pendingLabel="Sincronizando..."
                          returnTo={serviceReturnTo}
                          hiddenFields={[{ name: 'supplierName', value: service.supplierName }]}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </DataTable>
              <PaginationSummary
                page={services.page}
                pageSize={services.pageSize}
                totalItems={services.totalItems}
                totalPages={services.totalPages}
                pathname="/admin/supplier"
                params={{
                  logsPage: logFilters.page ?? 1,
                  logsPageSize: logFilters.pageSize ?? 10,
                  logSupplierName: logFilters.supplierName,
                  syncType: logFilters.syncType,
                  logStatus: logFilters.status,
                  targetType: logFilters.targetType,
                  servicesPageSize: serviceFilters.pageSize ?? services.pageSize,
                  servicesSearch: serviceFilters.search,
                  supplierName: serviceFilters.supplierName,
                  category: serviceFilters.category,
                  type: serviceFilters.type,
                  isActiveAtSupplier: serviceFilters.isActiveAtSupplier,
                }}
                label="servicos"
                />
              </>
            )}
        </AdminSectionCard>
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar a operacao de fornecedores"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar os dados de fornecedores.'}
        />
      </main>
    );
  }
}
