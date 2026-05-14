import Link from 'next/link';

import type { UserSummary } from '@/lib/api/contracts';
import type { ShellMetric } from '@/modules/app-shell/shared';

type CustomerHomeProps = {
  user: UserSummary;
};

const customerMetrics = (user: UserSummary): ShellMetric[] => [
  { label: 'Sessao', value: user.status, tone: 'success' },
  { label: 'Responsavel', value: user.name },
  { label: 'Escopo', value: 'wallet, PIX e pedidos' },
];

const customerLinks = [
  {
    href: '/app/wallet',
    label: 'Wallet',
    description: 'Saldo, extrato e futuras recargas PIX saem deste shell.',
  },
  {
    href: '/app/payments',
    label: 'Pagamentos',
    description: 'Area preparada para ciclos assincronos de criacao e confirmacao de PIX.',
  },
  {
    href: '/app/orders',
    label: 'Pedidos',
    description: 'Ponto de entrada para acompanhamento dos pedidos do cliente.',
  },
];

export function CustomerHome({ user }: CustomerHomeProps) {
  const metrics = customerMetrics(user);

  return (
    <main className="page page-customer">
      <section className="metric-list">
        {metrics.map((metric) => (
          <article key={metric.label} className={`metric-card metric-${metric.tone ?? 'default'}`}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="card-grid compact-grid">
        {customerLinks.map((item) => (
          <Link key={item.href} href={item.href} prefetch={false} className="nav-card">
            <span>{item.label}</span>
            <strong>{item.href}</strong>
            <p>{item.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
