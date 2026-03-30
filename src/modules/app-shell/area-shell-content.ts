import type { ReactNode } from 'react';

import type { UserSummary } from '@/lib/api/contracts';

export type AreaShellArea = 'customer' | 'admin';

type AreaShellLink = {
  href: string;
  label: string;
  icon: string;
  isCurrent: boolean;
};

type AreaShellView = {
  areaClassName: string;
  brandTitle: string;
  brandMeta: string;
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
    brandMeta: 'Likes Uai Client',
    links: [
      { href: '/', label: 'Publico', icon: 'P' },
      { href: '/app', label: 'Dashboard', icon: 'D' },
      { href: '/app/profile', label: 'Perfil', icon: 'U' },
      { href: '/app/wallet', label: 'Carteira', icon: 'W' },
      { href: '/app/payments', label: 'Pagamentos', icon: 'R' },
      { href: '/app/orders', label: 'Pedidos', icon: 'O' },
      { href: '/admin', label: 'Admin', icon: 'A' },
    ],
  },
  admin: {
    label: 'Area admin',
    brandMeta: 'Likes Uai Console',
    links: [
      { href: '/admin', label: 'Dashboard', icon: 'D' },
      { href: '/admin/users', label: 'Usuarios', icon: 'U' },
      { href: '/admin/catalog', label: 'Catalogo', icon: 'C' },
      { href: '/admin/payments', label: 'Pagamentos', icon: 'P' },
      { href: '/admin/orders', label: 'Pedidos', icon: 'O' },
      { href: '/admin/supplier', label: 'Fornecedores', icon: 'F' },
      { href: '/admin/alerts', label: 'Alertas', icon: '!' },
      { href: '/admin/audits', label: 'Auditoria', icon: 'A' },
      { href: '/admin/transactions', label: 'Transacoes', icon: 'T' },
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
    brandTitle: 'Likes Uai',
    brandMeta: config.brandMeta,
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
