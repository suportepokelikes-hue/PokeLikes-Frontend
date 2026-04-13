'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { normalizeAffiliateCode, persistAffiliateCode, readAffiliateCodeFromSearchParams } from '@/lib/affiliate-code';

type AffiliateCodeCaptureProps = {
  initialAffiliateCode?: string;
};

export function AffiliateCodeCapture({ initialAffiliateCode }: AffiliateCodeCaptureProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const affiliateCode = normalizeAffiliateCode(initialAffiliateCode) ?? readAffiliateCodeFromSearchParams(searchParams);

    if (affiliateCode) {
      persistAffiliateCode(affiliateCode);
    }
  }, [initialAffiliateCode, searchParams]);

  return null;
}
