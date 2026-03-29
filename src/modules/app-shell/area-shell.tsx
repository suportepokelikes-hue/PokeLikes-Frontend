'use client';

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
      <header className="area-header">
        <div>
          <p className="eyebrow">{view.eyebrow}</p>
          <h1>{view.title}</h1>
        </div>

        <div className="account-badge">
          <strong>{view.userName}</strong>
          <span>{view.userMeta}</span>
          <LogoutButton label="Encerrar sessao" />
        </div>
      </header>

      <nav className="area-nav" aria-label={view.navigationLabel}>
        {view.links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={link.isCurrent ? 'is-current' : ''}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {view.children}
    </div>
  );
}
