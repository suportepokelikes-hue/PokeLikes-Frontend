type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  compact?: boolean;
};

export function PageHeader({ eyebrow, title, description, actions, compact = false }: PageHeaderProps) {
  const isCompact = compact || !description;

  return (
    <section className={`section-header${isCompact ? ' section-header-compact' : ''}`}>
      <div className="section-header-copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </section>
  );
}
