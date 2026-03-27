type ErrorStateProps = {
  title: string;
  description: string;
};

export function ErrorState({ title, description }: ErrorStateProps) {
  return (
    <section className="feedback-panel feedback-error">
      <p className="eyebrow">Erro de integracao</p>
      <h2>{title}</h2>
      <p className="section-copy">{description}</p>
    </section>
  );
}
