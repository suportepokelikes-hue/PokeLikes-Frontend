import type { ReactNode } from 'react';

import type { UserSummary, WalletSummary } from '@/lib/api/contracts';
import { formatMoney } from '@/lib/format';

export type AreaShellArea = 'customer' | 'admin';

type AreaShellLink = {
  href: string;
  label: string;
  icon: string;
  description?: string;
  isCurrent: boolean;
};

type AreaShellSection = {
  href: string;
  label: string;
};

type AreaShellShortcut = {
  href: string;
  label: string;
  ariaLabel: string;
};

type AreaShellView = {
  areaClassName: string;
  brandTitle: string;
  brandMeta: string;
  title: string;
  currentSectionLabel: string;
  currentSectionDescription: string;
  userName: string;
  userMeta: string;
  navigationLabel: string;
  links: AreaShellLink[];
  walletShortcut: AreaShellShortcut | null;
  profileShortcut: AreaShellShortcut | null;
  children: ReactNode;
};

const areaConfig = {
  customer: {
    label: 'Area cliente',
    brandMeta: 'Cliente',
    sectionDescription: 'Conta, saldo e pedidos.',
    links: [
      { href: '/app/new-order', label: 'Novo pedido', icon: 'orders' },
      { href: '/app/services', label: 'Servicos', icon: 'catalog' },
      { href: '/app/affiliate', label: 'Afiliados', icon: 'affiliate' },
      { href: '/app/wallet', label: 'Carteira', icon: 'wallet' },
      { href: '/app/payments', label: 'Pagamentos', icon: 'payments' },
      { href: '/app/orders', label: 'Pedidos', icon: 'orders' },
    ],
    sections: [{ href: '/app/profile', label: 'Perfil' }],
  },
  admin: {
    label: 'Area admin',
    brandMeta: 'Operacao',
    sectionDescription: 'Operacao e monitoramento.',
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
    sections: [],
  },
} as const;

export function getAreaShellView(options: {
  area: AreaShellArea;
  user: UserSummary;
  title: string;
  pathname: string;
  walletSummary?: WalletSummary | null;
  children: ReactNode;
}): AreaShellView {
  const { area, user, title, pathname, walletSummary, children } = options;
  const config = areaConfig[area];
  const currentSection = [...config.links, ...config.sections].find((link) => isCurrentPath(pathname, link.href));
  const walletLabel = walletSummary ? formatMoney(walletSummary.availableBalance) : 'Saldo indisponivel';

  return {
    areaClassName: `area-shell area-shell-${area}`,
    brandTitle: area === 'admin' ? 'Pokelike Ops' : 'Pokelike',
    brandMeta: config.brandMeta,
    title,
    currentSectionLabel: currentSection?.label ?? title,
    currentSectionDescription: config.sectionDescription,
    userName: user.name,
    userMeta: user.email,
    navigationLabel: `${config.label} navigation`,
    links: config.links.map((link) => ({
      ...link,
      isCurrent: isCurrentPath(pathname, link.href),
    })),
    walletShortcut:
      area === 'customer'
        ? {
            href: '/app/wallet',
            label: walletLabel,
            ariaLabel: walletSummary ? `Abrir carteira com saldo ${walletLabel}` : 'Abrir carteira',
          }
        : null,
    profileShortcut:
      area === 'customer'
        ? {
            href: '/app/profile',
            label: 'Abrir perfil',
            ariaLabel: 'Abrir perfil',
          }
        : null,
    children,
  };
}

export function isCurrentPath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
