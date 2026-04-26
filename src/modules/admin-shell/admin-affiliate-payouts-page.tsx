import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/table';
import { AdminSectionCard } from '@/components/ui/admin-surfaces';
import { listAdminAffiliatePayouts } from '@/lib/api/admin';
import type { AffiliatePayoutResource } from '@/lib/api/contracts';
import { ApiClientError } from '@/lib/api/http';
import type { SessionState } from '@/lib/auth/session';
import { formatDateTime } from '@/lib/format';
import {
  createAffiliatePayoutAction,
  refreshAffiliatePayoutAction,
  updateAffiliatePayoutStatusAction,
} from '@/modules/admin-shell/actions';
import { AdminActionForm } from '@/modules/admin-shell/admin-action-form';
import { AdminAffiliatePayoutForm } from '@/modules/admin-shell/admin-affiliate-payout-form';
import { AdminSlideOver } from '@/modules/admin-shell/admin-slide-over';
import type {
  AdminAffiliatePayoutCreationDraft,
  AdminAffiliatePayoutsListParams,
} from '@/modules/admin-shell/query';
import {
  AdminFilterBar,
  AdminSummaryCard,
  PaginationSummary,
  buildPathWithSearch,
  mapAffiliateFinanceStatusTone,
  summarizeText,
} from '@/modules/admin-shell/shared';

const PROCESSING_DELAY_THRESHOLD_MS = 30 * 60 * 1000;

type AdminAffiliatePayoutsPageProps = {
  session: Extract<SessionState, { status: 'authenticated' }>;
  filters: AdminAffiliatePayoutsListParams;
  isCreateOpen?: boolean;
  creationDraft?: AdminAffiliatePayoutCreationDraft;
};

