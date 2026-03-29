import type { ReactNode } from 'react';

import type { UserSummary } from '@/lib/api/contracts';

export type AreaShellArea = 'customer' | 'admin';

type AreaShellLink = {
  href: string;
  label: string;
  isCurrent: boolean;
};

type AreaShellView = {
  areaClassName: string;
  eyebrow: string;
  title: string;
  userName: string;
  userMeta: string;
  navigationLabel: string;
  links: AreaShellLink[];
  children: ReactNode;
};

const areaConfig = {
  customer: {
    label: 'Area cliente',
    links: [
      { href: '/', label: 'Publico' },
      { href: '/app', label: 'Inicio cliente' },
      { href: '/app/profile', label: 'Perfil' },
      { href: '/app/wallet', label: 'Wallet' },
      { href: '/app/payments', label: 'Pagamentos' },
      { href: '/app/orders', label: 'Pedidos' },
      { href: '/admin', label: 'Admin' },
    ],
  },
  admin: {
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

export function getAreaShellView(options: {
  area: AreaShellArea;
  user: UserSummary;
  title: string;
  pathname: string;
  children: ReactNode;
}): AreaShellView {
  const { area, user, title, pathname, children } = options;
  const config = areaConfig[area];

  return {
    areaClassName: `area-shell area-shell-${area}`,
    eyebrow: config.label,
    title,
    userName: user.name,
    userMeta: `${user.email} / ${user.status}`,
    navigationLabel: `${config.label} navigation`,
    links: config.links.map((link) => ({
      ...link,
      isCurrent: isCurrentPath(pathname, link.href),
    })),
    children,
  };
}

export function isCurrentPath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
