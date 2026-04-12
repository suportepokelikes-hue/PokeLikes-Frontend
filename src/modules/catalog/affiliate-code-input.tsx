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

    if (codeFromUrl) {
      persistAffiliateCode(codeFromUrl);
      setAffiliateCode(codeFromUrl);
      return;
    }

    if (initialAffiliateCode) {
      persistAffiliateCode(initialAffiliateCode);
      setAffiliateCode(initialAffiliateCode);
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
