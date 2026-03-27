import Link from 'next/link';

import type { UserSummary } from '@/lib/api/contracts';
import type { ShellMetric } from '@/modules/app-shell/shared';

type AdminHomeProps = {
  user: UserSummary;
};

const adminMetrics = (user: UserSummary): ShellMetric[] => [
  { label: 'Operador', value: user.name },
  { label: 'Papel', value: user.role, tone: 'success' },
  { label: 'Foco inicial', value: 'observabilidade e modulos operacionais', tone: 'warning' },
];

const adminLinks = [
  {
    href: '/admin/catalog',
    label: 'Catalogo',
    description: 'Preco publico, disponibilidade e acoplamento com o servico do fornecedor.',
  },
  {
    href: '/admin/orders',
    label: 'Pedidos',
    description: 'Entrada para sincronizacao, auditoria e tratamento operacional.',
  },
  {
    href: '/admin/payments',
    label: 'Pagamentos',
    description: 'Base para conciliacao e leitura de estados assincronos do PIX.',
  },
  {
    href: '/admin/supplier',
    label: 'Fornecedores',
    description: 'Status operacional, servicos sincronizados e logs tecnicos.',
  },
  {
    href: '/admin/alerts',
    label: 'Alertas',
    description: 'Fila priorizada de ocorrencias abertas e resolvidas.',
  },
  {
    href: '/admin/audits',
    label: 'Auditoria',
    description: 'Rastro de acoes administrativas com payload resumido.',
  },
  {
    href: '/admin/transactions',
    label: 'Transacoes',
    description: 'Ledger financeiro com creditos, debitos e referencias.',
  },
  {
    href: '/admin/users',
    label: 'Usuarios',
    description: 'Cadastro, status e governanca de acesso administrativo.',
  },
];

export function AdminHome({ user }: AdminHomeProps) {
  const metrics = adminMetrics(user);

  return (
    <main className="page page-admin">
      <section className="section-header">
        <div>
          <p className="eyebrow">Admin operacional</p>
          <h1>Painel preparado para observabilidade e fluxo administrativo.</h1>
        </div>
        <p className="section-copy">
          A fundacao do admin prioriza densidade informacional, separacao clara de escopo e guardas por papel
          antes das telas de negocio completas.
        </p>
      </section>

      <section className="metric-list">
        {metrics.map((metric) => (
          <article key={metric.label} className={`metric-card metric-${metric.tone ?? 'default'}`}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="card-grid compact-grid">
        {adminLinks.map((item) => (
          <Link key={item.href} href={item.href} className="nav-card">
            <span>{item.label}</span>
            <strong>{item.href}</strong>
            <p>{item.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
