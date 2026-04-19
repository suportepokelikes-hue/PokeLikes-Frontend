import Link from 'next/link';
import { ArrowRight, TriangleAlert } from 'lucide-react';

type ErrorStateProps = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function ErrorState({ title, description, actionHref, actionLabel }: ErrorStateProps) {
  return (
    <section className="feedback-panel feedback-error feedback-panel-compact">
      <span className="feedback-kicker">Atencao</span>
      <div className="feedback-header">
        <div className="feedback-title-group">
          <span className="feedback-icon feedback-icon-danger" aria-hidden="true">
            <TriangleAlert size={18} strokeWidth={2.1} />
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
