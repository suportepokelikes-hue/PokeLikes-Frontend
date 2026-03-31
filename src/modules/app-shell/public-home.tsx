import Image from 'next/image';
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
    description: 'Listagem publica real conectada ao endpoint de catalogo e ao estado de availability.',
  },
  {
    href: '/',
    label: 'Area publica',
    description: 'Base institucional e ponto de entrada do catalogo, auth e estados operacionais.',
  },
  {
    href: '/app',
    label: 'Area do cliente',
    description: 'Shell autenticado para wallet, pagamentos PIX, pedidos e sessao do usuario.',
  },
  {
    href: '/admin',
    label: 'Area admin',
    description: 'Shell operacional para monitoramento, conciliacao e modulos administrativos.',
  },
];

export function PublicHome({ session }: PublicHomeProps) {
  const { apiBaseUrl, appName } = getPublicEnv();
  const primaryHref = session.status === 'authenticated' ? (session.user.role === 'admin' ? '/admin' : '/app') : '/login';
  const primaryLabel = session.status === 'authenticated' ? 'Continuar sessao' : 'Entrar';
  const metrics: ShellMetric[] = [
    { label: 'Contrato fonte', value: 'OpenAPI V1 local' },
    { label: 'Backend base URL', value: apiBaseUrl },
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
          <h1>{appName} para catalogo publico, compra autenticada e operacao administrativa real.</h1>
          <p className="lede">
            A area publica ja conversa com a OpenAPI local, mostra servicos reais do catalogo e encaminha o usuario
            para login, wallet, pagamentos e pedidos sem inventar fluxo fora do backend.
          </p>

          <div className="public-hero-actions">
            <Link href={primaryHref} className="primary-action">
              {primaryLabel}
            </Link>
            {session.status === 'guest' ? (
              <Link href="/register" className="secondary-action">
                Criar conta
              </Link>
            ) : (
              <LogoutButton />
            )}
            <Link href="/catalog" className="secondary-action">
              Ver catalogo
            </Link>
          </div>

          <div className="public-overview-grid">
            <article className="public-overview-card">
              <span>Entrada recomendada</span>
              <strong>Comece pelo catalogo</strong>
              <p>Valide availability, preco, limites e a transicao real para checkout autenticado.</p>
            </article>
            <article className="public-overview-card">
              <span>Operacao real</span>
              <strong>Sem mocks na jornada</strong>
              <p>Login, PIX, pedidos e admin seguem para o backend V1 com os estados operacionais verdadeiros.</p>
            </article>
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

      <section className="journey-grid">
        <article className="journey-card">
          <p className="eyebrow">Jornada publica</p>
          <h2>Descubra, valide disponibilidade e entre no fluxo certo.</h2>
          <p className="section-copy">
            A experiencia publica foi reorganizada para ficar mais proxima do Stitch: leitura editorial, menos ruido
            visual e destaque claro para os proximos passos.
          </p>
        </article>
        <article className="journey-card">
          <ol className="journey-steps">
            <li>
              <strong>1. Explorar catalogo</strong>
              <span>Ver servicos ativos, disponibilidade e faixa operacional.</span>
            </li>
            <li>
              <strong>2. Autenticar</strong>
              <span>Cliente segue para wallet e pedidos; admin segue para o console operacional.</span>
            </li>
            <li>
              <strong>3. Executar</strong>
              <span>Criar PIX, comprar servicos, monitorar estados ou operar o backoffice.</span>
            </li>
          </ol>
        </article>
      </section>

      <section className="public-bento">
        <article className="public-bento-card">
          <span>Catalogo vivo</span>
          <strong>Servicos, filtros e availability</strong>
          <p>Explore os itens publicados e veja imediatamente se o servico esta compravel ou degradado.</p>
        </article>
        <article className="public-bento-card">
          <span>Cliente autenticado</span>
          <strong>Wallet, PIX e pedidos</strong>
          <p>Depois do login, a jornada continua na area do cliente com estados reais de pagamento e ordem.</p>
        </article>
        <article className="public-bento-card">
          <span>Admin operacional</span>
          <strong>Conciliacao, sync e auditoria</strong>
          <p>O shell administrativo ja cobre pagamentos, pedidos, fornecedores, alertas e trilha operacional.</p>
        </article>
      </section>

      <section className="card-grid">
        {publicLinks.map((item) => (
          <Link key={item.href} href={item.href} className="nav-card">
            <span>{item.label}</span>
            <strong>{item.href}</strong>
            <p>{item.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
