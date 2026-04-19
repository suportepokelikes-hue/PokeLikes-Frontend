import { createGuestSession } from '@/lib/auth/session';
import { PublicShell } from '@/modules/app-shell/public-shell';

export default function CatalogLoading() {
  return (
    <PublicShell session={createGuestSession()}>
      <main className="page page-public">
        <section className="section-header">
          <div>
            <p className="eyebrow">Catalogo publico</p>
            <h1>Carregando servicos...</h1>
          </div>
          <p className="section-copy">Buscando dados do backend para montar a vitrine publica.</p>
        </section>
        <section className="catalog-grid public-card-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="catalog-card skeleton-block" />
          ))}
        </section>
      </main>
    </PublicShell>
  );
}
