import Link from 'next/link';
import { ArrowRight, Inbox } from 'lucide-react';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({ title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <section className="feedback-panel feedback-panel-compact">
      <span className="feedback-kicker">Sem resultados</span>
      <div className="feedback-header">
        <div className="feedback-title-group">
          <span className="feedback-icon" aria-hidden="true">
            <Inbox size={18} strokeWidth={2.1} />
          </span>
          <h2>{title}</h2>
        </div>
      </div>
      {description ? <p className="section-copy feedback-copy">{description}</p> : null}
      {actionHref && actionLabel ? (
        <div className="feedback-actions">
          <Link href={actionHref} className="secondary-action">
            <ArrowRight size={16} strokeWidth={2.15} aria-hidden="true" />
            {actionLabel}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
