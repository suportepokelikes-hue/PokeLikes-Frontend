'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  clearStoredAffiliateCode,
  getStoredAffiliateCode,
  normalizeAffiliateCode,
  persistAffiliateCode,
  readAffiliateCodeFromSearchParams,
} from '@/lib/affiliate-code';

type AffiliateCodeInputProps = {
  initialAffiliateCode?: string;
};

export function AffiliateCodeInput({ initialAffiliateCode }: AffiliateCodeInputProps) {
  return (
    <AffiliateCodeStatus
      initialAffiliateCode={initialAffiliateCode}
      heading="Codigo de afiliado aplicado"
      description="Este pedido sera enviado com a atribuicao do codigo abaixo."
      inputName="affiliateCode"
    />
  );
}

export function AffiliateCodeNotice({ initialAffiliateCode }: AffiliateCodeInputProps) {
  return (
    <AffiliateCodeStatus
      initialAffiliateCode={initialAffiliateCode}
      heading="Codigo de afiliado ativo"
      description="Enquanto esse codigo estiver ativo, ele sera reaproveitado no checkout."
    />
  );
}

type AffiliateCodeStatusProps = {
  initialAffiliateCode?: string;
  heading: string;
  description: string;
  inputName?: string;
};

function AffiliateCodeStatus({ initialAffiliateCode, heading, description, inputName }: AffiliateCodeStatusProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [affiliateCode, setAffiliateCode] = useState(() => normalizeAffiliateCode(initialAffiliateCode) ?? '');

  useEffect(() => {
    const codeFromUrl = readAffiliateCodeFromSearchParams(searchParams);
    const normalizedInitialCode = normalizeAffiliateCode(initialAffiliateCode);

    if (codeFromUrl) {
      persistAffiliateCode(codeFromUrl);
      setAffiliateCode(codeFromUrl);
      return;
    }

    if (normalizedInitialCode) {
      persistAffiliateCode(normalizedInitialCode);
      setAffiliateCode(normalizedInitialCode);
      return;
    }

    const storedCode = getStoredAffiliateCode();
    setAffiliateCode(storedCode ?? '');
  }, [initialAffiliateCode, searchParams]);

  function handleClear() {
    clearStoredAffiliateCode();
    setAffiliateCode('');

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete('aff');

    const query = nextSearchParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  if (!affiliateCode) {
    return null;
  }

  return (
    <section className="detail-note detail-note-neutral affiliate-code-status" aria-live="polite">
      <div className="affiliate-code-status-copy">
        <strong>{heading}</strong>
        <p>
          {description} <span className="code-block">{affiliateCode}</span>
        </p>
      </div>
      <div className="affiliate-code-status-actions">
        <button type="button" className="secondary-action" onClick={handleClear}>
          Remover codigo
        </button>
      </div>
      {inputName ? <input type="hidden" name={inputName} value={affiliateCode} /> : null}
    </section>
  );
}
