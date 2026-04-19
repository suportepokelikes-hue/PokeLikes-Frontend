import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  FolderKanban,
  Gauge,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react';

import { getPublicEnv } from '@/lib/config/env';
import type { SessionState } from '@/lib/auth/session';
import { PublicShell } from '@/modules/app-shell/public-shell';

type PublicHomeProps = {
  session: SessionState;
};

const trustChips = ['Pagamento via Pix', 'Suporte 24/7', 'Plataforma segura', 'Entrega agil'] as const;

const howItWorks = [
  {
    step: '01',
    title: 'Crie sua conta',
    description: 'Cadastre-se e acesse sua area.',
    icon: BadgeCheck,
  },
  {
    step: '02',
    title: 'Adicione saldo',
    description: 'Recarregue via Pix com rapidez.',
    icon: CreditCard,
  },
  {
    step: '03',
    title: 'Escolha um servico',
    description: 'Explore categorias e encontre o que precisa.',
    icon: Search,
  },
  {
    step: '04',
    title: 'Acompanhe seus pedidos',
    description: 'Veja status e historico no painel.',
    icon: FolderKanban,
  },
] as const;

const benefits = [
  {
    title: 'Facil de usar',
    description: 'Interface simples e direta.',
    icon: Sparkles,
  },
  {
    title: 'Pix rapido',
    description: 'Saldo disponivel em poucos passos.',
    icon: CreditCard,
  },
  {
    title: 'Mais controle',
    description: 'Pedidos, pagamentos e conta no mesmo painel.',
    icon: Wallet,
  },
  {
    title: 'Mais clareza',
    description: 'Veja informacoes importantes antes de comprar.',
    icon: ShieldCheck,
  },
  {
    title: 'Suporte quando precisar',
    description: 'Ajuda para continuar sem travar.',
    icon: Gauge,
  },
  {
    title: 'Experiencia organizada',
    description: 'Menos troca de contexto, mais fluidez.',
    icon: Layers3,
  },
] as const;

const serviceCards = [
  {
    title: 'Instagram',
    description: 'Servicos para perfil e alcance.',
    href: '/catalog?socialNetwork=instagram',
  },
  {
    title: 'TikTok',
    description: 'Opcoes para videos e descoberta.',
    href: '/catalog?socialNetwork=tiktok',
  },
  {
    title: 'YouTube',
    description: 'Categorias para views e canal.',
    href: '/catalog?socialNetwork=youtube',
  },
  {
    title: 'Telegram',
    description: 'Recursos para grupos e canais.',
    href: '/catalog?socialNetwork=telegram',
  },
  {
    title: 'Facebook',
    description: 'Explore servicos para paginas.',
    href: '/catalog?socialNetwork=facebook',
  },
  {
    title: 'Outras redes',
    description: 'Veja mais categorias no catalogo.',
    href: '/catalog',
  },
] as const;

const faqs = [
  {
    question: 'Como funciona a Pokelike?',
    answer: 'Voce cria a conta, adiciona saldo e acompanha tudo no painel.',
  },
  {
    question: 'Como faco pagamento?',
    answer: 'A recarga acontece via Pix, com QR code e copia e cola.',
  },
  {
    question: 'Consigo acompanhar meus pedidos?',
    answer: 'Sim. Status e historico ficam na sua area.',
  },
  {
    question: 'Preciso de suporte para comecar?',
    answer: 'Se precisar, voce segue com ajuda durante a jornada.',
  },
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

  return session.user.role === 'admin' ? 'Abrir area admin' : 'Abrir minha area';
}

