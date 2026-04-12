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
      { href: '/', label: 'Publico', icon: 'public' },
      { href: '/app', label: 'Dashboard', icon: 'dashboard' },
      { href: '/app/profile', label: 'Perfil', icon: 'profile' },
      { href: '/app/affiliate', label: 'Afiliados', icon: 'affiliate' },
      { href: '/app/wallet', label: 'Carteira', icon: 'wallet' },
      { href: '/app/payments', label: 'Pagamentos', icon: 'payments' },
      { href: '/app/orders', label: 'Pedidos', icon: 'orders' },
      { href: '/admin', label: 'Admin', icon: 'admin' },
    ],
  },
  admin: {
    label: 'Area admin',
    brandMeta: 'Likes Uai Console',
    links: [
      { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
      { href: '/admin/users', label: 'Usuarios', icon: 'users' },
      { href: '/admin/affiliates', label: 'Afiliados', icon: 'affiliate' },
      { href: '/admin/affiliate-commissions', label: 'Comissoes afiliados', icon: 'affiliate' },
      { href: '/admin/affiliate-payouts', label: 'Payouts afiliados', icon: 'affiliate' },
      { href: '/admin/catalog', label: 'Catalogo', icon: 'catalog' },
      { href: '/admin/payments', label: 'Pagamentos', icon: 'payments' },
      { href: '/admin/orders', label: 'Pedidos', icon: 'orders' },
      { href: '/admin/supplier', label: 'Fornecedores', icon: 'suppliers' },
      { href: '/admin/alerts', label: 'Alertas', icon: 'alerts' },
      { href: '/admin/audits', label: 'Auditoria', icon: 'audits' },
      { href: '/admin/transactions', label: 'Transacoes', icon: 'transactions' },
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
