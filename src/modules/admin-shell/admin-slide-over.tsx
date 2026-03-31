'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const CLOSE_DELAY_MS = 220;

type AdminSlideOverProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  closeHref: string;
  closeLabel?: string;
  children: ReactNode;
};

export function AdminSlideOver({
  title,
  eyebrow,
  description,
  closeHref,
  closeLabel = 'Fechar painel',
  children,
}: AdminSlideOverProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!isClosing) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.push(closeHref, { scroll: false });
    }, CLOSE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [closeHref, isClosing, router]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsClosing((current) => current || true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function requestClose() {
    setIsClosing((current) => current || true);
  }

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <div className="admin-overlay-shell" data-state={isClosing ? 'closing' : 'open'}>
      <button type="button" className="admin-overlay-backdrop" aria-label={closeLabel} onClick={requestClose} />
      <aside className="admin-overlay-drawer" role="dialog" aria-modal="true" aria-label={title}>
        <div className="panel-heading">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
          </div>
          <button type="button" className="secondary-action admin-overlay-close" onClick={requestClose} aria-label={closeLabel}>
            <X size={16} strokeWidth={2.1} aria-hidden="true" />
            <span>Fechar</span>
          </button>
        </div>
        {description ? <p className="section-copy">{description}</p> : null}
        {children}
      </aside>
    </div>,
    document.body,
  );
}
