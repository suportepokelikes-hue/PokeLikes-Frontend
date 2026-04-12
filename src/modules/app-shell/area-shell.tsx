'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  BookOpenText,
  CircleUserRound,
  CreditCard,
  FolderKanban,
  Globe,
  Gift,
  LayoutDashboard,
  Menu,
  PackageSearch,
  ReceiptText,
  Search,
  Shield,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { UserSummary } from '@/lib/api/contracts';
import { LogoutButton } from '@/modules/auth/logout-button';
import { getAreaShellView, type AreaShellArea } from './area-shell-content';

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
  affiliate: Gift,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const view = getAreaShellView({
    area,
    user,
    title,
    pathname,
    children,
  });

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className={view.areaClassName} data-sidebar-open={isSidebarOpen ? 'true' : 'false'}>
      <button
        type="button"
        className={`area-mobile-backdrop${isSidebarOpen ? ' is-visible' : ''}`}
        aria-label="Fechar menu"
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className="area-sidebar" aria-label={view.navigationLabel}>
        <div className="area-sidebar-top">
          <div className="area-brand">
            <div className="area-brand-mark area-brand-mark-image">
              <Image src="/brand/logo.jpeg" alt="Likes Uai" width={56} height={56} className="brand-logo-image" priority />
            </div>
            <div>
              <strong>{view.brandTitle}</strong>
              <span>{view.brandMeta}</span>
            </div>
          </div>

          <button type="button" className="area-sidebar-close" aria-label="Fechar menu" onClick={() => setIsSidebarOpen(false)}>
            <X size={18} strokeWidth={2.1} aria-hidden="true" />
          </button>
        </div>

        <nav className="area-nav">
          {view.links.map((link) => {
            const Icon = navIcons[link.icon] ?? LayoutDashboard;

            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className={link.isCurrent ? 'is-current' : ''}
                onClick={() => setIsSidebarOpen(false)}
              >
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
          <div className="area-header-main">
            <button
              type="button"
              className="area-mobile-toggle"
              aria-label="Abrir menu"
              aria-expanded={isSidebarOpen}
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={18} strokeWidth={2.1} aria-hidden="true" />
            </button>

            <div>
              <p className="eyebrow">{view.eyebrow}</p>
              <h1>{view.title}</h1>
            </div>
          </div>

          <div className="area-toolbar">
            <label className="area-search">
              <Search size={16} strokeWidth={2.1} className="area-search-icon" aria-hidden="true" />
              <input type="search" placeholder="Buscar nesta area" />
            </label>
          </div>
        </header>

        <div className="area-content">{view.children}</div>
      </div>
    </div>
  );
}
