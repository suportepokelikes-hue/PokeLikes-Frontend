import Link from 'next/link';

type ErrorStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function ErrorState({ title, description, actionHref, actionLabel }: ErrorStateProps) {
  return (
    <section className="feedback-panel feedback-error">
      <div className="feedback-header">
        <p className="eyebrow">Erro de integracao</p>
        <span className="feedback-kicker">Estado de erro</span>
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
