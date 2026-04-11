'use client';

import { Check, Copy, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type PaymentPixActionsProps = {
  brCode: string | null;
  autoRefresh: boolean;
};

type CopyState = 'copied' | 'error' | 'idle';

const AUTO_REFRESH_INTERVAL_MS = 15000;

export function PaymentPixActions({ brCode, autoRefresh }: PaymentPixActionsProps) {
  const router = useRouter();
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const refreshInterval = window.setInterval(() => {
      setIsRefreshing(true);
      router.refresh();
      window.setTimeout(() => setIsRefreshing(false), 700);
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => window.clearInterval(refreshInterval);
  }, [autoRefresh, router]);

  async function handleCopy() {
    if (!brCode) {
      setCopyState('error');
      return;
    }

    try {
      await navigator.clipboard.writeText(brCode);
      setCopyState('copied');
      window.setTimeout(() => {
        setCopyState((current) => (current === 'copied' ? 'idle' : current));
      }, 1800);
    } catch {
      setCopyState('error');
      window.setTimeout(() => {
        setCopyState((current) => (current === 'error' ? 'idle' : current));
      }, 2200);
    }
  }

  function handleRefresh() {
    setIsRefreshing(true);
    router.refresh();
    window.setTimeout(() => setIsRefreshing(false), 700);
  }

  return (
    <div className="payment-pix-actions">
      <div className="payment-pix-buttons">
        <button type="button" className="referral-copy-button" onClick={handleCopy} disabled={!brCode}>
          {copyState === 'copied' ? <Check size={16} strokeWidth={2.15} aria-hidden="true" /> : <Copy size={16} strokeWidth={2.15} aria-hidden="true" />}
          {copyState === 'copied' ? 'Codigo copiado' : 'Copiar codigo PIX'}
        </button>

        <button type="button" className="secondary-action" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw size={16} strokeWidth={2.15} aria-hidden="true" className={isRefreshing ? 'is-spinning' : undefined} />
          {isRefreshing ? 'Atualizando...' : 'Atualizar status'}
        </button>
      </div>

      {copyState === 'error' ? <p className="payment-pix-meta payment-pix-meta-error">Nao foi possivel copiar o codigo PIX.</p> : null}
      {autoRefresh ? <p className="payment-pix-meta">Se o pagamento ainda estiver pendente, o status atualiza sozinho a cada 15 segundos.</p> : null}
    </div>
  );
}
