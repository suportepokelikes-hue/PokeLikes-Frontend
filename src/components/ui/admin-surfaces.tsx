import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

type AdminSectionCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

type AdminMetricCardProps = {
  label: string;
  value: string;
  meta?: string;
  icon: LucideIcon;
  tone?: 'default' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
};

type AdminQuickLinkCardProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  meta?: string;
  tone?: 'default' | 'warning' | 'danger';
};

export function AdminSectionCard({
  eyebrow,
  title,
  meta,
  actions,
  children,
  className,
}: AdminSectionCardProps) {
  return (
    <section className={`admin-section-card${className ? ` ${className}` : ''}`}>
      <div className="admin-section-card-head">
        <div className="admin-section-card-copy">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
        </div>
        {meta || actions ? (
          <div className="admin-section-card-meta">
            {meta ? <div className="admin-section-card-meta-node">{meta}</div> : null}
            {actions ? <div className="admin-section-card-actions">{actions}</div> : null}
          </div>
        ) : null}
      </div>
      <div className="admin-section-card-body">{children}</div>
    </section>
  );
}

export function AdminMetricCard({
  label,
  value,
  meta,
  icon: Icon,
  tone = 'default',
}: AdminMetricCardProps) {
  return (
    <article className={`admin-metric-card admin-metric-card-${tone}`}>
      <div className="admin-metric-card-head">
        <span className="admin-metric-card-icon" aria-hidden="true">
          <Icon size={18} strokeWidth={2.05} />
        </span>
        <span className="admin-metric-card-label">{label}</span>
      </div>
      <strong className="admin-metric-card-value">{value}</strong>
      {meta ? <p className="admin-metric-card-meta">{meta}</p> : null}
    </article>
  );
}

export function AdminQuickLinkCard({
  href,
  icon: Icon,
  title,
  meta,
  tone = 'default',
}: AdminQuickLinkCardProps) {
  return (
    <Link href={href} prefetch={false} className={`admin-quick-link admin-quick-link-${tone}`}>
      <div className="admin-quick-link-head">
        <span className="admin-quick-link-icon" aria-hidden="true">
          <Icon size={18} strokeWidth={2.05} />
        </span>
        {meta ? <span className="admin-quick-link-meta">{meta}</span> : null}
      </div>
      <strong>{title}</strong>
    </Link>
  );
}