function getSessionAccent(session: SessionState) {
  if (session.status !== 'authenticated') {
    return {
      label: 'Conta pronta',
      title: 'Comece em poucos passos',
    };
  }

  if (session.user.role === 'admin') {
    return {
      label: 'Sessao ativa',
      title: 'Admin conectado',
    };
  }

  return {
    label: 'Sessao ativa',
    title: 'Conta conectada',
  };
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
                Plataforma de marketing digital
              </span>
            </div>

            <div className="pokelike-hero-headline">
              <p className="eyebrow">Pokelike</p>
              <h1>Evolua sua presenca online com a energia da {appName}</h1>
              <p className="lede">A plataforma para organizar seus servicos digitais com mais praticidade, rapidez e clareza.</p>
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

            <div className="pokelike-hero-trust">
              {trustChips.map((item) => (
                <article key={item} className="pokelike-trust-chip">
                  <BadgeCheck size={16} strokeWidth={2.1} aria-hidden="true" />
                  <span>{item}</span>
                </article>
              ))}
            </div>
          </div>

          <aside className="pokelike-hero-visual" aria-label={`Visao da plataforma ${appName}`}>
            <div className="pokelike-hero-stage">
              <div className="pokelike-stage-glow pokelike-stage-glow-one" aria-hidden="true" />
              <div className="pokelike-stage-glow pokelike-stage-glow-two" aria-hidden="true" />

              <div className="pokelike-hero-badge pokelike-hero-badge-top">
                <span className="pokelike-float-label">Pix</span>
                <strong>Pagamento agil</strong>
              </div>

              <div className="pokelike-hero-badge pokelike-hero-badge-right">
                <span className="pokelike-float-label">{sessionAccent.label}</span>
                <strong>{sessionAccent.title}</strong>
              </div>

              <div className="pokelike-hero-badge pokelike-hero-badge-bottom">
                <span className="pokelike-float-label">Catalogo</span>
                <strong>Escolha com clareza</strong>
              </div>

              <article className="pokelike-hero-window">
                <header className="pokelike-hero-window-head">
                  <div className="pokelike-window-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="pokelike-dashboard-window-status">Painel online</span>
                </header>

                <div className="pokelike-hero-brand-lockup">
                  <div className="pokelike-hero-brand-mark">
                    <Image src="/brand/logo.jpeg" alt={appName} width={96} height={96} className="public-brand-logo-image" priority />
                  </div>
                  <div className="pokelike-hero-brand-copy">
                    <strong>{appName}</strong>
                    <p>Saldo, pedidos e pagamentos em um so lugar.</p>
                  </div>
                </div>

                <div className="pokelike-hero-window-grid">
                  <div className="pokelike-hero-window-card pokelike-hero-window-card-accent">
                    <span>Saldo</span>
                    <strong>Pronto para usar</strong>
                  </div>
                  <div className="pokelike-hero-window-card">
                    <span>Pedidos</span>
                    <strong>Status visivel</strong>
                  </div>
                  <div className="pokelike-hero-window-card">
                    <span>Servicos</span>
                    <strong>Escolha rapida</strong>
                  </div>
                </div>

                <div className="pokelike-hero-chip-row">
                  <span>Instagram</span>
                  <span>TikTok</span>
                  <span>YouTube</span>
                  <span>Telegram</span>
                </div>
              </article>
            </div>
          </aside>
        </section>

        <section className="pokelike-section">
          <div className="pokelike-section-head">
            <p className="eyebrow">Como funciona</p>
            <h2>Comece em poucos passos.</h2>
            <p>Um caminho simples para seguir rapido.</p>
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
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="pokelike-section">
          <div className="pokelike-section-head">
            <p className="eyebrow">Por que escolher</p>
            <h2>Tudo o que voce precisa em um so lugar.</h2>
          </div>

          <div className="pokelike-benefit-grid">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="pokelike-benefit-card">
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

        <section className="pokelike-section">
          <div className="pokelike-services-shell">
            <div className="pokelike-section-head">
              <p className="eyebrow">Plataformas disponiveis</p>
              <h2>Explore categorias para diferentes redes.</h2>
              <p>Uma vitrine curta para levar voce ao catalogo.</p>
            </div>

            <div className="pokelike-service-grid">
              {serviceCards.map((item, index) => (
                <Link key={item.title} href={item.href} className={`pokelike-service-card pokelike-service-card-${index + 1}`}>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  <span className="pokelike-service-link">
                    Explorar
                    <ArrowRight size={15} strokeWidth={2.1} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="pokelike-section">
          <div className="pokelike-dashboard-band">
            <div className="pokelike-dashboard-copy">
              <p className="eyebrow">Seu painel</p>
              <h2>Sua central de comando.</h2>
              <p>Saldo, pedidos e pagamentos em um so lugar.</p>

              <div className="pokelike-dashboard-points">
                <div>
                  <strong>Saldo visivel</strong>
                  <p>Veja o que ja esta pronto para usar.</p>
                </div>
                <div>
                  <strong>Pedidos no radar</strong>
                  <p>Acompanhe tudo sem sair da conta.</p>
                </div>
                <div>
                  <strong>Conta organizada</strong>
                  <p>Menos atrito para seguir comprando.</p>
                </div>
              </div>
            </div>

            <div className="pokelike-dashboard-mockup" aria-hidden="true">
              <article className="pokelike-dashboard-window">
                <header className="pokelike-dashboard-window-head">
                  <span className="pokelike-dashboard-window-title">Painel {appName}</span>
                  <span className="pokelike-dashboard-window-status">Conta conectada</span>
                </header>

                <div className="pokelike-dashboard-stats">
                  <div className="pokelike-dashboard-stat pokelike-dashboard-stat-accent">
                    <span>Saldo</span>
                    <strong>Pronto para comprar</strong>
                    <p>Recarga via Pix.</p>
                  </div>
                  <div className="pokelike-dashboard-stat">
                    <span>Pagamentos</span>
                    <strong>QR code e copia e cola</strong>
                    <p>Status visivel.</p>
                  </div>
                  <div className="pokelike-dashboard-stat">
                    <span>Pedidos</span>
                    <strong>Acompanhamento centralizado</strong>
                    <p>Historico no mesmo painel.</p>
                  </div>
                </div>

                <div className="pokelike-dashboard-feed">
                  <div className="pokelike-dashboard-feed-item">
                    <span className="pokelike-dashboard-feed-label">Painel</span>
                    <strong>Mais clareza para seguir comprando.</strong>
                  </div>
                  <div className="pokelike-dashboard-feed-item">
                    <span className="pokelike-dashboard-feed-label">Fluxo</span>
                    <strong>Da recarga ao pedido, tudo continua aqui.</strong>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="pokelike-section">
          <div className="pokelike-section-head">
            <p className="eyebrow">Perguntas frequentes</p>
            <h2>O essencial para decidir rapido.</h2>
          </div>

          <div className="pokelike-faq-grid">
            {faqs.map((item) => (
              <article key={item.question} className="pokelike-faq-card">
                <strong>{item.question}</strong>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pokelike-final-cta">
          <div className="pokelike-final-cta-copy">
            <p className="eyebrow">Comece agora</p>
            <h2>Pronto para evoluir sua presenca digital?</h2>
            <p>Crie sua conta e comece a explorar a plataforma.</p>
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
