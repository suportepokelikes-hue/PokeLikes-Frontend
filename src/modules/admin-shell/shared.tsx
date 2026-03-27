import { StatusBadge } from '@/components/ui/status-badge';
import type {
  AdminWalletTransactionResource,
  AlertResource,
  AuditResource,
  CatalogServiceResource,
  SupplierProviderStatusResource,
  SupplierServiceResource,
  SupplierSyncLogResource,
} from '@/lib/api/contracts';
import { formatDateTime, formatMoney } from '@/lib/format';

type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

type SummaryCardProps = {
  label: string;
  value: string;
  meta: string;
  tone?: 'default' | 'accent' | 'warning' | 'danger';
};

type PaginationSummaryProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  label: string;
};

type JsonPreviewProps = {
  value: unknown;
  fallback?: string;
};

export function AdminSummaryCard({ label, value, meta, tone = 'default' }: SummaryCardProps) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{meta}</p>
    </article>
  );
}

export function PaginationSummary({ page, pageSize, totalItems, label }: PaginationSummaryProps) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = totalItems === 0 ? 0 : Math.min(page * pageSize, totalItems);

  return <p className="pagination-panel">Mostrando {start}-{end} de {totalItems} {label}.</p>;
}

export function JsonPreview({ value, fallback = '-' }: JsonPreviewProps) {
  if (value == null) {
    return <span>{fallback}</span>;
  }

  try {
    return <code className="code-block">{JSON.stringify(value)}</code>;
  } catch {
    return <span>{fallback}</span>;
  }
}

export function renderCatalogAvailability(service: CatalogServiceResource) {
  return (
    <div className="stack-list">
      <StatusBadge label={service.availability.providerStatus} tone={mapProviderTone(service.availability.providerStatus)} />
      <span className="panel-meta">{service.availability.reason}</span>
    </div>
  );
}

export function renderSupplierFlags(service: SupplierServiceResource) {
  const flags = [];

  if (service.refill) {
    flags.push('refill');
  }

  if (service.cancel) {
    flags.push('cancel');
  }

  if (service.isActiveAtSupplier) {
    flags.push('ativo');
  }

  return flags.join(' / ') || '-';
}

export function renderTransactionDirection(transaction: AdminWalletTransactionResource) {
  return (
    <StatusBadge
      label={transaction.direction}
      tone={transaction.direction === 'credit' ? 'success' : 'danger'}
    />
  );
}

export function renderAlertTimeline(alert: AlertResource) {
  if (alert.status === 'resolved') {
    return `Resolvido em ${formatDateTime(alert.resolvedAt)}`;
  }

  return `Ultimo evento em ${formatDateTime(alert.lastOccurredAt)}`;
}

export function renderAuditPayload(audit: AuditResource) {
  return <JsonPreview value={audit.payloadSummary} fallback="Sem payload resumido" />;
}

export function summarizeSupplierStatus(provider: SupplierProviderStatusResource) {
  if (provider.operationalStatus === 'healthy') {
    return 'Operacao saudavel';
  }

  if (provider.operationalStatus === 'degraded_low_balance') {
    return provider.lastErrorCode ? `Baixo saldo / ${provider.lastErrorCode}` : 'Baixo saldo';
  }

  return provider.lastErrorCode ? `Fornecedor indisponivel / ${provider.lastErrorCode}` : 'Fornecedor indisponivel';
}

export function summarizeSupplierSync(log: SupplierSyncLogResource) {
  if (log.finishedAt) {
    return `${formatDateTime(log.startedAt)} -> ${formatDateTime(log.finishedAt)}`;
  }

  return `Iniciado em ${formatDateTime(log.startedAt)}`;
}

export function mapCatalogStatusTone(status: string): BadgeTone {
  return status === 'active' ? 'success' : 'neutral';
}

export function mapProviderTone(status: string): BadgeTone {
  if (status === 'healthy') {
    return 'success';
  }

  if (status === 'degraded_low_balance') {
    return 'warning';
  }

  return 'danger';
}

export function mapAlertSeverityTone(severity: string): BadgeTone {
  if (severity === 'critical') {
    return 'danger';
  }

  if (severity === 'warning') {
    return 'warning';
  }

  return 'info';
}

export function mapAlertStatusTone(status: string): BadgeTone {
  return status === 'resolved' ? 'neutral' : 'danger';
}

export function mapSyncStatusTone(status: string): BadgeTone {
  return status === 'success' ? 'success' : 'danger';
}

export function formatProviderBalance(provider: SupplierProviderStatusResource) {
  if (provider.balance) {
    return formatMoney(provider.balance);
  }

  return '-';
}
