import Link from 'next/link';
import { ArrowRight, CreditCard, FolderKanban, Search, Sparkles } from 'lucide-react';

import { getPublicEnv } from '@/lib/config/env';
import type { SessionState } from '@/lib/auth/session';
import { PublicShell } from '@/modules/app-shell/public-shell';

type PublicHomeProps = {
  session: SessionState;
};

const howItWorks = [
  {
    step: '01',
    title: 'Crie sua conta',
    icon: Sparkles,
  },
  {
    step: '02',
    title: 'Recarregue via Pix',
    icon: CreditCard,
  },
  {
    step: '03',
    title: 'Escolha um servico',
    icon: Search,
  },
  {
    step: '04',
    title: 'Acompanhe pedidos',
    icon: FolderKanban,
  },
] as const;

const serviceCards = [
  { title: 'Instagram', href: '/catalog?socialNetwork=instagram' },
  { title: 'TikTok', href: '/catalog?socialNetwork=tiktok' },
  { title: 'YouTube', href: '/catalog?socialNetwork=youtube' },
  { title: 'Telegram', href: '/catalog?socialNetwork=telegram' },
  { title: 'Facebook', href: '/catalog?socialNetwork=facebook' },
  { title: 'Catalogo completo', href: '/catalog' },
] as const;

function getAccountHref(session: SessionState) {
  if (session.status !== 'authenticated') {
    return '/register';
  }

  return session.user.role === 'admin' ? '/admin' : '/app';
}

function getAccountLabel(session: SessionState) {
  if (session.status !== 'authenticated') {
    return 'Criar conta';
  }

  return session.user.role === 'admin' ? 'Abrir admin' : 'Abrir minha area';
}

function getSessionAccent(session: SessionState) {
  if (session.status !== 'authenticated') {
    return 'Conta pronta';
  }

  return session.user.role === 'admin' ? 'Admin conectado' : 'Conta conectada';
}

export function PublicHome({ session }: PublicHomeProps) {
  const { appName } = getPublicEnv();
  const accountHref = getAccountHref(session);
  const accountLabel = getAccountLabel(session);
  const sessionAccent = getSessionAccent(session);

  return (
    <PublicShell session={session}>
      <main className="page page-public pokelike-landing">
        <section className="pokelike-hero">
          <div className="pokelike-hero-copy">
            <div className="pokelike-hero-intro">
              <span className="pokelike-pill pokelike-pill-brand">
                <Sparkles size={14} strokeWidth={2.1} aria-hidden="true" />
                {appName}
              </span>
            </div>

            <div className="pokelike-hero-headline">
              <h1>Servicos digitais sem excesso.</h1>
              <p className="lede">Catalogo, Pix e pedidos em uma leitura so.</p>
            </div>

            <div className="pokelike-hero-actions">
              <Link href={accountHref} className="primary-action">
                {accountLabel}
                <ArrowRight size={16} strokeWidth={2.15} aria-hidden="true" />
              </Link>
              <Link href="/catalog" className="secondary-action">
                Ver servicos
              </Link>
            </div>
          </div>

          <aside className="pokelike-hero-visual" aria-label={`Resumo da ${appName}`}>
            <div className="pokelike-hero-stage">
              <article className="pokelike-hero-window">
                <div className="pokelike-hero-window-grid">
                  <div className="pokelike-hero-window-card pokelike-hero-window-card-accent">
                    <span>Conta</span>
                    <strong>{sessionAccent}</strong>
                  </div>
                  <div className="pokelike-hero-window-card">
                    <span>Pix</span>
                    <strong>Recarregue</strong>
                  </div>
                  <div className="pokelike-hero-window-card">
                    <span>Catalogo</span>
                    <strong>Escolha</strong>
                  </div>
                  <div className="pokelike-hero-window-card">
                    <span>Pedidos</span>
                    <strong>Acompanhe</strong>
                  </div>
                </div>
              </article>
            </div>
          </aside>
        </section>

        <section className="pokelike-section">
          <div className="pokelike-section-head">
            <h2>Como funciona</h2>
          </div>

          <div className="pokelike-step-grid">
            {howItWorks.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.step} className="pokelike-step-card">
                  <div className="pokelike-step-head">
                    <span className="pokelike-step-number">{item.step}</span>
                    <span className="surface-icon" aria-hidden="true">
                      <Icon size={18} strokeWidth={2.1} />
                    </span>
                  </div>
                  <strong>{item.title}</strong>
                </article>
              );
            })}
          </div>
        </section>

        <section className="pokelike-section">
          <div className="pokelike-services-shell">
            <div className="pokelike-section-head">
              <h2>Categorias</h2>
            </div>

            <div className="pokelike-service-grid">
              {serviceCards.map((item, index) => (
                <Link key={item.title} href={item.href} className={`pokelike-service-card pokelike-service-card-${index + 1}`}>
                  <strong>{item.title}</strong>
                  <span className="pokelike-service-link">
                    Explorar
                    <ArrowRight size={15} strokeWidth={2.1} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="pokelike-final-cta">
          <div className="pokelike-final-cta-copy">
            <h2>Pronto para entrar?</h2>
            <p>Crie sua conta ou abra o catalogo.</p>
          </div>

          <div className="pokelike-final-cta-actions">
            <Link href={accountHref} className="primary-action">
              {accountLabel}
            </Link>
            <Link href="/catalog" className="secondary-action">
              Ver servicos
            </Link>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
