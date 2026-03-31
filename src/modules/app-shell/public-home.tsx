import Image from 'next/image';
import { ArrowRight, CreditCard, ShieldCheck, ShoppingBag, UserRound } from 'lucide-react';
import Link from 'next/link';

import type { SessionState } from '@/lib/auth/session';
import { getPublicEnv } from '@/lib/config/env';
import { LogoutButton } from '@/modules/auth/logout-button';
import { getSessionLabel, type ShellMetric } from '@/modules/app-shell/shared';

type PublicHomeProps = {
  session: SessionState;
};

export function PublicHome({ session }: PublicHomeProps) {
  const { appName } = getPublicEnv();
  const accountHref = session.status === 'authenticated' ? (session.user.role === 'admin' ? '/admin' : '/app') : '/login';
  const accountLabel = session.status === 'authenticated' ? 'Ir para minha area' : 'Entrar';
  const metrics: ShellMetric[] = [
    { label: 'Catalogo', value: 'Disponivel' },
    { label: 'Compra', value: 'Rapida' },
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
              <p className="eyebrow">Likes Uai</p>
            </div>
          </div>
          <h1>{appName} para comprar servicos, acompanhar pedidos e operar o painel.</h1>
          <p className="lede">Comece pelo catalogo, entre na sua conta e siga para a area certa sem perder o contexto.</p>

          <div className="public-hero-actions">
            <Link href="/catalog" className="primary-action">
              <ShoppingBag size={16} strokeWidth={2.15} aria-hidden="true" />
              Ver catalogo
            </Link>
            <Link href={accountHref} className="secondary-action">
              <UserRound size={16} strokeWidth={2.15} aria-hidden="true" />
              {accountLabel}
            </Link>
            {session.status === 'guest' ? (
              <Link href="/register" className="secondary-action">
                <ArrowRight size={16} strokeWidth={2.15} aria-hidden="true" />
                Criar conta
              </Link>
            ) : (
              <LogoutButton />
            )}
          </div>
        </div>

        <div className="status-panel">
          <p className="status-title">Comece por aqui</p>
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
          <strong>Escolha o servico</strong>
          <p>Veja o que esta disponivel antes de comprar.</p>
        </article>
        <article className="public-bento-card">
          <span className="surface-icon" aria-hidden="true">
            <CreditCard size={18} strokeWidth={2.1} />
          </span>
          <span>Cliente</span>
          <strong>Pague e acompanhe</strong>
          <p>Veja saldo, PIX e pedidos no mesmo lugar.</p>
        </article>
        <article className="public-bento-card">
          <span className="surface-icon" aria-hidden="true">
            <ShieldCheck size={18} strokeWidth={2.1} />
          </span>
          <span>Admin</span>
          <strong>Monitore a operacao</strong>
          <p>Acompanhe pagamentos, pedidos, alertas e usuarios.</p>
        </article>
      </section>

      <section className="card-grid">
        <Link href="/catalog" className="nav-card">
          <span>Catalogo</span>
          <strong>Explorar servicos</strong>
          <p>Veja disponibilidade, preco e faixa de compra.</p>
          <span className="panel-link">
            Abrir catalogo <ArrowRight size={14} strokeWidth={2.15} aria-hidden="true" />
          </span>
        </Link>

        <Link href="/app" className="nav-card">
          <span>Cliente</span>
          <strong>Minha conta</strong>
          <p>Consulte saldo, pagamentos e pedidos.</p>
          <span className="panel-link">
            Abrir area do cliente <ArrowRight size={14} strokeWidth={2.15} aria-hidden="true" />
          </span>
        </Link>

        <Link href="/admin" className="nav-card">
          <span>Admin</span>
          <strong>Painel operacional</strong>
          <p>Controle pagamentos, pedidos, alertas e usuarios.</p>
          <span className="panel-link">
            Abrir admin <ArrowRight size={14} strokeWidth={2.15} aria-hidden="true" />
          </span>
        </Link>
      </section>
    </main>
  );
}
