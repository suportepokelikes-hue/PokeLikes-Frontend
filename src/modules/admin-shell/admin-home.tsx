import { ArrowRight, Bell, FolderKanban, ReceiptText, ShieldCheck, Users, Wallet } from 'lucide-react';
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
  { label: 'Status', value: user.status, tone: user.status === 'active' ? 'success' : 'warning' },
];

const priorityLinks = [
  { href: '/admin/alerts', label: 'Alertas', description: 'Ver o que exige acao agora.', icon: Bell },
  { href: '/admin/orders', label: 'Pedidos', description: 'Acompanhar e sincronizar pedidos.', icon: ReceiptText },
  { href: '/admin/payments', label: 'Pagamentos', description: 'Conferir e conciliar pagamentos.', icon: Wallet },
  { href: '/admin/users', label: 'Usuarios', description: 'Criar e atualizar acessos.', icon: Users },
];

const adminLinks = [
  { href: '/admin/catalog', label: 'Catalogo', description: 'Servicos, precos e disponibilidade.', icon: FolderKanban },
  { href: '/admin/supplier', label: 'Fornecedores', description: 'Status e sincronizacao de fornecedores.', icon: ShieldCheck },
  { href: '/admin/audits', label: 'Auditoria', description: 'Historico de acoes administrativas.', icon: ShieldCheck },
  { href: '/admin/transactions', label: 'Transacoes', description: 'Lancamentos e movimentacoes.', icon: Wallet },
];

export function AdminHome({ user }: AdminHomeProps) {
  const metrics = adminMetrics(user);

  return (
    <main className="page page-admin">
      <PageHeader
        eyebrow="Admin"
        title="Visao geral"
        description={`Ola, ${user.name}. Comece pelo que precisa de acao agora.`}
        actions={
          <>
            <Link href="/admin/alerts" className="primary-action">
              Ver alertas
            </Link>
            <Link href="/admin/orders" className="secondary-action">
              Ver pedidos
            </Link>
          </>
        }
      />

      <section className="metric-list">
        {metrics.map((metric) => (
          <article key={metric.label} className={`metric-card metric-${metric.tone ?? 'default'}`}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-link-grid">
        {priorityLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="nav-card">
              <span className="surface-icon" aria-hidden="true">
                <Icon size={18} strokeWidth={2.1} />
              </span>
              <span>Prioridade</span>
              <strong>{item.label}</strong>
              <p>{item.description}</p>
              <span className="panel-link">
                Abrir modulo <ArrowRight size={14} strokeWidth={2.15} aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </section>

      <section className="admin-link-grid">
        {adminLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="nav-card">
              <span className="surface-icon" aria-hidden="true">
                <Icon size={18} strokeWidth={2.1} />
              </span>
              <span>Modulo</span>
              <strong>{item.label}</strong>
              <p>{item.description}</p>
              <span className="panel-link">
                Abrir modulo <ArrowRight size={14} strokeWidth={2.15} aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
