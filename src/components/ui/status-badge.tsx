type StatusBadgeProps = {
  label: string;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
};

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-${tone}`}>
      <span className="status-badge-dot" aria-hidden="true" />
      <span className="status-badge-label">{label}</span>
    </span>
  );
}
