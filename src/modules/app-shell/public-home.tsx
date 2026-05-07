import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Headphones,
  Layers3,
  Lock,
  Package,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Wallet,
} from 'lucide-react';

import { getPublicEnv } from '@/lib/config/env';
import { getLoginPath } from '@/lib/auth/navigation';
import type { SessionState } from '@/lib/auth/session';
import { PublicShell } from '@/modules/app-shell/public-shell';

type PublicHomeProps = {
  session: SessionState;
};

const howItWorks = [
  { step: '01', title: 'Crie sua conta', icon: Sparkles },
  { step: '02', title: 'Adicione saldo', icon: Wallet },
  { step: '03', title: 'Escolha um servico', icon: CreditCard },
  { step: '04', title: 'Acompanhe pedidos', icon: Package },
] as const;

const benefits = [
  {
    title: 'Plataforma facil de usar',
    description: 'Interface intuitiva e moderna para qualquer nivel de experiencia.',
    icon: Sparkles,
  },
  {
    title: 'Pagamento rapido com Pix',
    description: 'Adicione saldo instantaneamente com praticidade e velocidade.',
    icon: CreditCard,
  },
  {
    title: 'Suporte ao cliente',
    description: 'Equipe pronta para ajudar em cada etapa da sua jornada.',
    icon: Headphones,
  },
  {
    title: 'Privacidade e seguranca',
    description: 'Seus dados protegidos com uma experiencia solida e confiavel.',
    icon: Lock,
  },
  {
    title: 'Processos organizados',
    description: 'Gerencie pedidos e campanhas de forma centralizada.',
    icon: Layers3,
  },
  {
    title: 'Precos acessiveis',
    description: 'Estrutura clara para operar com rapidez e previsibilidade.',
    icon: BadgeCheck,
  },
] as const;

const serviceCards = [
  { title: 'Instagram', filters: { socialNetwork: 'instagram' } },
  { title: 'TikTok', filters: { socialNetwork: 'tiktok' } },
  { title: 'YouTube', filters: { socialNetwork: 'youtube' } },
  { title: 'Telegram', filters: { socialNetwork: 'telegram' } },
  { title: 'Facebook', filters: { socialNetwork: 'facebook' } },
  { title: 'Servicos completos', filters: {} },
] as const;

const stats = [
  { value: '+10 mil', label: 'Pedidos processados', icon: Package },
  { value: '24/7', label: 'Suporte ativo', icon: Headphones },
  { value: '6+', label: 'Plataformas integradas', icon: Layers3 },
  { value: '100%', label: 'Painel intuitivo', icon: Shield },
] as const;

const testimonials = [
  {
    name: 'Mariana Costa',
    role: 'Criadora de conteudo',
    text: 'A plataforma ficou muito mais facil de usar. Consigo resolver tudo sem me perder.',
  },
  {
    name: 'Rafael Souza',
    role: 'Empreendedor digital',
    text: 'Visual limpo, fluxo rapido e operacao simples. Era exatamente o que eu precisava.',
  },
  {
    name: 'Ana Luiza',
    role: 'Gestora de campanhas',
    text: 'A experiencia esta muito mais profissional. O painel e os pedidos ficaram bem claros.',
  },
] as const;

function getAccountHref(session: SessionState) {
  if (session.status !== 'authenticated') return '/register';
  return session.user.role === 'admin' ? '/admin' : '/app/services';
}

function getAccountLabel(session: SessionState) {
  if (session.status !== 'authenticated') return 'Criar conta';
  return session.user.role === 'admin' ? 'Abrir admin' : 'Abrir minha area';
}

function getServicesHref(
  session: SessionState,
  filters: { aff?: string; search?: string; socialNetwork?: string; category?: string; type?: string } = {},
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const servicesPath = searchParams.toString() ? `/app/services?${searchParams.toString()}` : '/app/services';

  if (session.status !== 'authenticated') {
    return getLoginPath({ reason: 'required', returnTo: servicesPath });
  }

  if (session.user.role === 'admin') {
    return '/admin/catalog';
  }

  return servicesPath;
}

