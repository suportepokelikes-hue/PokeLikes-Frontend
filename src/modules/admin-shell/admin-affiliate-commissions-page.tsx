import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { AdminSectionCard } from '@/components/ui/admin-surfaces';
import { listAdminAffiliateCommissions } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import type { AdminAffiliateCommissionsListParams } from '@/modules/admin-shell/query';
import {
  AdminFilterBar,
  AdminSummaryCard,
  PaginationSummary,
  mapAffiliateFinanceStatusTone,
} from '@/modules/admin-shell/shared';

type AdminAffiliateCommissionsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminAffiliateCommissionsListParams;
};

export async function AdminAffiliateCommissionsPage({ session, filters }: AdminAffiliateCommissionsPageProps) {
  try {
    const commissions = await listAdminAffiliateCommissions(session.accessToken, filters);
    const approvedCount = commissions.items.filter((item) => item.status === 'approved').length;
    const paidCount = commissions.items.filter((item) => item.status === 'paid').length;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / comissoes afiliados"
          title="Comissoes afiliados"
          description="Leitura financeira de aprovacao, pagamento e vinculacao por pedido."
          actions={
            <AdminFilterBar
              pathname="/admin/affiliate-commissions"
              fields={[
                {
                  name: 'search',
                  label: 'Busca',
                  type: 'search',
                  placeholder: 'ID da comissao, payout ou pedido',
                  defaultValue: filters.search,
                },
                {
                  name: 'status',
                  label: 'Status',
                  type: 'select',
                  defaultValue: filters.status,
                  options: [
                    { label: 'Pendente', value: 'pending' },
                    { label: 'Aprovada', value: 'approved' },
                    { label: 'Paga', value: 'paid' },
                  ],
                },
                {
                  name: 'affiliateProfileId',
                  label: 'Perfil',
                  defaultValue: filters.affiliateProfileId,
                },
                {
                  name: 'sortOrder',
                  label: 'Ordem',
                  type: 'select',
                  defaultValue: filters.sortOrder ?? 'desc',
                  options: [
                    { label: 'Desc', value: 'desc' },
                    { label: 'Asc', value: 'asc' },
                  ],
                },
                {
                  name: 'pageSize',
                  label: 'Por pagina',
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
          <AdminSummaryCard label="Na pagina" value={String(commissions.items.length)} meta={`${commissions.totalItems} no total`} />
          <AdminSummaryCard label="Aprovadas" value={String(approvedCount)} tone="warning" />
          <AdminSummaryCard label="Pagas" value={String(paidCount)} tone="accent" />
        </section>

        {commissions.items.length === 0 ? (
          <EmptyState title="Nenhuma comissao encontrada" description="Ajuste os filtros." />
        ) : (
          <AdminSectionCard
            eyebrow="Financeiro"
            title="Comissoes registradas"
            description="Status, valor e payout associado em uma grade unica para conciliacao."
            meta={<span className="panel-meta">{commissions.totalItems} registros</span>}
          >
            <DataTable columns={['ID', 'Afiliado', 'Pedido', 'Percentual', 'Valor', 'Status', 'Payout', 'Pago em', 'Criado em']}>
              {commissions.items.map((commission) => (
                <tr key={commission.id}>
                  <td>{commission.id}</td>
                  <td>{commission.affiliateProfileId || '-'}</td>
                  <td>{commission.orderId || '-'}</td>
                  <td>{commission.affiliateCommissionPercent}%</td>
                  <td>{formatMoney(commission.commissionAmount)}</td>
                  <td>
                    <StatusBadge label={commission.status} tone={mapAffiliateFinanceStatusTone(commission.status)} />
                  </td>
                  <td>{commission.payoutId || '-'}</td>
                  <td>{formatDateTime(commission.paidAt)}</td>
                  <td>{formatDateTime(commission.createdAt)}</td>
                </tr>
              ))}
            </DataTable>

            <PaginationSummary
              page={commissions.page}
              pageSize={commissions.pageSize}
              totalItems={commissions.totalItems}
              totalPages={commissions.totalPages}
              pathname="/admin/affiliate-commissions"
              params={{ ...filters, pageSize: filters.pageSize ?? commissions.pageSize }}
              label="comissoes"
            />
          </AdminSectionCard>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar as comissoes de afiliados"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar a lista de comissoes.'}
        />
      </main>
    );
  }
}
