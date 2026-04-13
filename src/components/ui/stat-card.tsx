type StatCardProps = {
  label: string;
  value: string;
  meta?: string;
  tone?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
};

export function StatCard({ label, value, meta, tone = 'default' }: StatCardProps) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <span className="stat-card-label">{label}</span>
      <strong className="stat-card-value">{value}</strong>
      {meta ? <p className="stat-card-meta">{meta}</p> : null}
    </article>
  );
}
