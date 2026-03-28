import Link from 'next/link';

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
        <p className="eyebrow">Sem resultados</p>
        <span className="feedback-kicker">Estado vazio</span>
      </div>
      <h2>{title}</h2>
      <p className="section-copy">{description}</p>
      {actionHref && actionLabel ? (
        <div className="feedback-actions">
          <Link href={actionHref} className="secondary-action">
            {actionLabel}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
