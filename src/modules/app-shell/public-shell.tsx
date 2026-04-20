'use client';

import { ArrowRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { getPublicEnv } from '@/lib/config/env';
import type { SessionState } from '@/lib/auth/session';
import { LogoutButton } from '@/modules/auth/logout-button';

type PublicShellProps = {
  session: SessionState;
  children: ReactNode;
};

type PublicLink = {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
};

const publicLinks: PublicLink[] = [
  {
    href: '/',
    label: 'Inicio',
    match: (pathname) => pathname === '/',
  },
  {
    href: '/catalog',
    label: 'Catalogo',
    match: (pathname) => pathname === '/catalog' || pathname.startsWith('/catalog/'),
  },
];

export function PublicShell({ session, children }: PublicShellProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { appName } = getPublicEnv();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const accountHref = session.status === 'authenticated' ? (session.user.role === 'admin' ? '/admin' : '/app') : '/register';
  const accountLabel = session.status === 'authenticated' ? 'Minha area' : 'Criar conta';

  const footerLinks = useMemo(
    () => [
      ...publicLinks.map(({ href, label }) => ({ href, label })),
      { href: '/login', label: 'Entrar' },
      { href: accountHref, label: accountLabel },
    ],
    [accountHref, accountLabel],
  );

  return (
    <div className="public-shell">
      <header className="public-header">
        <div className="public-header-inner">
          <Link href="/" className="public-brand" aria-label={`Ir para a home da ${appName}`}>
            <span className="public-brand-mark">
              <Image src="/brand/logo.jpeg" alt={appName} width={52} height={52} className="brand-logo-image" priority />
            </span>
            <span className="public-brand-copy">
              <strong>{appName}</strong>
            </span>
          </Link>

          <nav className="public-nav" aria-label="Navegacao principal">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`public-nav-link${link.match(pathname) ? ' is-current' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="public-header-actions">
            {session.status === 'authenticated' ? (
              <>
                <Link href={accountHref} className="primary-action">
                  {accountLabel}
                  <ArrowRight size={16} strokeWidth={2.15} aria-hidden="true" />
                </Link>
                <LogoutButton label="Sair" />
              </>
            ) : (
              <>
                <Link href="/login" className="secondary-action">
                  Entrar
                </Link>
                <Link href="/register" className="primary-action">
                  Criar conta
                  <ArrowRight size={16} strokeWidth={2.15} aria-hidden="true" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="public-mobile-toggle"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X size={18} strokeWidth={2.1} aria-hidden="true" /> : <Menu size={18} strokeWidth={2.1} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <button
        type="button"
        className={`public-mobile-backdrop${isMenuOpen ? ' is-visible' : ''}`}
        aria-label="Fechar menu"
        onClick={() => setIsMenuOpen(false)}
      />

      <div className={`public-mobile-panel${isMenuOpen ? ' is-open' : ''}`}>
        <div className="public-mobile-panel-copy">
          <strong>{appName}</strong>
        </div>

        <nav className="public-mobile-nav" aria-label="Navegacao mobile">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`public-mobile-link${link.match(pathname) ? ' is-current' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="public-mobile-actions">
          {session.status === 'authenticated' ? (
            <>
              <Link href={accountHref} className="primary-action">
                {accountLabel}
              </Link>
              <LogoutButton label="Sair" />
            </>
          ) : (
            <>
              <Link href="/register" className="primary-action">
                Criar conta
              </Link>
              <Link href="/login" className="secondary-action">
                Entrar
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="public-shell-main">{children}</div>

      <footer className="public-footer">
        <div className="public-footer-inner">
          <div className="public-footer-brand">
            <span className="public-footer-mark">
              <Image src="/brand/logo.jpeg" alt={appName} width={48} height={48} className="brand-logo-image" />
            </span>
            <div className="public-footer-copy">
              <strong>{appName}</strong>
            </div>
          </div>

          <div className="public-footer-links">
            {footerLinks.map((link) => (
              <Link key={`${link.href}-${link.label}`} href={link.href} className="public-footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
