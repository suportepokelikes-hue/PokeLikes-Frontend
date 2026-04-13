'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Check, Copy, ExternalLink, MailCheck } from 'lucide-react';

import { requestEmailVerificationAction } from '@/modules/auth/actions';
import { initialEmailVerificationRequestState } from '@/modules/auth/types';

type ReferralClientActionsProps = {
  referralCode: string;
  referralLink: string;
  emailVerified: boolean;
};

type CopyTarget = 'code' | 'link' | null;

export function ReferralClientActions({
  referralCode,
  referralLink,
  emailVerified,
}: ReferralClientActionsProps) {
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget>(null);
  const [requestState, requestFormAction] = useActionState(
    requestEmailVerificationAction,
    initialEmailVerificationRequestState,
  );

  async function handleCopy(target: Exclude<CopyTarget, null>, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget((current) => (current === target ? null : current)), 1800);
    } catch {
      setCopiedTarget(null);
    }
  }

  return (
    <div className="referral-actions">
      <div className="referral-copy-group">
        <button
          type="button"
          className="referral-copy-button"
          onClick={() => handleCopy('code', referralCode)}
        >
          {copiedTarget === 'code' ? <Check size={16} strokeWidth={2.15} aria-hidden="true" /> : <Copy size={16} strokeWidth={2.15} aria-hidden="true" />}
          {copiedTarget === 'code' ? 'Codigo copiado' : 'Copiar codigo'}
        </button>

        <button
          type="button"
          className="referral-copy-button"
          onClick={() => handleCopy('link', referralLink)}
        >
          {copiedTarget === 'link' ? <Check size={16} strokeWidth={2.15} aria-hidden="true" /> : <Copy size={16} strokeWidth={2.15} aria-hidden="true" />}
          {copiedTarget === 'link' ? 'Link copiado' : 'Copiar link'}
        </button>
      </div>

      {!emailVerified ? (
        <div className="referral-request-shell">
          <form action={requestFormAction}>
            <RequestVerificationButton />
          </form>

          {requestState.status !== 'idle' ? (
            <p
              className={`referral-request-message ${
                requestState.status === 'success' ? 'referral-request-success' : 'referral-request-error'
              }`}
              role="status"
              aria-live="polite"
            >
              {requestState.message}
            </p>
          ) : null}

          {requestState.status === 'success' && requestState.previewHref ? (
            <div className="referral-dev-card">
              <strong>Preview</strong>
              <p>Use o link abaixo para concluir a verificacao em desenvolvimento.</p>
              <Link href={requestState.previewHref} className="secondary-action">
                <ExternalLink size={16} strokeWidth={2.15} aria-hidden="true" />
                Abrir token de preview
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function RequestVerificationButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="primary-action" disabled={pending}>
      <MailCheck size={16} strokeWidth={2.15} aria-hidden="true" />
      {pending ? 'Solicitando...' : 'Verificar email'}
    </button>
  );
}
