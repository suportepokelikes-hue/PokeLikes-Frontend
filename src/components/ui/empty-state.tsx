type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="feedback-panel">
      <p className="eyebrow">Sem resultados</p>
      <h2>{title}</h2>
      <p className="section-copy">{description}</p>
    </section>
  );
}
