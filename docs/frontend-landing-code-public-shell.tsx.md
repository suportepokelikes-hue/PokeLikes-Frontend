# PublicShell v3 Code

Use este código como base principal para `src/modules/app-shell/public-shell.tsx`.

```tsx
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
    <div className="public-shell public-shell-v3">
      <header className="public-header public-header-v3">
        <div className="public-header-inner public-header-inner-v3">
          <Link href="/" className="public-brand public-brand-v3" aria-label={`Ir para a home da ${appName}`}>
            <span className="public-brand-mark">
              <Image
                src="/brand/logo.jpeg"
                alt={appName}
                width={48}
                height={48}
                className="brand-logo-image"
                priority
              />
            </span>
            <span className="public-brand-copy public-brand-copy-v3">
              <strong>{appName}</strong>
            </span>
          </Link>

          <nav className="public-nav public-nav-v3" aria-label="Navegacao principal">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`public-nav-link public-nav-link-v3${link.match(pathname) ? ' is-current' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="public-header-actions public-header-actions-v3">
            {session.status === 'authenticated' ? (
              <>
                <Link href={accountHref} className="primary-action public-shell-primary">
                  {accountLabel}
                  <ArrowRight size={16} strokeWidth={2.1} aria-hidden="true" />
                </Link>
                <LogoutButton label="Sair" />
              </>
            ) : (
              <>
                <Link href="/login" className="public-shell-inline-link">
                  Entrar
                </Link>
                <Link href="/register" className="primary-action public-shell-primary">
                  Criar conta
                  <ArrowRight size={16} strokeWidth={2.1} aria-hidden="true" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="public-mobile-toggle public-mobile-toggle-v3"
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

      <div className={`public-mobile-panel public-mobile-panel-v3${isMenuOpen ? ' is-open' : ''}`}>
        <nav className="public-mobile-nav" aria-label="Navegacao mobile">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`public-mobile-link public-mobile-link-v3${link.match(pathname) ? ' is-current' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="public-mobile-actions">
          {session.status === 'authenticated' ? (
            <>
              <Link href={accountHref} className="primary-action public-shell-primary">
                {accountLabel}
              </Link>
              <LogoutButton label="Sair" />
            </>
          ) : (
            <>
              <Link href="/register" className="primary-action public-shell-primary">
                Criar conta
              </Link>
              <Link href="/login" className="secondary-action public-shell-secondary">
                Entrar
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="public-shell-main public-shell-main-v3">{children}</div>

      <footer className="public-footer public-footer-v3">
        <div className="public-footer-inner public-footer-inner-v3">
          <p>© 2025 {appName}. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}