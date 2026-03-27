type StatCardProps = {
  label: string;
  value: string;
  meta?: string;
  tone?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
};

export function StatCard({ label, value, meta, tone = 'default' }: StatCardProps) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {meta ? <p>{meta}</p> : null}
    </article>
  );
}
