import { ArrowRight, Bell, FolderKanban, ReceiptText, ShieldCheck, Users } from 'lucide-react';
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
      <section className="admin-command-grid">
        <article className="admin-command-card">
          <p className="eyebrow">Admin operacional</p>
          <h1>Painel preparado para observabilidade e fluxo administrativo.</h1>
          <p className="section-copy">
            O shell admin agora segue a referencia dominante do Stitch: navegação lateral fixa, topo leve e blocos
            editoriais antes da camada de tabela e mutacao.
          </p>
        </article>
        <article className="admin-command-card admin-command-card-muted">
          <div className="customer-mini-list">
            <div>
              <span>Operador</span>
              <strong>{user.name}</strong>
            </div>
            <div>
              <span>Papel</span>
              <strong>{user.role}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{user.status}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="journey-grid">
        <article className="journey-card">
          <p className="eyebrow">Modo de leitura</p>
          <h2>Operacao primeiro, modulos depois.</h2>
          <p className="section-copy">
            A entrada do admin deixa claro onde ficam risco operacional, monitoramento, conciliacao e governanca sem
            cair numa home genérica de cards iguais.
          </p>
        </article>
        <article className="journey-card">
          <ol className="journey-steps">
            <li>
              <strong>1. Monitorar</strong>
              <span>Alertas, pagamentos e pedidos concentram o ritmo operacional do dia.</span>
            </li>
            <li>
              <strong>2. Corrigir</strong>
              <span>Usuarios, catalogo e carteira suportam mutacoes reais conectadas ao backend.</span>
            </li>
            <li>
              <strong>3. Auditar</strong>
              <span>Auditoria, fornecedores e transacoes fecham o contexto de governanca.</span>
            </li>
          </ol>
        </article>
      </section>

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
