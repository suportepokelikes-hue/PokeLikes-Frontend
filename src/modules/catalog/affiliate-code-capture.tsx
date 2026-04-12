'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { persistAffiliateCode, readAffiliateCodeFromSearchParams } from '@/lib/affiliate-code';

type AffiliateCodeCaptureProps = {
  initialAffiliateCode?: string;
};

export function AffiliateCodeCapture({ initialAffiliateCode }: AffiliateCodeCaptureProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const affiliateCode = initialAffiliateCode ?? readAffiliateCodeFromSearchParams(searchParams);

    if (affiliateCode) {
      persistAffiliateCode(affiliateCode);
    }
  }, [initialAffiliateCode, searchParams]);

  return null;
}
