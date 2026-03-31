import { ArrowRight, Bell, FolderKanban, ReceiptText, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/ui/page-header';
import type { UserSummary } from '@/lib/api/contracts';
import type { ShellMetric } from '@/modules/app-shell/shared';

type AdminHomeProps = {
  user: UserSummary;
};

const adminMetrics = (user: UserSummary): ShellMetric[] => [
  { label: 'Operador', value: user.name },
  { label: 'Papel', value: user.role, tone: 'success' },
  { label: 'Status', value: user.status, tone: 'warning' },
];

const adminLinks = [
  {
    href: '/admin/catalog',
    label: 'Catalogo',
    description: 'Servicos, precos e disponibilidade.',
  },
  {
    href: '/admin/orders',
    label: 'Pedidos',
    description: 'Acompanhar e sincronizar pedidos.',
  },
  {
    href: '/admin/payments',
    label: 'Pagamentos',
    description: 'Conferir e conciliar pagamentos.',
  },
  {
    href: '/admin/supplier',
    label: 'Fornecedores',
    description: 'Status e sincronizacao de fornecedores.',
  },
  {
    href: '/admin/alerts',
    label: 'Alertas',
    description: 'Ocorrencias abertas e resolvidas.',
  },
  {
    href: '/admin/audits',
    label: 'Auditoria',
    description: 'Historico de acoes administrativas.',
  },
  {
    href: '/admin/transactions',
    label: 'Transacoes',
    description: 'Lancamentos e movimentacoes.',
  },
  {
    href: '/admin/users',
    label: 'Usuarios',
    description: 'Cadastro e permissao de usuarios.',
  },
];

export function AdminHome({ user }: AdminHomeProps) {
  const metrics = adminMetrics(user);

  return (
    <main className="page page-admin">
      <PageHeader eyebrow="Admin" title="Visão geral" description={`Olá, ${user.name}.`} />

      <section className="metric-list">
        {metrics.map((metric) => (
          <article key={metric.label} className={`metric-card metric-${metric.tone ?? 'default'}`}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-link-grid">
        {adminLinks.map((item) => (
          <Link key={item.href} href={item.href} className="nav-card">
            <span className="surface-icon" aria-hidden="true">
              {item.href === '/admin/catalog' ? (
                <FolderKanban size={18} strokeWidth={2.1} />
              ) : item.href === '/admin/orders' ? (
                <ReceiptText size={18} strokeWidth={2.1} />
              ) : item.href === '/admin/alerts' ? (
                <Bell size={18} strokeWidth={2.1} />
              ) : item.href === '/admin/users' ? (
                <Users size={18} strokeWidth={2.1} />
              ) : (
                <ShieldCheck size={18} strokeWidth={2.1} />
              )}
            </span>
            <span>{item.label}</span>
            <strong>{item.href}</strong>
            <p>{item.description}</p>
            <span className="panel-link">
              Abrir modulo <ArrowRight size={14} strokeWidth={2.15} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
