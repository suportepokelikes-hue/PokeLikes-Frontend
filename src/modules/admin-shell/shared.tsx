import Link from 'next/link';

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
  totalPages?: number;
  pathname?: string;
  params?: Record<string, string | number | undefined>;
};

type JsonPreviewProps = {
  value: unknown;
  fallback?: string;
};

type AdminFilterField =
  | {
      name: string;
      label: string;
      type?: 'search' | 'text' | 'datetime-local';
      placeholder?: string;
      defaultValue?: string | number;
    }
  | {
      name: string;
      label: string;
      type: 'select';
      defaultValue?: string | number;
      options: Array<{ label: string; value: string }>;
    };

type AdminFilterBarProps = {
  pathname: string;
  fields: AdminFilterField[];
  hiddenFields?: Array<{ name: string; value: string | number }>;
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

export function PaginationSummary({ page, pageSize, totalItems, totalPages, pathname, params, label }: PaginationSummaryProps) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = totalItems === 0 ? 0 : Math.min(page * pageSize, totalItems);

  return (
    <section className="pagination-panel">
      <span>
        Mostrando {start}-{end} de {totalItems} {label}.
      </span>
      {pathname && params && totalPages && totalPages > 1 ? (
        <div className="pagination-links">
          <Link
            href={buildPathWithSearch(pathname, { ...params, page: Math.max(page - 1, 1) })}
            className={`pagination-link${page <= 1 ? ' pagination-link-disabled' : ''}`}
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : undefined}
          >
            Anterior
          </Link>
          <span className="panel-meta">
            Pagina {page} de {totalPages}
          </span>
          <Link
            href={buildPathWithSearch(pathname, { ...params, page: Math.min(page + 1, totalPages) })}
            className={`pagination-link${page >= totalPages ? ' pagination-link-disabled' : ''}`}
            aria-disabled={page >= totalPages}
            tabIndex={page >= totalPages ? -1 : undefined}
          >
            Proxima
          </Link>
        </div>
      ) : null}
    </section>
  );
}

export function AdminFilterBar({ pathname, fields, hiddenFields = [] }: AdminFilterBarProps) {
  return (
    <form className="toolbar" action={pathname}>
      {hiddenFields.map((field) => (
        <input key={`${field.name}-${field.value}`} type="hidden" name={field.name} value={String(field.value)} />
      ))}

      {fields.map((field) =>
        field.type === 'select' ? (
          <label key={field.name} className="toolbar-field">
            <span>{field.label}</span>
            <select name={field.name} defaultValue={String(field.defaultValue ?? '')} className="toolbar-input">
              <option value="">Todos</option>
              {field.options.map((option) => (
                <option key={`${field.name}-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label key={field.name} className="toolbar-field">
            <span>{field.label}</span>
            <input
              type={field.type ?? 'text'}
              name={field.name}
              placeholder={field.placeholder}
              defaultValue={field.defaultValue}
              className="toolbar-input"
            />
          </label>
        ),
      )}

      <button type="submit" className="primary-action">
        Filtrar
      </button>
    </form>
  );
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

export function buildPathWithSearch(pathname: string, params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}
