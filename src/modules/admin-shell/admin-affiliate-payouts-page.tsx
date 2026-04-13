import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { listAdminAffiliatePayouts } from '@/lib/api/admin';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import { createAffiliatePayoutAction } from '@/modules/admin-shell/actions';
import { AdminAffiliatePayoutForm } from '@/modules/admin-shell/admin-affiliate-payout-form';
import { AdminSlideOver } from '@/modules/admin-shell/admin-slide-over';
import type { AdminAffiliatePayoutsListParams } from '@/modules/admin-shell/query';
import {
  AdminFilterBar,
  AdminSummaryCard,
  PaginationSummary,
  buildPathWithSearch,
  mapAffiliateFinanceStatusTone,
  summarizeText,
} from '@/modules/admin-shell/shared';

type AdminAffiliatePayoutsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminAffiliatePayoutsListParams;
  isCreateOpen?: boolean;
};

export async function AdminAffiliatePayoutsPage({ session, filters, isCreateOpen = false }: AdminAffiliatePayoutsPageProps) {
  try {
    const payouts = await listAdminAffiliatePayouts(session.accessToken, filters);
    const returnTo = buildPathWithSearch('/admin/affiliate-payouts', {
      ...filters,
      page: filters.page ?? payouts.page,
      pageSize: filters.pageSize ?? payouts.pageSize,
    });
    const createPath = buildPathWithSearch('/admin/affiliate-payouts', {
      ...filters,
      page: filters.page ?? payouts.page,
      pageSize: filters.pageSize ?? payouts.pageSize,
      create: 1,
    });
    const paidCount = payouts.items.filter((item) => item.status === 'paid').length;
    const pendingCount = payouts.items.filter((item) => item.status === 'pending').length;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / payouts afiliados"
          title="Payouts afiliados"
          actions={
            <>
              <Link href={createPath} className="primary-action">
                + Novo payout
              </Link>
              <AdminFilterBar
                pathname="/admin/affiliate-payouts"
                fields={[
                  {
                    name: 'search',
                    label: 'Busca',
                    type: 'search',
                    placeholder: 'ID do payout ou observacao',
                    defaultValue: filters.search,
                  },
                  {
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    defaultValue: filters.status,
                    options: [
                      { label: 'Pending', value: 'pending' },
                      { label: 'Paid', value: 'paid' },
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
            </>
          }
        />

        <section className="metric-list">
          <AdminSummaryCard label="Na pagina" value={String(payouts.items.length)} meta={`${payouts.totalItems} no total`} />
          <AdminSummaryCard label="Pagos" value={String(paidCount)} tone="accent" />
          <AdminSummaryCard label="Pendentes" value={String(pendingCount)} tone="warning" />
        </section>

        {payouts.items.length === 0 ? (
          <EmptyState title="Nenhum payout encontrado" description="Ajuste os filtros." />
        ) : (
          <>
            <DataTable columns={['ID', 'Afiliado', 'Valor', 'Status', 'Pago em', 'Criado em', 'Observacao']}>
              {payouts.items.map((payout) => (
                <tr key={payout.id}>
                  <td>{payout.id}</td>
                  <td>{payout.affiliateProfileId || '-'}</td>
                  <td>{formatMoney(payout.amount)}</td>
                  <td>
                    <StatusBadge label={payout.status} tone={mapAffiliateFinanceStatusTone(payout.status)} />
                  </td>
                  <td>{formatDateTime(payout.paidAt)}</td>
                  <td>{formatDateTime(payout.createdAt)}</td>
                  <td>{summarizeText(payout.note)}</td>
                </tr>
              ))}
            </DataTable>

            <PaginationSummary
              page={payouts.page}
              pageSize={payouts.pageSize}
              totalItems={payouts.totalItems}
              totalPages={payouts.totalPages}
              pathname="/admin/affiliate-payouts"
              params={{ ...filters, pageSize: filters.pageSize ?? payouts.pageSize }}
              label="payouts"
            />
          </>
        )}

        {isCreateOpen ? (
          <AdminSlideOver
            eyebrow="Payout manual"
            title="Registrar payout afiliado"
            closeHref={returnTo}
          >
            <AdminAffiliatePayoutForm action={createAffiliatePayoutAction} returnTo={returnTo} defaultAffiliateProfileId={filters.affiliateProfileId} />
          </AdminSlideOver>
        ) : null}
      </main>
    );
  } catch (error) {
    return (
      <main className="page page-admin">
        <ErrorState
          title="Nao foi possivel carregar os payouts de afiliados"
          description={error instanceof ApiClientError ? error.message : 'Nao foi possivel buscar a lista de payouts.'}
        />
      </main>
    );
  }
}
