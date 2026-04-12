type SearchParamReader = {
  get(name: string): string | null;
};

const AFFILIATE_CODE_STORAGE_KEY = 'likes-uai.affiliate-code';

export function normalizeAffiliateCode(value: string | null | undefined) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return normalized ? normalized : undefined;
}

export function readAffiliateCodeFromSearchParams(searchParams: SearchParamReader) {
  return normalizeAffiliateCode(searchParams.get('aff'));
}

export function persistAffiliateCode(value: string | null | undefined) {
  const normalized = normalizeAffiliateCode(value);

  if (!normalized || typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(AFFILIATE_CODE_STORAGE_KEY, normalized);
  } catch {
    // Ignore storage failures and keep checkout flow working without affiliate attribution.
  }
}

export function getStoredAffiliateCode() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    return normalizeAffiliateCode(window.localStorage.getItem(AFFILIATE_CODE_STORAGE_KEY));
  } catch {
    return undefined;
  }
}

export function clearStoredAffiliateCode() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(AFFILIATE_CODE_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function appendAffiliateCodeToPath(path: string, affiliateCode?: string) {
  const normalized = normalizeAffiliateCode(affiliateCode);

  if (!normalized) {
    return path;
  }

  const [pathname, search = ''] = path.split('?', 2);
  const searchParams = new URLSearchParams(search);
  searchParams.set('aff', normalized);

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}
