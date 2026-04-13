import Image from 'next/image';
import { ArrowRight, BadgeCheck, CreditCard, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import Link from 'next/link';

import type { SessionState } from '@/lib/auth/session';
import { getPublicEnv } from '@/lib/config/env';
import { LogoutButton } from '@/modules/auth/logout-button';

type PublicHomeProps = {
  session: SessionState;
};

const platformHighlights = [
  {
    title: 'Escolha rapido',
    description: 'Preco, faixa e status antes do clique.',
    icon: Sparkles,
  },
  {
    title: 'PIX direto',
    description: 'Gere, pague e acompanhe na conta.',
    icon: CreditCard,
  },
  {
    title: 'Tudo na mesma area',
    description: 'Saldo, pagamentos e pedidos no mesmo fluxo.',
    icon: Wallet,
  },
  {
    title: 'Operacao no controle',
    description: 'Pedidos, pagamentos e fornecedores no admin.',
    icon: ShieldCheck,
  },
] as const;

const howItWorks = [
  {
    step: '01',
    title: 'Escolha o servico',
    description: 'Compare preco, faixa e disponibilidade.',
  },
  {
    step: '02',
    title: 'Adicione saldo por PIX',
    description: 'Pague por QR code ou copia e cola.',
  },
  {
    step: '03',
    title: 'Acompanhe seus pedidos',
    description: 'Veja status e historico na sua conta.',
  },
] as const;

const trustPoints = [
  'PIX com QR code',
  'Status visivel no catalogo',
  'Pedidos e saldo na mesma conta',
  'Painel admin separado',
] as const;

export function PublicHome({ session }: PublicHomeProps) {
  const { appName } = getPublicEnv();
  const accountHref = session.status === 'authenticated' ? (session.user.role === 'admin' ? '/admin' : '/app') : '/register';
  const accountLabel = session.status === 'authenticated' ? 'Abrir minha area' : 'Criar conta';
  const sessionMessage =
    session.status === 'authenticated'
      ? `Sessao ativa como ${session.user.role === 'admin' ? 'admin' : 'cliente'}.`
      : 'Conta pronta para comprar.';

  return (
    <main className="page page-public landing-page">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="public-brand-lockup">
            <div className="public-brand-logo">
              <Image src="/brand/logo.jpeg" alt="Likes Uai" width={84} height={84} className="public-brand-logo-image" priority />
            </div>
            <div>
              <p className="eyebrow">Likes Uai</p>
              <strong className="landing-kicker">Catalogo, PIX e pedidos no mesmo fluxo.</strong>
            </div>
          </div>

          <h1>Compre servicos digitais sem perder tempo.</h1>
          <p className="lede">{appName} junta catalogo, saldo e pedidos com status claro.</p>

          <div className="landing-actions">
            <Link href="/catalog" className="primary-action">
              Ver catalogo
              <ArrowRight size={16} strokeWidth={2.15} aria-hidden="true" />
            </Link>
            <Link href={accountHref} className="secondary-action">
              {accountLabel}
            </Link>
            {session.status === 'authenticated' ? <LogoutButton /> : <Link href="/login" className="secondary-action">Entrar</Link>}
          </div>

          <div className="landing-proof-inline">
            {trustPoints.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <aside className="landing-hero-panel">
          <div className="landing-panel-card landing-panel-primary">
            <span className="eyebrow">Decisao rapida</span>
            <h2>Preco, faixa e disponibilidade sem rodeio.</h2>
            <p>Voce chega ao essencial antes do checkout.</p>
          </div>

          <div className="landing-panel-card landing-panel-secondary">
            <span className="eyebrow">Sua entrada</span>
            <strong>{sessionMessage}</strong>
            <p>Abra o catalogo ou siga para a sua area.</p>
          </div>
        </aside>
      </section>

      <section className="landing-section">
        <div className="landing-section-head">
          <p className="eyebrow">Beneficios</p>
          <h2>O que importa para decidir.</h2>
        </div>

        <div className="landing-grid landing-grid-four">
          {platformHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="landing-card">
                <span className="surface-icon" aria-hidden="true">
                  <Icon size={18} strokeWidth={2.1} />
                </span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-showcase">
        <article className="landing-spotlight">
          <p className="eyebrow">Como funciona</p>
          <h2>Do catalogo ao pedido em tres passos.</h2>
          <p>Escolha, pague e acompanhe.</p>
        </article>

        <div className="landing-steps">
          {howItWorks.map((item) => (
            <article key={item.step} className="landing-step-card">
              <span>{item.step}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta-banner">
        <div>
          <p className="eyebrow">Comece agora</p>
          <h2>Abra o catalogo e va direto ao que interessa.</h2>
          <p>Quando quiser comprar, a conta e o PIX entram no fluxo.</p>
        </div>
        <div className="landing-actions">
          <Link href="/catalog" className="primary-action">
            Explorar servicos
          </Link>
          <Link href={accountHref} className="secondary-action">
            <BadgeCheck size={16} strokeWidth={2.15} aria-hidden="true" />
            {accountLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
