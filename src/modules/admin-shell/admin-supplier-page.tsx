import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listSupplierProviders, listSupplierServices, listSupplierSyncLogs } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime } from '@/lib/format';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { refreshSupplierProvidersAction, syncSupplierServicesAction } from '@/modules/admin-shell/actions';
import {
  AdminSummaryCard,
  PaginationSummary,
  formatProviderBalance,
  mapProviderTone,
  mapSyncStatusTone,
  renderSupplierFlags,
  summarizeSupplierStatus,
  summarizeSupplierSync,
} from '@/modules/admin-shell/shared';

type AdminSupplierPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
};

export async function AdminSupplierPage({ session }: AdminSupplierPageProps) {
  try {
    const [providers, services, logs] = await Promise.all([
      listSupplierProviders(session.accessToken),
      listSupplierServices(session.accessToken),
      listSupplierSyncLogs(session.accessToken),
    ]);

    const unavailableCount = providers.items.filter((provider) => provider.operationalStatus === 'unavailable').length;
    const lowBalanceCount = providers.items.filter((provider) => provider.operationalStatus === 'degraded_low_balance').length;
    const failedLogs = logs.items.filter((log) => log.status === 'failed').length;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / fornecedores"
          title="Fornecedores, servicos sincronizados e trilha tecnica."
          description="A area unifica status dos providers, catalogo espelhado do fornecedor e os logs mais recentes de sincronizacao."
          actions={
            <>
              <AdminActionForm
                action={refreshSupplierProvidersAction}
                submitLabel="Atualizar providers"
                pendingLabel="Atualizando..."
                tone="secondary"
              />
              <AdminActionForm
                action={syncSupplierServicesAction}
                submitLabel="Sincronizar catalogo"
                pendingLabel="Sincronizando..."
                tone="primary"
              />
            </>
          }
        />

        <section className="metric-list">
          <AdminSummaryCard label="Provedores" value={String(providers.items.length)} meta={`${unavailableCount} indisponiveis`} />
          <AdminSummaryCard label="Baixo saldo" value={String(lowBalanceCount)} meta="Degradacao operacional em aberto" tone="warning" />
          <AdminSummaryCard label="Falhas recentes" value={String(failedLogs)} meta={`${services.totalItems} servicos sincronizados`} tone="danger" />
        </section>

        <section className="dashboard-grid">
          <article className="detail-card">
            <div className="panel-heading">
              <h2>Status dos providers</h2>
              <span className="panel-meta">Baseado em /admin/supplier/providers</span>
            </div>

            {providers.items.length === 0 ? (
              <EmptyState title="Nenhum provider monitorado" description="A API nao retornou providers para a monitoracao administrativa." />
            ) : (
              <DataTable columns={['Fornecedor', 'Status', 'Saldo', 'Ultima checagem']}>
                {providers.items.map((provider) => (
                  <tr key={provider.supplierName}>
                    <td>
                      <div className="stack-list">
                        <strong>{provider.supplierName}</strong>
                        <span className="panel-meta">{summarizeSupplierStatus(provider)}</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge label={provider.operationalStatus} tone={mapProviderTone(provider.operationalStatus)} />
                    </td>
                    <td>{formatProviderBalance(provider)}</td>
                    <td>{formatDateTime(provider.lastCheckedAt)}</td>
                  </tr>
                ))}
              </DataTable>
            )}
          </article>

          <article className="detail-card">
            <div className="panel-heading">
              <h2>Logs de sincronizacao</h2>
              <span className="panel-meta">Ultimos eventos tecnicos</span>
            </div>

            {logs.items.length === 0 ? (
              <EmptyState title="Nenhum log encontrado" description="Ainda nao existem eventos de sincronizacao para exibir." />
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
                <PaginationSummary page={logs.page} pageSize={logs.pageSize} totalItems={logs.totalItems} label="logs" />
              </>
            )}
          </article>
        </section>

        <section className="detail-card detail-card-wide">
          <div className="panel-heading">
            <h2>Servicos do fornecedor</h2>
            <span className="panel-meta">Primeira pagina de /admin/supplier/services</span>
          </div>

          {services.items.length === 0 ? (
            <EmptyState title="Nenhum servico sincronizado" description="A API nao retornou servicos do fornecedor para a listagem atual." />
          ) : (
            <>
              <DataTable columns={['Fornecedor / SID', 'Servico', 'Categoria / tipo', 'Rate', 'Faixa', 'Flags', 'Sync']} >
                {services.items.map((service) => (
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
                    <td>{renderSupplierFlags(service)}</td>
                    <td>
                      <div className="stack-list">
                        <span className="panel-meta">{formatDateTime(service.syncedAt)}</span>
                        <AdminActionForm
                          action={syncSupplierServicesAction}
                          submitLabel="Sync fornecedor"
                          pendingLabel="Sincronizando..."
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
                label="servicos"
              />
            </>
          )}
        </section>
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar a operacao de fornecedores"
          description={error instanceof ApiClientError ? error.message : 'A API nao respondeu aos endpoints de fornecedores.'}
        />
      </main>
    );
  }
}
