'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  getStoredAffiliateCode,
  normalizeAffiliateCode,
  persistAffiliateCode,
  readAffiliateCodeFromSearchParams,
} from '@/lib/affiliate-code';

type AffiliateCodeInputProps = {
  initialAffiliateCode?: string;
};

export function AffiliateCodeInput({ initialAffiliateCode }: AffiliateCodeInputProps) {
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

  if (!affiliateCode) {
    return null;
  }

  return <input type="hidden" name="affiliateCode" value={affiliateCode} />;
}
