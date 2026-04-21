import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { AdminSectionCard } from '@/components/ui/admin-surfaces';
import { listAdminAffiliateCommissions } from '@/lib/api/admin';
import type { AffiliateCommissionResource, Money } from '@/lib/api/contracts';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime, formatMoney } from '@/lib/format';
import type { AdminAffiliateCommissionsListParams } from '@/modules/admin-shell/query';
import {
  AdminFilterBar,
  AdminSummaryCard,
  PaginationSummary,
  buildPathWithSearch,
  mapAffiliateFinanceStatusTone,
} from '@/modules/admin-shell/shared';

type AdminAffiliateCommissionsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminAffiliateCommissionsListParams;
};

export async function AdminAffiliateCommissionsPage({ session, filters }: AdminAffiliateCommissionsPageProps) {
  try {
    const { commissionIds: selectedCommissionIdsParam, ...listFilters } = filters;
    const commissions = await listAdminAffiliateCommissions(session.accessToken, listFilters);
    const approvedCount = commissions.items.filter((item) => item.status === 'approved').length;
    const paidCount = commissions.items.filter((item) => item.status === 'paid').length;
    const selectedCommissionIds = normalizeSelectedCommissionIds(selectedCommissionIdsParam);
    const selectedCommissions = commissions.items.filter((item) => selectedCommissionIds.includes(item.id));
    const selectedAffiliateProfileId = selectedCommissions[0]?.affiliateProfileId;
    const estimatedSelectionAmount = sumCommissionAmounts(selectedCommissions);
    const invalidSelectionCount = selectedCommissionIds.length - selectedCommissions.length;
    const payoutDraftPath = selectedAffiliateProfileId
      ? buildPathWithSearch('/admin/affiliate-payouts', {
          create: 1,
          affiliateProfileId: selectedAffiliateProfileId,
          commissionIds: selectedCommissionIds.join(','),
        })
      : undefined;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / comissoes afiliados"
          title="Comissoes afiliados"
          description="Leitura financeira de comissoes calculadas como percentual sobre o valor da venda."
          actions={
            <AdminFilterBar
              pathname="/admin/affiliate-commissions"
              fields={[
                {
                  name: 'status',
                  label: 'Status',
                  type: 'select',
                  defaultValue: filters.status,
                  options: [
                    { label: 'Pendente', value: 'pending' },
                    { label: 'Aprovada', value: 'approved' },
                    { label: 'Rejeitada', value: 'rejected' },
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
            description="Status, valor da comissao, pedido e payout vinculado. O percentual exibido tem como base a venda."
            meta={<span className="panel-meta">{commissions.totalItems} registros</span>}
          >
            <CommissionSelectionSummary
              affiliateProfileId={selectedAffiliateProfileId}
              selectedCount={selectedCommissions.length}
              invalidSelectionCount={invalidSelectionCount}
              estimatedAmount={estimatedSelectionAmount}
              payoutDraftPath={payoutDraftPath}
            />

            <DataTable columns={['Selecionar', 'ID', 'Afiliado', 'Pedido', 'Payout', '% venda', 'Comissao', 'Status', 'Pago em', 'Criado em']}>
              {commissions.items.map((commission) => (
                <tr key={commission.id}>
                  <td>
                    <CommissionSelectionControl
                      commission={commission}
                      filters={filters}
                      selectedCommissionIds={selectedCommissionIds}
                      selectedAffiliateProfileId={selectedAffiliateProfileId}
                    />
                  </td>
                  <td>{commission.id}</td>
                  <td>{commission.affiliateProfileId || '-'}</td>
                  <td>{commission.orderId || '-'}</td>
                  <td>{commission.payoutId || '-'}</td>
                  <td>{commission.affiliateCommissionPercent ? `${commission.affiliateCommissionPercent}%` : '-'}</td>
                  <td>{formatMoney(commission.commissionAmount)}</td>
                  <td>
                    <StatusBadge label={commission.status} tone={mapAffiliateFinanceStatusTone(commission.status)} />
                  </td>
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

function CommissionSelectionSummary({
  affiliateProfileId,
  selectedCount,
  invalidSelectionCount,
  estimatedAmount,
  payoutDraftPath,
}: {
  affiliateProfileId?: string;
  selectedCount: number;
  invalidSelectionCount: number;
  estimatedAmount: Money;
  payoutDraftPath?: string;
}) {
  if (selectedCount === 0 && invalidSelectionCount <= 0) {
    return (
      <div className="admin-form-note">
        <strong>Fluxo guiado de payout</strong>
        <p>Selecione comissoes aprovadas e sem payout. A selecao fica limitada a um afiliado por vez.</p>
      </div>
    );
  }

  return (
    <div className="admin-form-note">
      <strong>Selecao para payout</strong>
      <p>
        Afiliado: {affiliateProfileId ?? '-'} - {selectedCount} comissao(oes) - soma estimada {formatMoney(estimatedAmount)}
      </p>
      {invalidSelectionCount > 0 ? (
        <p>{invalidSelectionCount} item(ns) selecionado(s) nao estao visiveis nesta pagina e nao entram no resumo estimado.</p>
      ) : null}
      {payoutDraftPath ? (
        <Link href={payoutDraftPath} className="primary-action">
          Iniciar payout
        </Link>
      ) : null}
    </div>
  );
}

function CommissionSelectionControl({
  commission,
  filters,
  selectedCommissionIds,
  selectedAffiliateProfileId,
}: {
  commission: AffiliateCommissionResource;
  filters: AdminAffiliateCommissionsListParams;
  selectedCommissionIds: string[];
  selectedAffiliateProfileId?: string;
}) {
  if (commission.status !== 'approved') {
    return <span className="panel-meta">Status bloqueado</span>;
  }

  if (commission.payoutId) {
    return <span className="panel-meta">Ja vinculado</span>;
  }

  if (!commission.affiliateProfileId) {
    return <span className="panel-meta">Sem afiliado</span>;
  }

  const isSelected = selectedCommissionIds.includes(commission.id);
  const isDifferentAffiliate = Boolean(
    selectedAffiliateProfileId &&
      selectedAffiliateProfileId !== commission.affiliateProfileId &&
      !isSelected,
  );

  if (isDifferentAffiliate) {
    return <span className="panel-meta">Outro afiliado</span>;
  }

  const nextSelectedIds = isSelected
    ? selectedCommissionIds.filter((id) => id !== commission.id)
    : [...selectedCommissionIds, commission.id];
  const href = buildPathWithSearch('/admin/affiliate-commissions', {
    ...filters,
    commissionIds: nextSelectedIds.join(','),
  });

  return (
    <Link href={href} className="panel-link">
      {isSelected ? 'Remover' : 'Selecionar'}
    </Link>
  );
}

function normalizeSelectedCommissionIds(value: string | undefined) {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(/[\n,;]+/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function sumCommissionAmounts(commissions: AffiliateCommissionResource[]): Money {
  const currency = commissions.find((commission) => commission.commissionAmount.currency)?.commissionAmount.currency ?? 'BRL';
  const amount = commissions.reduce((total, commission) => {
    const parsed = Number(commission.commissionAmount.amount);
    return Number.isFinite(parsed) ? total + parsed : total;
  }, 0);

  return {
    amount: amount.toFixed(2),
    currency,
  };
}
