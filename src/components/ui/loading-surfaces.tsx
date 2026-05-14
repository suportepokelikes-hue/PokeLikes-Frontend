import { createGuestSession } from '@/lib/auth/session';
import { PublicShell } from '@/modules/app-shell/public-shell';

type PublicSurfaceLoadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  variant?: 'grid' | 'detail' | 'auth';
};

type AreaSurfaceLoadingProps = {
  area: 'customer' | 'admin';
  eyebrow: string;
  title: string;
  description?: string;
  metrics?: number;
  details?: number;
};

export function PublicSurfaceLoading({
  eyebrow,
  title,
  description,
  variant = 'grid',
}: PublicSurfaceLoadingProps) {
  return (
    <PublicShell session={createGuestSession()}>
      <main className="page page-public">
        <section className="section-header">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            {description ? <p className="section-copy">{description}</p> : null}
          </div>
        </section>

        {variant === 'auth' ? (
          <section className="auth-card">
            <div className="auth-hero skeleton-block" />
            <div className="auth-surface skeleton-block" />
          </section>
        ) : null}

        {variant === 'grid' ? (
          <section className="catalog-grid public-card-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="catalog-card skeleton-block" />
            ))}
          </section>
        ) : null}

        {variant === 'detail' ? (
          <>
            <section className="detail-card skeleton-block" />
            <section className="detail-card skeleton-block" />
          </>
        ) : null}
      </main>
    </PublicShell>
  );
}

export function AreaSurfaceLoading({
  area,
  eyebrow,
  title,
  description,
  metrics = 3,
  details = 1,
}: AreaSurfaceLoadingProps) {
  const showHeader = area === 'admin';

  return (
    <main className={`page page-${area}`}>
      {showHeader ? (
        <section className="section-header">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            {description ? <p className="section-copy">{description}</p> : null}
          </div>
        </section>
      ) : null}

      {metrics > 0 ? (
        <section className="metric-list">
          {Array.from({ length: metrics }).map((_, index) => (
            <div key={index} className="stat-card skeleton-block" />
          ))}
        </section>
      ) : null}

      {Array.from({ length: details }).map((_, index) => (
        <section key={index} className="detail-card skeleton-block" />
      ))}
    </main>
  );
}
