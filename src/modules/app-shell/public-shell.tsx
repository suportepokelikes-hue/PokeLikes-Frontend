'use client';

import { ArrowRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

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
  { href: '/#inicio', label: 'Inicio', match: (pathname) => pathname === '/' },
  { href: '/#servicos', label: 'Servicos', match: (pathname) => pathname === '/' },
  { href: '/#como-funciona', label: 'Como Funciona', match: (pathname) => pathname === '/' },
  { href: '/#beneficios', label: 'Beneficios', match: (pathname) => pathname === '/' },
  { href: '/#depoimentos', label: 'Depoimentos', match: (pathname) => pathname === '/' },
  { href: '/#faq', label: 'FAQ', match: (pathname) => pathname === '/' },
];

export function PublicShell({ session, children }: PublicShellProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { appName } = getPublicEnv();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const accountHref =
    session.status === 'authenticated'
      ? session.user.role === 'admin'
        ? '/admin'
        : '/app'
      : '/register';

  const accountLabel =
    session.status === 'authenticated'
      ? 'Minha area'
      : 'Criar conta';

  return (
    <div className="public-shell-v3">
      <header className="public-header-v3">
        <div className="public-header-inner-v3">
          <Link href="/" className="public-brand-v3" aria-label={`Ir para a home da ${appName}`}>
            <span className="public-brand-mark-v3">
              <Image
                src="/brand/logo.jpeg"
                alt={appName}
                width={48}
                height={48}
                className="brand-logo-image"
                priority
              />
            </span>
            <span className="public-brand-copy-v3">
              <strong>{appName}</strong>
            </span>
          </Link>

          <nav className="public-nav-v3" aria-label="Navegacao principal">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`public-nav-link-v3${link.match(pathname) ? ' is-current' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="public-header-actions-v3">
            {session.status === 'authenticated' ? (
              <>
                <Link href={accountHref} className="public-shell-primary-v3">
                  {accountLabel}
                  <ArrowRight size={16} strokeWidth={2.1} aria-hidden="true" />
                </Link>
                <LogoutButton label="Sair" />
              </>
            ) : (
              <>
                <Link href="/login" className="public-shell-inline-link-v3">
                  Entrar
                </Link>
                <Link href="/register" className="public-shell-primary-v3">
                  Criar conta
                  <ArrowRight size={16} strokeWidth={2.1} aria-hidden="true" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="public-mobile-toggle-v3"
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
        className={`public-mobile-backdrop-v3${isMenuOpen ? ' is-visible' : ''}`}
        aria-label="Fechar menu"
        onClick={() => setIsMenuOpen(false)}
      />

      <div className={`public-mobile-panel-v3${isMenuOpen ? ' is-open' : ''}`}>
        <nav className="public-mobile-nav-v3" aria-label="Navegacao mobile">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`public-mobile-link-v3${link.match(pathname) ? ' is-current' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="public-mobile-actions-v3">
          {session.status === 'authenticated' ? (
            <>
              <Link href={accountHref} className="public-shell-primary-v3">
                {accountLabel}
              </Link>
              <LogoutButton label="Sair" />
            </>
          ) : (
            <>
              <Link href="/register" className="public-shell-primary-v3">
                Criar conta
              </Link>
              <Link href="/login" className="public-shell-secondary-v3">
                Entrar
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="public-shell-main-v3">{children}</div>

      <footer className="public-footer-v3">
        <div className="public-footer-inner-v3">
          <p>© 2025 {appName}. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
