import { ArrowRight, Bell, FolderKanban, Gift, ReceiptText, ShieldCheck, Users, Wallet } from 'lucide-react';
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
  { href: '/admin/alerts', label: 'Alertas', description: 'Pendencias agora.', icon: Bell },
  { href: '/admin/orders', label: 'Pedidos', description: 'Fila e sync.', icon: ReceiptText },
  { href: '/admin/payments', label: 'Pagamentos', description: 'Conciliacao.', icon: Wallet },
  { href: '/admin/users', label: 'Usuarios', description: 'Acesso e status.', icon: Users },
];

const adminLinks = [
  { href: '/admin/affiliates', label: 'Afiliados', description: 'Perfis e status.', icon: Gift },
  { href: '/admin/affiliate-commissions', label: 'Comissoes afiliados', description: 'Valores e payout.', icon: ReceiptText },
  { href: '/admin/affiliate-payouts', label: 'Payouts afiliados', description: 'Registro e historico.', icon: Wallet },
  { href: '/admin/catalog', label: 'Catalogo', description: 'Publicacao e afiliacao.', icon: FolderKanban },
  { href: '/admin/supplier', label: 'Fornecedores', description: 'Status e sync.', icon: ShieldCheck },
  { href: '/admin/audits', label: 'Auditoria', description: 'Rastro admin.', icon: ShieldCheck },
  { href: '/admin/transactions', label: 'Transacoes', description: 'Ledger e ajustes.', icon: Wallet },
];

export function AdminHome({ user }: AdminHomeProps) {
  const metrics = adminMetrics(user);

  return (
    <main className="page page-admin">
      <PageHeader
        eyebrow="Admin"
        title="Painel admin"
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
                Abrir <ArrowRight size={14} strokeWidth={2.15} aria-hidden="true" />
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
                Abrir <ArrowRight size={14} strokeWidth={2.15} aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
