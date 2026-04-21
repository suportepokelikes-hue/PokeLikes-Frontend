import type {
  AffiliateCommissionResource,
  AffiliatePayoutResource,
  AffiliatePixKeyResource,
  AffiliateProfileResource,
  AffiliateSummaryResponse,
  Money,
  PaginatedResponse,
} from './contracts';

type UnknownRecord = Record<string, unknown>;

export function normalizeAffiliateProfile(input: unknown): AffiliateProfileResource | null {
  if (input === null || input === undefined) {
    return null;
  }

  if (!isRecord(input)) {
    return null;
  }

  return {
    id: readString(input, ['id']) ?? '',
    affiliateCode: readString(input, ['affiliateCode', 'publicCode']),
    publicCode: readString(input, ['publicCode', 'affiliateCode']),
    status: readString(input, ['status']) ?? 'unknown',
    affiliateCommissionPercent: readString(input, ['affiliateCommissionPercent', 'commissionPercent', 'percent']),
    pixKeyType: readNullableString(input, ['pixKeyType', 'pix_key_type', 'payoutPixKeyType', 'payout_pix_key_type']),
    pixKey: readNullableString(input, ['pixKey', 'pix_key', 'payoutPixKey', 'payout_pix_key']),
    approvedAt: readNullableString(input, ['approvedAt']),
    suspendedAt: readNullableString(input, ['suspendedAt']),
    createdAt: readString(input, ['createdAt']) ?? '',
    updatedAt: readString(input, ['updatedAt']) ?? '',
    user: normalizeUserReference(readNestedRecord(input, ['user'])),
  };
}

export function normalizeAffiliatePixKey(input: unknown): AffiliatePixKeyResource | null {
  if (input === null || input === undefined) {
    return null;
  }

  if (!isRecord(input)) {
    return null;
  }

  const pixKeyType = readString(input, ['pixKeyType', 'pix_key_type', 'type']);
  const pixKey = readString(input, ['pixKey', 'pix_key', 'key']);

  if (!pixKeyType || !pixKey) {
    return null;
  }

  return {
    pixKeyType,
    pixKey,
    updatedAt: readString(input, ['updatedAt']) ?? '',
  };
}

export function normalizeAffiliateSummary(input: unknown): AffiliateSummaryResponse {
  const source = isRecord(input) ? input : {};
  const totalsSource = readNestedRecord(source, ['totals', 'summary']) ?? {};

  return {
    affiliateProfile: normalizeAffiliateProfile(
      source.affiliateProfile ?? source.profile ?? source.affiliateProfileResource ?? source.affiliate ?? null,
    ),
    totals: normalizeTotals(totalsSource),
  };
}

export function normalizeAffiliateCommissionsResponse(input: unknown): PaginatedResponse<AffiliateCommissionResource> {
  return normalizePaginatedResponse(input, ['items', 'data', 'results', 'commissions'], normalizeAffiliateCommission);
}

export function normalizeAffiliatePayoutsResponse(input: unknown): PaginatedResponse<AffiliatePayoutResource> {
  return normalizePaginatedResponse(input, ['items', 'data', 'results', 'payouts'], normalizeAffiliatePayout);
}

export function normalizeAffiliateProfilesResponse(input: unknown): PaginatedResponse<AffiliateProfileResource> {
  return normalizePaginatedResponse(input, ['items', 'data', 'results', 'profiles', 'affiliates'], normalizeAffiliateProfile);
}

export function normalizeAffiliatePayout(input: unknown): AffiliatePayoutResource {
  const source = isRecord(input) ? input : {};
  const affiliate = readNestedRecord(source, ['affiliate']) ?? {};
  const pixKey = normalizePayoutPixKey(readNestedRecord(source, ['pixKey']) ?? source);
  const commissionIds = normalizeCommissionIds(source);

  return {
    id: readString(source, ['id']) ?? '',
    affiliateProfileId: readString(source, ['affiliateProfileId', 'profileId']) ?? '',
    amount: readString(source, ['amount', 'payoutAmount', 'totalAmount']) ?? '0',
    status: readString(source, ['status']) ?? 'unknown',
    createdAt: readString(source, ['createdAt']) ?? '',
    processedAt: readNullableString(source, ['processedAt']),
    processedByUserId: readNullableString(source, ['processedByUserId']),
    notes: readNullableString(source, ['notes']),
    statusReason: readNullableString(source, ['statusReason']),
    provider: readNullableString(source, ['provider']),
    externalReference: readNullableString(source, ['externalReference']),
    providerTransactionId: readNullableString(source, ['providerTransactionId']),
    providerStatus: readNullableString(source, ['providerStatus']),
    providerErrorCode: readNullableString(source, ['providerErrorCode']),
    providerErrorMessage: readNullableString(source, ['providerErrorMessage']),
    providerSyncedAt: readNullableString(source, ['providerSyncedAt']),
    pixKey,
    requestedAt: readString(source, ['requestedAt']) ?? readString(source, ['createdAt']) ?? '',
    processingAt: readNullableString(source, ['processingAt']),
    paidAt: readNullableString(source, ['paidAt']),
    failedAt: readNullableString(source, ['failedAt']),
    cancelledAt: readNullableString(source, ['cancelledAt']),
    affiliate: {
      userId: readString(affiliate, ['userId']) ?? '',
      publicCode: readString(affiliate, ['publicCode', 'affiliateCode']) ?? '',
      affiliateCode: readString(affiliate, ['affiliateCode', 'publicCode']) ?? '',
    },
    ...(commissionIds.length > 0 ? { commissionIds } : {}),
    ...(readNumber(source, ['commissionCount']) !== undefined
      ? { commissionCount: readNumber(source, ['commissionCount']) }
      : commissionIds.length > 0
        ? { commissionCount: commissionIds.length }
        : {}),
  };
}

