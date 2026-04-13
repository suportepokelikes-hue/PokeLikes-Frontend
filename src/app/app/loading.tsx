export default function CustomerLoading() {
  return (
    <main className="page page-customer">
      <section className="section-header">
        <div>
          <p className="eyebrow">Cliente / carregando</p>
          <h1>Carregando area do cliente.</h1>
          <p className="section-copy">Buscando saldo, pagamentos e pedidos.</p>
        </div>
      </section>

      <section className="customer-hero-grid">
        <div className="customer-spotlight skeleton-block" />
        <div className="customer-note-card skeleton-block" />
      </section>

      <section className="metric-list">
        <div className="stat-card skeleton-block" />
        <div className="stat-card skeleton-block" />
        <div className="stat-card skeleton-block" />
      </section>

      <section className="detail-card skeleton-block" />
    </main>
  );
}
