'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

type CopyTarget = 'code' | 'link' | null;

type AffiliateShareActionsProps = {
  affiliateCode: string;
  affiliateLink: string;
};

export function AffiliateShareActions({ affiliateCode, affiliateLink }: AffiliateShareActionsProps) {
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget>(null);

  async function handleCopy(target: Exclude<CopyTarget, null>, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      window.setTimeout(() => {
        setCopiedTarget((current) => (current === target ? null : current));
      }, 1800);
    } catch {
      setCopiedTarget(null);
    }
  }

  return (
    <div className="referral-copy-group">
      <button type="button" className="referral-copy-button" onClick={() => handleCopy('code', affiliateCode)}>
        {copiedTarget === 'code' ? <Check size={16} strokeWidth={2.15} aria-hidden="true" /> : <Copy size={16} strokeWidth={2.15} aria-hidden="true" />}
        {copiedTarget === 'code' ? 'Codigo copiado' : 'Copiar codigo'}
      </button>

      <button type="button" className="referral-copy-button" onClick={() => handleCopy('link', affiliateLink)}>
        {copiedTarget === 'link' ? <Check size={16} strokeWidth={2.15} aria-hidden="true" /> : <Copy size={16} strokeWidth={2.15} aria-hidden="true" />}
        {copiedTarget === 'link' ? 'Link copiado' : 'Copiar link'}
      </button>
    </div>
  );
}
