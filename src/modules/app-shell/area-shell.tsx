'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
      { href: '/admin', label: 'Dashboard' },
      { href: '/admin/users', label: 'Usuarios' },
      { href: '/admin/catalog', label: 'Catalogo' },
      { href: '/admin/payments', label: 'Pagamentos' },
      { href: '/admin/orders', label: 'Pedidos' },
      { href: '/admin/supplier', label: 'Fornecedores' },
      { href: '/admin/alerts', label: 'Alertas' },
      { href: '/admin/audits', label: 'Auditoria' },
      { href: '/admin/transactions', label: 'Transacoes' },
    ],
  },
} as const;

export function AreaShell({ area, user, title, children }: AreaShellProps) {
  const config = areaConfig[area];
  const pathname = usePathname();

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
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? 'is-current' : ''}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