export async function AdminAffiliatePayoutsPage({
  session,
  filters,
  isCreateOpen = false,
  creationDraft,
}: AdminAffiliatePayoutsPageProps) {
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
    const processingCount = payouts.items.filter((item) => item.status === 'requested' || item.status === 'processing').length;
    const awaitingProviderCount = payouts.items.filter((item) => item.status === 'processing' && !item.providerSyncedAt).length;
    const delayedProcessingCount = payouts.items.filter(isProcessingDelayed).length;
    const providerSyncedCount = payouts.items.filter((item) => Boolean(item.providerSyncedAt)).length;
    const blockedCount = payouts.items.filter((item) => item.status === 'failed' || item.status === 'cancelled').length;
    const providerErrorCount = payouts.items.filter(hasProviderFailureSignal).length;

    return (
      <main className="page page-admin">
        <PageHeader
          eyebrow="Admin / payouts afiliados"
          title="Payouts afiliados"
          description="Payout PIX real via Asaas. O webhook atualiza o retorno do provider; o refresh manual fica como fallback operacional."
          actions={
            <>
              <Link href={createPath} className="primary-action">
                + Novo payout
              </Link>
              <AdminFilterBar
                pathname="/admin/affiliate-payouts"
                fields={[
                  {
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    defaultValue: filters.status,
                    options: [
                      { label: 'Solicitado', value: 'requested' },
                      { label: 'Processando', value: 'processing' },
                      { label: 'Pago', value: 'paid' },
                      { label: 'Falhou', value: 'failed' },
                      { label: 'Cancelado', value: 'cancelled' },
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
            </>
          }
        />

        <section className="metric-list">
          <AdminSummaryCard label="Na pagina" value={String(payouts.items.length)} meta={`${payouts.totalItems} no total`} />
          <AdminSummaryCard label="Pagos" value={String(paidCount)} tone="accent" />
          <AdminSummaryCard
            label="Em andamento"
            value={String(processingCount)}
            tone="warning"
            meta={`${awaitingProviderCount} aguardando provider, ${delayedProcessingCount} atrasado(s)`}
          />
          <AdminSummaryCard label="Sync provider" value={String(providerSyncedCount)} tone="accent" />
          <AdminSummaryCard label="Alertas provider" value={String(providerErrorCount || blockedCount)} tone="danger" />
        </section>

        {payouts.items.length === 0 ? (
          <EmptyState title="Nenhum payout encontrado" description="Ajuste os filtros." />
        ) : (
          <AdminSectionCard
            eyebrow="Saida financeira"
            title="Payouts registrados"
            description="Operacao PIX/Asaas com auditoria do provider. Webhook automatico ativo; use refresh apenas quando o retorno nao chegar."
            meta={<span className="panel-meta">{payouts.totalItems} registros</span>}
          >
            <DataTable columns={['ID', 'Afiliado', 'Comissoes', 'Valor', 'PIX', 'Status', 'Provider', 'Timeline', 'Motivo/erro', 'Acao']}>
              {payouts.items.map((payout) => {
                const operationalSignal = getPayoutOperationalSignal(payout);

                return (
                  <tr key={payout.id} className={formatOperationalRowClass(operationalSignal)}>
                    <td>{payout.id}</td>
                    <td>{payout.affiliateProfileId || '-'}</td>
                    <td>{formatCommissionLinkage(payout.commissionCount, payout.commissionIds)}</td>
                    <td>{formatPayoutAmount(payout.amount)}</td>
                    <td>{formatPayoutPixKey(payout.pixKey)}</td>
                    <td>
                      <span className="admin-inline-stack">
                        <StatusBadge label={formatPayoutStatus(payout.status)} tone={mapAffiliateFinanceStatusTone(payout.status)} />
                        {operationalSignal ? (
                          <StatusBadge label={operationalSignal.label} tone={operationalSignal.tone} />
                        ) : null}
                        <span>{formatPayoutSyncHint(payout)}</span>
                        {operationalSignal?.actionText ? (
                          <span className={`admin-operational-hint admin-operational-hint-${operationalSignal.tone}`}>
                            {operationalSignal.actionText}
                          </span>
                        ) : null}
                      </span>
                    </td>
                    <td>{formatProviderAudit(payout)}</td>
                    <td>{formatPayoutTimeline(payout)}</td>
                    <td>{formatOperationalReason(payout, operationalSignal)}</td>
                    <td>
                      <AffiliatePayoutActions payout={payout} returnTo={returnTo} />
                    </td>
                  </tr>
                );
              })}
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
          </AdminSectionCard>
        )}

        {isCreateOpen ? (
          <AdminSlideOver
            eyebrow="Payout PIX"
            title="Registrar payout afiliado"
            description="Cria a solicitacao inicial. A transferencia PIX/Asaas so e disparada ao processar."
            closeHref={returnTo}
          >
            <AdminAffiliatePayoutForm
              action={createAffiliatePayoutAction}
              returnTo={returnTo}
              defaultAffiliateProfileId={creationDraft?.affiliateProfileId ?? filters.affiliateProfileId}
              defaultCommissionIds={creationDraft?.commissionIds}
            />
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

function AffiliatePayoutActions({ payout, returnTo }: { payout: AffiliatePayoutResource; returnTo: string }) {
  if (payout.status === 'paid' || payout.status === 'failed' || payout.status === 'cancelled') {
    return <span className="panel-meta">Finalizado</span>;
  }

  return (
    <div className="admin-user-form">
      {payout.status === 'processing' ? (
        <AdminActionForm
          action={refreshAffiliatePayoutAction}
          submitLabel="Atualizar Asaas"
          pendingLabel="Atualizando..."
          tone="secondary"
          returnTo={returnTo}
          hiddenFields={[{ name: 'payoutId', value: payout.id }]}
        />
      ) : null}

      <AdminActionForm
        action={updateAffiliatePayoutStatusAction}
        submitLabel={payout.status === 'requested' ? 'Processar PIX' : 'Mudar status'}
        pendingLabel="Atualizando..."
        tone={payout.status === 'requested' ? 'primary' : 'secondary'}
        returnTo={returnTo}
        hiddenFields={[{ name: 'payoutId', value: payout.id }]}
      >
        <label className="admin-user-field">
          <span>Status</span>
          <select name="status" defaultValue={payout.status === 'requested' ? 'processing' : 'paid'}>
            {payout.status === 'requested' ? <option value="processing">Processando via Asaas</option> : null}
            {payout.status === 'processing' ? (
              <>
                <option value="paid">Pago</option>
                <option value="failed">Falhou</option>
                <option value="cancelled">Cancelado</option>
              </>
            ) : null}
          </select>
        </label>
        <label className="admin-user-field">
          <span>Motivo</span>
          <input type="text" name="statusReason" defaultValue={payout.statusReason ?? ''} placeholder="Opcional" />
        </label>
        <label className="admin-user-field">
          <span>Observacao</span>
          <input type="text" name="notes" defaultValue={payout.notes ?? ''} placeholder="Opcional" />
        </label>
      </AdminActionForm>
    </div>
  );
}

function formatCommissionLinkage(commissionCount?: number | null, commissionIds?: string[] | null) {
  if (typeof commissionCount === 'number' && Number.isFinite(commissionCount)) {
    return `${commissionCount} item(ns)`;
  }

  if (commissionIds && commissionIds.length > 0) {
    return `${commissionIds.length} item(ns)`;
  }

  return '-';
}

function formatPayoutAmount(amount: string | null | undefined) {
  if (!amount) {
    return '-';
  }

  const parsed = Number(amount);

  if (!Number.isFinite(parsed)) {
    return amount;
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(parsed);
}

function formatPayoutPixKey(pixKey: AffiliatePayoutResource['pixKey']) {
  if (!pixKey) {
    return '-';
  }

  return `${formatPixKeyType(pixKey.type)}: ${pixKey.key}`;
}

function formatPayoutSyncHint(payout: AffiliatePayoutResource) {
  if (payout.providerSyncedAt) {
    return `Provider atualizou em ${formatDateTime(payout.providerSyncedAt)}`;
  }

  if (payout.status === 'requested') {
    return 'Ainda nao enviado ao provider';
  }

  if (payout.status === 'processing') {
    return 'Aguardando webhook; refresh e fallback';
  }

  return 'Sem sync provider registrado';
}

type PayoutOperationalSignal = {
  kind: 'processing-delayed' | 'provider-error';
  label: string;
  tone: 'warning' | 'danger';
  actionText?: string;
};

function getPayoutOperationalSignal(payout: AffiliatePayoutResource): PayoutOperationalSignal | null {
  if (hasProviderFailureSignal(payout)) {
    return {
      kind: 'provider-error',
      label: 'Erro provider',
      tone: 'danger',
      actionText: isTerminalPayout(payout)
        ? 'Finalizado com erro registrado.'
        : 'Atualize Asaas ou marque falha com motivo.',
    };
  }

  if (isProcessingDelayed(payout)) {
    return {
      kind: 'processing-delayed',
      label: 'Processing atrasado',
      tone: 'warning',
      actionText: 'Use refresh Asaas e confira o provider.',
    };
  }

  return null;
}

function isProcessingDelayed(payout: AffiliatePayoutResource) {
  if (payout.status !== 'processing' || payout.providerSyncedAt || !payout.processingAt) {
    return false;
  }

  const processingTime = Date.parse(payout.processingAt);

  return Number.isFinite(processingTime) && Date.now() - processingTime >= PROCESSING_DELAY_THRESHOLD_MS;
}

function hasProviderFailureSignal(payout: AffiliatePayoutResource) {
  if (payout.providerErrorCode || payout.providerErrorMessage) {
    return true;
  }

  const providerStatus = payout.providerStatus?.toLowerCase();

  if (!providerStatus) {
    return false;
  }

  return ['fail', 'error', 'refused', 'reject', 'cancel', 'denied', 'expired'].some((signal) =>
    providerStatus.includes(signal),
  );
}

function isTerminalPayout(payout: AffiliatePayoutResource) {
  return payout.status === 'paid' || payout.status === 'failed' || payout.status === 'cancelled';
}

function formatOperationalRowClass(signal: PayoutOperationalSignal | null) {
  if (!signal) {
    return undefined;
  }

  return signal.tone === 'danger' ? 'data-table-row-danger' : 'data-table-row-warning';
}

function formatProviderAudit(payout: AffiliatePayoutResource) {
  const rows = [
    ['Provider', payout.provider ?? (payout.status === 'requested' ? null : 'Asaas')],
    ['Retorno', formatProviderSyncState(payout)],
    ['Status provider', payout.providerStatus],
    ['Transacao', payout.providerTransactionId],
    ['Referencia', payout.externalReference],
  ].filter(([, value]) => Boolean(value));

  if (rows.length === 0) {
    return '-';
  }

  return (
    <span className="admin-inline-stack">
      {rows.map(([label, value]) => (
        <span key={label}>
          <strong>{label}:</strong> {summarizeText(value)}
        </span>
      ))}
    </span>
  );
}

function formatOperationalReason(payout: AffiliatePayoutResource, signal?: PayoutOperationalSignal | null) {
  const providerError = [payout.providerErrorCode, payout.providerErrorMessage].filter(Boolean).join(' - ');
  const rows = [
    signal ? ['Alerta', signal.actionText ?? signal.label] : null,
    providerError ? ['Erro provider', providerError] : null,
    payout.statusReason ? ['Motivo', payout.statusReason] : null,
    payout.notes ? ['Obs.', payout.notes] : null,
  ].filter((row): row is [string, string] => Boolean(row));

  if (rows.length === 0) {
    return '-';
  }

  return (
    <span className="admin-inline-stack">
      {rows.map(([label, value]) => (
        <span key={label}>
          <strong>{label}:</strong> {summarizeText(value)}
        </span>
      ))}
    </span>
  );
}

function formatProviderSyncState(payout: AffiliatePayoutResource) {
  if (payout.providerSyncedAt) {
    return `Sincronizado ${formatDateTime(payout.providerSyncedAt)}`;
  }

  if (payout.status === 'processing') {
    return 'Aguardando webhook automatico';
  }

  if (payout.status === 'requested') {
    return 'Pendente de processamento';
  }

  return null;
}

function formatPixKeyType(value: string) {
  switch (value) {
    case 'cpf':
      return 'CPF';
    case 'cnpj':
      return 'CNPJ';
    case 'email':
      return 'E-mail';
    case 'phone':
      return 'Telefone';
    case 'random':
      return 'Aleatoria';
    default:
      return value;
  }
}

function formatPayoutTimeline(payout: AffiliatePayoutResource) {
  const rows = [
    ['Solicitado', payout.requestedAt || payout.createdAt],
    ['Processando', payout.processingAt],
    ['Pago', payout.paidAt],
    ['Falhou', payout.failedAt],
    ['Cancelado', payout.cancelledAt],
  ].filter(([, value]) => Boolean(value));

  if (rows.length === 0) {
    return '-';
  }

  return (
    <span className="admin-inline-stack">
      {rows.map(([label, value]) => (
        <span key={label}>
          <strong>{label}:</strong> {formatDateTime(value)}
        </span>
      ))}
    </span>
  );
}

function formatPayoutStatus(status: string) {
  switch (status) {
    case 'requested':
      return 'Solicitado';
    case 'processing':
      return 'Processando';
    case 'paid':
      return 'Pago';
    case 'failed':
      return 'Falhou';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
}