export function PublicHome({ session }: PublicHomeProps) {
  const { appName } = getPublicEnv();
  const accountHref = getAccountHref(session);
  const accountLabel = getAccountLabel(session);

  return (
    <PublicShell session={session}>
      <main className="landing-v2">
        <section id="inicio" className="landing-v2-hero">
          <div className="landing-v2-hero-copy-shell">
            <div className="landing-v2-hero-copy">
              <span className="landing-v2-badge">
                <Sparkles size={14} strokeWidth={2.1} aria-hidden="true" />
                Plataforma de Marketing Digital
              </span>

              <h1>
                Evolua sua presenca
                <br />
                online com a energia da
                <br />
                <span>Pokelike</span>
              </h1>

              <p>
                A plataforma que ajuda criadores, marcas e empreendedores a organizar
                acoes de divulgacao digital com praticidade, seguranca e resultados reais.
              </p>

              <div className="landing-v2-hero-actions">
                <Link href={accountHref} className="landing-v2-primary">
                  {accountLabel}
                </Link>
                {session.status !== 'authenticated' ? (
                  <Link href="/login" className="landing-v2-secondary landing-v2-mobile-only">
                    Entrar
                  </Link>
                ) : null}
              </div>

              <div className="landing-v2-trust-row">
                <span>
                  <CreditCard size={14} aria-hidden="true" /> Pagamento via Pix
                </span>
                <span>
                  <Headphones size={14} aria-hidden="true" /> Suporte 24/7
                </span>
                <span>
                  <Shield size={14} aria-hidden="true" /> Plataforma segura
                </span>
                <span>
                  <Rocket size={14} aria-hidden="true" /> Entrega agil
                </span>
              </div>
            </div>
          </div>

          <div className="landing-v2-hero-art-shell">
            <div className="landing-v2-hero-art">
              <div className="landing-v2-hero-art-frame">
                <div className="landing-v2-floating landing-v2-floating-left">
                  <Sparkles size={22} strokeWidth={2.1} aria-hidden="true" />
                </div>
                <div className="landing-v2-floating landing-v2-floating-right">+1</div>
                <div className="landing-v2-floating landing-v2-floating-bottom">ROI</div>

                <Image
                  src="/brand/landing-mascot.png"
                  alt={`Mascote da ${appName}`}
                  width={620}
                  height={620}
                  className="landing-v2-mascot"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="landing-v2-section">
          <div className="landing-v2-section-head">
            <h2>Como funciona</h2>
            <p>Comece em poucos passos e acompanhe tudo em um so lugar.</p>
          </div>

          <div className="landing-v2-steps">
            {howItWorks.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.step} className="landing-v2-step-card">
                  <div className="landing-v2-step-head">
                    <span className="landing-v2-step-number">{item.step}</span>
                    <span className="landing-v2-step-icon">
                      <Icon size={18} strokeWidth={2.1} aria-hidden="true" />
                    </span>
                  </div>
                  <strong>{item.title}</strong>
                </article>
              );
            })}
          </div>
        </section>

        <section id="beneficios" className="landing-v2-section">
          <div className="landing-v2-section-head landing-v2-section-head-center">
            <h2>
              Por que escolher a <span>Pokelike</span>?
            </h2>
            <p>Tudo que voce precisa para levar suas campanhas ao proximo nivel.</p>
          </div>

          <div className="landing-v2-benefits-grid">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="landing-v2-benefit-card">
                  <span className="landing-v2-benefit-icon">
                    <Icon size={22} strokeWidth={2.1} aria-hidden="true" />
                  </span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="servicos" className="landing-v2-section">
          <div className="landing-v2-section-head">
            <h2>Servicos</h2>
            <p>Explore as categorias principais da plataforma.</p>
          </div>

          <div className="landing-v2-service-grid">
            {serviceCards.map((item) => (
              <Link key={item.title} href={getServicesHref(session, item.filters)} className="landing-v2-service-card">
                <strong>{item.title}</strong>
                <span>
                  Explorar
                  <ArrowRight size={15} strokeWidth={2.1} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="landing-v2-stats-band">
          <div className="landing-v2-stats-inner">
            <h2>Centralize suas estrategias de divulgacao em um so lugar</h2>

            <div className="landing-v2-stats-grid">
              {stats.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.label} className="landing-v2-stat-card">
                    <span className="landing-v2-stat-icon">
                      <Icon size={22} strokeWidth={2.1} aria-hidden="true" />
                    </span>
                    <strong>{item.value}</strong>
                    <p>{item.label}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="depoimentos" className="landing-v2-section">
          <div className="landing-v2-section-head landing-v2-section-head-center">
            <h2>
              O que nossos <span>clientes</span> dizem
            </h2>
            <p>Feedbacks curtos e claros, como a experiencia deve ser.</p>
          </div>

          <div className="landing-v2-testimonial-grid">
            {testimonials.map((item) => (
              <article key={item.name} className="landing-v2-testimonial-card">
                <div className="landing-v2-stars" aria-hidden="true">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <p>{item.text}</p>
                <div className="landing-v2-testimonial-meta">
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="landing-v2-final-cta">
          <div className="landing-v2-final-copy">
            <h2>Pronto para comecar?</h2>
            <p>Crie sua conta agora e explore o catalogo com uma experiencia muito mais clara.</p>
          </div>

          <div className="landing-v2-final-actions">
            <Link href={accountHref} className="landing-v2-primary">
              {accountLabel}
            </Link>
            {session.status !== 'authenticated' ? (
              <Link href="/login" className="landing-v2-secondary landing-v2-mobile-only">
                Entrar
              </Link>
            ) : null}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
