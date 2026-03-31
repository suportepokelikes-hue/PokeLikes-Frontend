import Link from 'next/link';
import { ArrowRight, Inbox } from 'lucide-react';

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({ title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <section className="feedback-panel">
      <div className="feedback-header">
        <div className="feedback-title-group">
          <span className="feedback-icon" aria-hidden="true">
            <Inbox size={18} strokeWidth={2.1} />
          </span>
          <p className="eyebrow">Sem resultados</p>
        </div>
        <span className="feedback-kicker">Estado vazio</span>
      </div>
      <h2>{title}</h2>
      <p className="section-copy">{description}</p>
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