function normalizePayoutPixKey(source: UnknownRecord | null) {
  if (!source) {
    return null;
  }

  const type = readString(source, ['type', 'pixKeyType', 'pix_key_type']);
  const key = readString(source, ['key', 'pixKey', 'pix_key']);

  return type && key ? { type, key } : null;
}

export function normalizeAffiliateCommission(input: unknown): AffiliateCommissionResource {
  const source = isRecord(input) ? input : {};
  const order = readNestedRecord(source, ['order']);
  const payout = readNestedRecord(source, ['payout']);

  return {
    id: readString(source, ['id']) ?? '',
    status: readString(source, ['status']) ?? 'unknown',
    affiliateCommissionPercent: readString(source, ['commissionPercentSnapshot', 'affiliateCommissionPercent', 'commissionPercent', 'percent']),
    commissionAmount: normalizeMoney(source, ['commissionAmount', 'amount']) ?? { amount: '0', currency: 'BRL' },
    createdAt: readString(source, ['createdAt']) ?? '',
    updatedAt: readString(source, ['updatedAt']) ?? readString(source, ['createdAt']) ?? '',
    affiliateProfileId:
      readString(source, ['affiliateProfileId', 'profileId']) ??
      readString(readNestedRecord(source, ['affiliateProfile']) ?? {}, ['id']),
    orderId: readString(source, ['orderId']) ?? readString(order ?? {}, ['id']) ?? null,
    payoutId: readString(source, ['payoutId']) ?? readString(payout ?? {}, ['id']) ?? null,
    paidAt: readNullableString(source, ['paidAt']),
  };
}

export function getAffiliateDisplayCode(profile: AffiliateProfileResource | null | undefined) {
  if (!profile) {
    return null;
  }

  return profile.publicCode ?? profile.affiliateCode ?? null;
}

function normalizePaginatedResponse<T>(
  input: unknown,
  itemKeys: string[],
  normalizeItem: (value: unknown) => T | null,
): PaginatedResponse<T> {
  const source = isRecord(input) ? input : {};
  const items = readItems(source, itemKeys)
    .map(normalizeItem)
    .filter((value): value is T => value !== null);

  const page = readNumber(source, ['page', 'pageNumber']) ?? 1;
  const pageSize = readNumber(source, ['pageSize', 'perPage']) ?? items.length;
  const totalItems = readNumber(source, ['totalItems', 'total', 'count']) ?? items.length;
  const totalPages = readNumber(source, ['totalPages', 'pages']) ?? (pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1);

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
  };
}

function normalizeTotals(input: UnknownRecord) {
  const totals: Record<string, number | Money> = {};

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'number') {
      totals[key] = value;
      continue;
    }

    if (typeof value === 'string') {
      const parsed = Number(value);

      if (Number.isFinite(parsed)) {
        const normalizedKey = key.replace(/[_-]/g, '').toLowerCase();

        if (normalizedKey.includes('count')) {
          totals[key] = parsed;
          continue;
        }

        if (normalizedKey.includes('amount') || normalizedKey.includes('revenue')) {
          totals[key] = { amount: value, currency: 'BRL' };
          continue;
        }
      }
    }

    const money = normalizeLooseMoney(value);

    if (money) {
      totals[key] = money;
    }
  }

  return totals;
}

function normalizeMoney(source: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const money = normalizeLooseMoney(source[key]);

    if (money) {
      return money;
    }
  }

  return null;
}

function normalizeLooseMoney(input: unknown): Money | null {
  if (typeof input === 'string' && input.trim()) {
    return {
      amount: input.trim(),
      currency: 'BRL',
    };
  }

  if (!isRecord(input)) {
    return null;
  }

  const amount = readString(input, ['amount', 'value']);
  const currency = readString(input, ['currency']) ?? 'BRL';

  if (!amount) {
    return null;
  }

  return {
    amount,
    currency,
  };
}

function normalizeUserReference(input: UnknownRecord | null) {
  if (!input) {
    return null;
  }

  const id = readString(input, ['id']);
  const name = readString(input, ['name']);
  const email = readString(input, ['email']);

  if (!id || !name || !email) {
    return null;
  }

  return { id, name, email };
}

function readItems(source: UnknownRecord, itemKeys: string[]) {
  if (Array.isArray(source)) {
    return source;
  }

  for (const key of itemKeys) {
    const value = source[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function readNestedRecord(source: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = source[key];

    if (isRecord(value)) {
      return value;
    }
  }

  return null;
}

function normalizeCommissionIds(source: UnknownRecord) {
  const value = source.commissionIds;

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string' && item.trim()) {
        return item.trim();
      }

      if (typeof item === 'number' && Number.isFinite(item)) {
        return String(item);
      }

      return '';
    })
    .filter(Boolean);
}

function readString(source: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function readNullableString(source: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = source[key];

    if (value === null) {
      return null;
    }

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function readNumber(source: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = Number(value);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
