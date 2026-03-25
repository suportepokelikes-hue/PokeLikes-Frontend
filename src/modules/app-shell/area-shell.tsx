import Link from 'next/link';

import type { UserSummary } from '@/lib/api/contracts';
import { LogoutButton } from '@/modules/auth/logout-button';

type AreaShellProps = {
  area: 'customer' | 'admin';
  user: UserSummary;
  title: string;
  children: React.ReactNode;
};

const areaConfig = {
  customer: {
    homeHref: '/app',
    label: 'Area cliente',
    links: [
      { href: '/', label: 'Publico' },
      { href: '/app', label: 'Inicio cliente' },
      { href: '/admin', label: 'Admin' },
    ],
  },
  admin: {
    homeHref: '/admin',
    label: 'Area admin',
    links: [
      { href: '/', label: 'Publico' },
      { href: '/app', label: 'Cliente' },
      { href: '/admin', label: 'Inicio admin' },
    ],
  },
} as const;

export function AreaShell({ area, user, title, children }: AreaShellProps) {
  const config = areaConfig[area];

  return (
    <div className={`area-shell area-shell-${area}`}>
      <header className="area-header">
        <div>
          <p className="eyebrow">{config.label}</p>
          <h1>{title}</h1>
        </div>

        <div className="account-badge">
          <strong>{user.name}</strong>
          <span>
            {user.email} / {user.status}
          </span>
          <LogoutButton label="Encerrar sessao" />
        </div>
      </header>

      <nav className="area-nav" aria-label={`${config.label} navigation`}>
        {config.links.map((link) => (
          <Link key={link.href} href={link.href} className={link.href === config.homeHref ? 'is-current' : ''}>
            {link.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
