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
    title: 'Catalogo pronto para compra',
    description: 'Explore servicos organizados por rede, faixa de quantidade e disponibilidade real antes de pagar.',
    icon: Sparkles,
  },
  {
    title: 'Pagamento simples por PIX',
    description: 'Gere o PIX, copie o codigo ou escaneie o QR code e acompanhe a confirmacao na propria conta.',
    icon: CreditCard,
  },
  {
    title: 'Acompanhamento de ponta a ponta',
    description: 'Veja pedidos, pagamentos e carteira no mesmo fluxo, sem depender de telas tecnicas.',
    icon: Wallet,
  },
  {
    title: 'Operacao com monitoramento',
    description: 'A plataforma tambem possui area administrativa para controle de pagamentos, pedidos e fornecedores.',
    icon: ShieldCheck,
  },
] as const;

const howItWorks = [
  {
    step: '01',
    title: 'Escolha o servico',
    description: 'Entre no catalogo, compare precos e confira a faixa de compra antes de seguir.',
  },
  {
    step: '02',
    title: 'Adicione saldo por PIX',
    description: 'Crie um pagamento, abra o QR code e aguarde a confirmacao para liberar a carteira.',
  },
  {
    step: '03',
    title: 'Acompanhe seus pedidos',
    description: 'Depois da compra, acompanhe tudo pela area do cliente com status claros e historico.',
  },
] as const;

const trustPoints = [
  'Pagamento via PIX com codigo e QR code',
  'Catalogo publico com disponibilidade',
  'Carteira, pagamentos e pedidos em uma so area',
  'Painel operacional para controle administrativo',
] as const;

export function PublicHome({ session }: PublicHomeProps) {
  const { appName } = getPublicEnv();
  const accountHref = session.status === 'authenticated' ? (session.user.role === 'admin' ? '/admin' : '/app') : '/register';
  const accountLabel = session.status === 'authenticated' ? 'Abrir minha area' : 'Criar conta';
  const sessionMessage =
    session.status === 'authenticated'
      ? `Sessao ativa como ${session.user.role === 'admin' ? 'admin' : 'cliente'}.`
      : 'Cadastro rapido para comprar e acompanhar seus pedidos.';

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
              <strong className="landing-kicker">Plataforma para compra, recarga e acompanhamento de servicos digitais.</strong>
            </div>
          </div>

          <h1>Venda ativa, pagamento rapido e operacao organizada em um unico lugar.</h1>
          <p className="lede">
            {appName} reune catalogo publico, recarga via PIX, carteira, pedidos e painel operacional em uma experiencia unica e direta.
          </p>

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
            <span className="eyebrow">Por que usar</span>
            <h2>Fluxo enxuto para cliente, operacao forte para admin.</h2>
            <p>Da vitrine publica ao acompanhamento do pedido, a plataforma reduz etapas e deixa o status sempre visivel.</p>
          </div>

          <div className="landing-panel-card landing-panel-secondary">
            <span className="eyebrow">Pronto para entrar</span>
            <strong>{sessionMessage}</strong>
            <p>Voce pode abrir o catalogo agora, gerar um PIX quando precisar de saldo e acompanhar tudo na sua area.</p>
          </div>
        </aside>
      </section>

      <section className="landing-section">
        <div className="landing-section-head">
          <p className="eyebrow">Beneficios</p>
          <h2>Uma jornada simples para quem compra e uma operacao confiavel para quem administra.</h2>
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
          <h2>Voce entra, adiciona saldo e acompanha tudo sem trocar de contexto.</h2>
          <p>
            A area publica apresenta o catalogo, a area do cliente concentra pagamento e pedidos, e o admin fica reservado para a operacao.
          </p>
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
          <h2>Abra o catalogo, crie sua conta e use a plataforma no seu proprio ritmo.</h2>
          <p>Nao precisa navegar por paginas tecnicas. O fluxo principal ja esta pronto para compra, PIX e acompanhamento.</p>
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
