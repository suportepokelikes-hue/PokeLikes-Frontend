'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  BookOpenText,
  CircleUserRound,
  CreditCard,
  FolderKanban,
  Globe,
  LayoutDashboard,
  PackageSearch,
  ReceiptText,
  Search,
  Shield,
  Users,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LogoutButton } from '@/modules/auth/logout-button';
import { getAreaShellView, type AreaShellArea } from './area-shell-content';
import type { UserSummary } from '@/lib/api/contracts';

type AreaShellProps = {
  area: AreaShellArea;
  user: UserSummary;
  title: string;
  children: React.ReactNode;
};

const navIcons: Record<string, LucideIcon> = {
  public: Globe,
  dashboard: LayoutDashboard,
  profile: CircleUserRound,
  wallet: Wallet,
  payments: CreditCard,
  orders: ReceiptText,
  admin: Shield,
  users: Users,
  catalog: FolderKanban,
  suppliers: PackageSearch,
  alerts: Bell,
  audits: BookOpenText,
  transactions: CreditCard,
};

export function AreaShell({ area, user, title, children }: AreaShellProps) {
  const pathname = usePathname();
  const view = getAreaShellView({
    area,
    user,
    title,
    pathname,
    children,
  });

  return (
    <div className={view.areaClassName}>
      <aside className="area-sidebar">
        <div className="area-brand">
          <div className="area-brand-mark area-brand-mark-image">
            <Image src="/brand/logo.jpeg" alt="Likes Uai" width={56} height={56} className="brand-logo-image" priority />
          </div>
          <div>
            <strong>{view.brandTitle}</strong>
            <span>{view.brandMeta}</span>
          </div>
        </div>

        <nav className="area-nav" aria-label={view.navigationLabel}>
          {view.links.map((link) => {
            const Icon = navIcons[link.icon] ?? LayoutDashboard;

            return (
              <Link key={link.href} href={link.href} className={link.isCurrent ? 'is-current' : ''}>
                <span className="area-nav-icon" aria-hidden="true">
                  <Icon size={16} strokeWidth={2.15} />
                </span>
              <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="account-badge">
          <strong>{view.userName}</strong>
          <span>{view.userMeta}</span>
          <LogoutButton label="Encerrar sessao" />
        </div>
      </aside>

      <div className="area-main">
        <header className="area-header">
          <div>
            <p className="eyebrow">{view.eyebrow}</p>
            <h1>{view.title}</h1>
          </div>

          <div className="area-toolbar">
            <label className="area-search">
              <Search size={16} strokeWidth={2.1} className="area-search-icon" aria-hidden="true" />
              <input type="search" placeholder="Buscar nesta area" />
            </label>
            <div className="area-user-chip">
              <strong>{view.userName}</strong>
              <span>{area === 'admin' ? 'Operacao autenticada' : 'Sessao ativa'}</span>
            </div>
          </div>
        </header>

        <div className="area-content">{view.children}</div>
      </div>
    </div>
  );
}
