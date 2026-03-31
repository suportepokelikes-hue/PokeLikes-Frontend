import Image from 'next/image';
import { ArrowRight, CreditCard, LayoutDashboard, ShieldCheck, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

import type { SessionState } from '@/lib/auth/session';
import { getPublicEnv } from '@/lib/config/env';
import { LogoutButton } from '@/modules/auth/logout-button';
import { getSessionLabel, type ShellLink, type ShellMetric } from '@/modules/app-shell/shared';

type PublicHomeProps = {
  session: SessionState;
};

const publicLinks: ShellLink[] = [
  {
    href: '/catalog',
    label: 'Catalogo',
    description: 'Servicos publicos com status e disponibilidade.',
  },
  {
    href: '/',
    label: 'Area publica',
    description: 'Entrada para catalogo, login e cadastro.',
  },
  {
    href: '/app',
    label: 'Area do cliente',
    description: 'Saldo, pagamentos e pedidos.',
  },
  {
    href: '/admin',
    label: 'Area admin',
    description: 'Operacao, monitoramento e controle.',
  },
];

export function PublicHome({ session }: PublicHomeProps) {
  const { apiBaseUrl, appName } = getPublicEnv();
  const primaryHref = session.status === 'authenticated' ? (session.user.role === 'admin' ? '/admin' : '/app') : '/login';
  const primaryLabel = session.status === 'authenticated' ? 'Continuar sessao' : 'Entrar';
  const metrics: ShellMetric[] = [
    { label: 'Catalogo', value: 'Disponivel' },
    { label: 'Base da API', value: apiBaseUrl },
    {
      label: 'Sessao',
      value: getSessionLabel(session),
      tone: session.status === 'authenticated' ? 'success' : 'warning',
    },
  ];

  return (
    <main className="page page-public">
      <section className="hero public-hero">
        <div className="hero-copy">
          <div className="public-brand-lockup">
            <div className="public-brand-logo">
              <Image src="/brand/logo.jpeg" alt="Likes Uai" width={84} height={84} className="public-brand-logo-image" priority />
            </div>
            <div>
              <p className="eyebrow">Likes Uai Platform</p>
            </div>
          </div>
          <h1>{appName} para comprar, acompanhar pedidos e operar o painel.</h1>
          <p className="lede">Entre, explore o catalogo e siga para a area certa sem perder o contexto.</p>

          <div className="public-hero-actions">
            <Link href={primaryHref} className="primary-action">
              <ArrowRight size={16} strokeWidth={2.15} aria-hidden="true" />
              {primaryLabel}
            </Link>
            {session.status === 'guest' ? (
              <Link href="/register" className="secondary-action">
                <LayoutDashboard size={16} strokeWidth={2.15} aria-hidden="true" />
                Criar conta
              </Link>
            ) : (
              <LogoutButton />
            )}
            <Link href="/catalog" className="secondary-action">
              <ShoppingBag size={16} strokeWidth={2.15} aria-hidden="true" />
              Ver catalogo
            </Link>
          </div>

        </div>

        <div className="status-panel">
          <p className="status-title">Estado atual</p>
          <div className="metric-list">
            {metrics.map((metric) => (
              <article key={metric.label} className={`metric-card metric-${metric.tone ?? 'default'}`}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-bento">
        <article className="public-bento-card">
          <span className="surface-icon" aria-hidden="true">
            <ShoppingBag size={18} strokeWidth={2.1} />
          </span>
          <span>Catalogo</span>
          <strong>Servicos e disponibilidade</strong>
          <p>Veja o que esta disponivel antes de comprar.</p>
        </article>
        <article className="public-bento-card">
          <span className="surface-icon" aria-hidden="true">
            <CreditCard size={18} strokeWidth={2.1} />
          </span>
          <span>Cliente</span>
          <strong>Saldo, PIX e pedidos</strong>
          <p>Acompanhe pagamentos e pedidos no mesmo lugar.</p>
        </article>
        <article className="public-bento-card">
          <span className="surface-icon" aria-hidden="true">
            <ShieldCheck size={18} strokeWidth={2.1} />
          </span>
          <span>Admin</span>
          <strong>Operacao e controle</strong>
          <p>Monitore pagamentos, pedidos, alertas e usuarios.</p>
        </article>
      </section>

      <section className="card-grid">
        {publicLinks.map((item) => (
          <Link key={item.href} href={item.href} className="nav-card">
            <span>{item.label}</span>
            <strong>{item.href}</strong>
            <p>{item.description}</p>
            <span className="panel-link">
              Abrir area <ArrowRight size={14} strokeWidth={2.15} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
