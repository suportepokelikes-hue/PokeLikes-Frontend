export default function AdminLoading() {
  return (
    <main className="page page-admin">
      <section className="section-header">
        <div>
          <p className="eyebrow">Admin / carregando</p>
          <h1>Carregando operacao administrativa.</h1>
          <p className="section-copy">Aguarde enquanto consultamos a API administrativa.</p>
        </div>
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
