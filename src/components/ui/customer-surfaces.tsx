import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

type CustomerSectionCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

type CustomerMetricCardProps = {
  label: string;
  value: string;
  meta?: string;
  icon: LucideIcon;
  tone?: 'default' | 'accent' | 'info' | 'success' | 'warning';
};

type CustomerQuickActionCardProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  meta?: string;
  tone?: 'default' | 'accent';
};

export function CustomerSectionCard({
  eyebrow,
  title,
  description,
  meta,
  actions,
  children,
  className,
}: CustomerSectionCardProps) {
  return (
    <section className={`customer-section-card${className ? ` ${className}` : ''}`}>
      <div className="customer-section-card-head">
        <div className="customer-section-card-copy">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {meta || actions ? (
          <div className="customer-section-card-meta">
            {meta ? <div className="customer-section-card-meta-node">{meta}</div> : null}
            {actions ? <div className="customer-section-card-actions">{actions}</div> : null}
          </div>
        ) : null}
      </div>
      <div className="customer-section-card-body">{children}</div>
    </section>
  );
}

export function CustomerMetricCard({
  label,
  value,
  meta,
  icon: Icon,
  tone = 'default',
}: CustomerMetricCardProps) {
  return (
    <article className={`customer-metric-card customer-metric-card-${tone}`}>
      <div className="customer-metric-card-head">
        <span className="customer-metric-card-icon" aria-hidden="true">
          <Icon size={18} strokeWidth={2.05} />
        </span>
        <span className="customer-metric-card-label">{label}</span>
      </div>
      <strong className="customer-metric-card-value">{value}</strong>
      {meta ? <p className="customer-metric-card-meta">{meta}</p> : null}
    </article>
  );
}

export function CustomerQuickActionCard({
  href,
  icon: Icon,
  title,
  description,
  meta,
  tone = 'default',
}: CustomerQuickActionCardProps) {
  return (
    <Link href={href} prefetch={false} className={`customer-quick-action customer-quick-action-${tone}`}>
      <div className="customer-quick-action-head">
        <span className="customer-quick-action-icon" aria-hidden="true">
          <Icon size={18} strokeWidth={2.05} />
        </span>
        {meta ? <span className="customer-quick-action-meta">{meta}</span> : null}
      </div>
      <strong>{title}</strong>
      <p>{description}</p>
    </Link>
  );
}
