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
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Instabarato Platform</p>
          <h1>{appName} com foundation real para publico, cliente e admin.</h1>
          <p className="lede">
            Esta entrega monta a base estrutural do App Router, os shells iniciais de navegacao e o bootstrap
            de sessao alinhado ao contrato do backend.
          </p>
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

      <section className="public-actions">
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
