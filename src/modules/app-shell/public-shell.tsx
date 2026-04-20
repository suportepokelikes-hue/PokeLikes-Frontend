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
    href: '/#inicio',
    label: 'Inicio',
    match: (pathname) => pathname === '/',
  },
  {
    href: '/#servicos',
    label: 'Servicos',
    match: (pathname) => pathname === '/',
  },
  {
    href: '/#como-funciona',
    label: 'Como Funciona',
    match: (pathname) => pathname === '/',
  },
  {
    href: '/#beneficios',
    label: 'Beneficios',
    match: (pathname) => pathname === '/',
  },
  {
    href: '/#depoimentos',
    label: 'Depoimentos',
    match: (pathname) => pathname === '/',
  },
  {
    href: '/#faq',
    label: 'FAQ',
    match: (pathname) => pathname === '/',
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
      { href: '/catalog', label: 'Catalogo' },
      { href: '/login', label: 'Entrar' },
      { href: accountHref, label: accountLabel },
    ],
    [accountHref, accountLabel],
  );

  return (
    <div className="public-shell public-shell-v2">
      <header className="public-header public-header-v2">
        <div className="public-header-inner public-header-inner-v2">
          <Link href="/" className="public-brand public-brand-v2" aria-label={`Ir para a home da ${appName}`}>
            <span className="public-brand-mark">
              <Image src="/brand/logo.jpeg" alt={appName} width={52} height={52} className="brand-logo-image" priority />
            </span>
            <span className="public-brand-copy public-brand-copy-v2">
              <strong>{appName}</strong>
              <span>Marketing digital com leitura comercial clara</span>
            </span>
          </Link>

          <nav className="public-nav public-nav-v2" aria-label="Navegacao principal">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`public-nav-link public-nav-link-v2${link.match(pathname) ? ' is-current' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="public-header-actions public-header-actions-v2">
            {session.status === 'authenticated' ? (
              <>
                <Link href={accountHref} className="primary-action public-shell-primary">
                  {accountLabel}
                  <ArrowRight size={16} strokeWidth={2.15} aria-hidden="true" />
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
                  <ArrowRight size={16} strokeWidth={2.15} aria-hidden="true" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="public-mobile-toggle public-mobile-toggle-v2"
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

      <div className={`public-mobile-panel public-mobile-panel-v2${isMenuOpen ? ' is-open' : ''}`}>
        <div className="public-mobile-panel-copy public-mobile-panel-copy-v2">
          <strong>{appName}</strong>
          <span>Navegue pela home e acesse o catalogo quando quiser.</span>
        </div>

        <nav className="public-mobile-nav" aria-label="Navegacao mobile">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`public-mobile-link public-mobile-link-v2${link.match(pathname) ? ' is-current' : ''}`}
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

      <div className="public-shell-main public-shell-main-v2">{children}</div>

      <footer className="public-footer public-footer-v2">
        <div className="public-footer-inner public-footer-inner-v2">
          <div className="public-footer-brand public-footer-brand-v2">
            <span className="public-footer-mark">
              <Image src="/brand/logo.jpeg" alt={appName} width={48} height={48} className="brand-logo-image" />
            </span>
            <div className="public-footer-copy public-footer-copy-v2">
              <strong>{appName}</strong>
              <p>Painel comercial para explorar servicos, adicionar saldo via Pix e acompanhar pedidos com clareza.</p>
            </div>
          </div>

          <div className="public-footer-links public-footer-links-v2">
            {footerLinks.map((link) => (
              <Link key={`${link.href}-${link.label}`} href={link.href} className="public-footer-link public-footer-link-v2">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
