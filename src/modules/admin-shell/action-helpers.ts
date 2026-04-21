import type {
  AdminCreateAffiliatePayoutRequest,
  AdminUpdateAffiliatePayoutStatusRequest,
  AdminCatalogAffiliateSettingsUpdateRequest,
  AdminCatalogServiceUpdateRequest,
  AdminCatalogServiceUpsertRequest,
  CatalogServiceStatus,
  SupplierSyncName,
  UserRole,
  UserStatus,
} from '../../lib/api/contracts';
import { ApiClientError } from '../../lib/api/http';

export type AdminActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

export function readRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

export function readOptionalString(formData: FormData, key: string) {
  return readRequiredString(formData, key) || undefined;
}

export function readOptionalInt(formData: FormData, key: string) {
  const value = readRequiredString(formData, key);

  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isNaN(parsed) ? undefined : parsed;
}

export function readRole(formData: FormData): UserRole | undefined {
  const value = readRequiredString(formData, 'role');
  return value === 'customer' || value === 'admin' ? value : undefined;
}

export function readStatus(formData: FormData): UserStatus | undefined {
  const value = readRequiredString(formData, 'status');
  return value === 'active' || value === 'disabled' ? value : undefined;
}

export function readCatalogStatus(formData: FormData): CatalogServiceStatus | undefined {
  const value = readRequiredString(formData, 'status');
  return value === 'active' || value === 'inactive' ? value : undefined;
}

export function readWalletDirection(formData: FormData): 'credit' | 'debit' | undefined {
  const value = readRequiredString(formData, 'direction');
  return value === 'credit' || value === 'debit' ? value : undefined;
}

export function readWalletAdjustmentType(formData: FormData): 'wallet_adjustment_admin' | 'wallet_reversal_admin' | undefined {
  const value = readRequiredString(formData, 'type');
  return value === 'wallet_adjustment_admin' || value === 'wallet_reversal_admin' ? value : undefined;
}

export function readBooleanString(formData: FormData, key: string): boolean | undefined {
  const value = readRequiredString(formData, key);

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
}

export function readSupplierSyncName(formData: FormData): SupplierSyncName | undefined {
  const value = readRequiredString(formData, 'supplierName');

  if (value === 'cheapsmmglobal' || value === 'instabarato') {
    return value;
  }

  return undefined;
}

export function parseCatalogCreatePayload(formData: FormData):
  | { value: AdminCatalogServiceUpsertRequest }
  | { error: AdminActionState } {
  const base = parseCatalogFields(formData, true);

  if ('error' in base) {
    return base;
  }

  const { value } = base;

  return {
    value: {
      name: value.name as string,
      publicPrice: value.publicPrice as string,
      socialNetwork: value.socialNetwork as string,
      category: value.category as string,
      type: value.type as string,
      minQuantity: value.minQuantity as number,
      maxQuantity: value.maxQuantity as number,
      supplierServiceId: value.supplierServiceId as number,
      ...(value.description !== undefined ? { description: value.description } : {}),
      ...(value.status !== undefined ? { status: value.status } : {}),
      ...(value.sortOrder !== undefined ? { sortOrder: value.sortOrder } : {}),
      ...(value.supplierName !== undefined ? { supplierName: value.supplierName } : {}),
      ...(value.metadata !== undefined ? { metadata: value.metadata } : {}),
    },
  };
}

export function parseCatalogUpdatePayload(formData: FormData):
  | { value: AdminCatalogServiceUpdateRequest }
  | { error: AdminActionState } {
  const base = parseCatalogFields(formData, false);

  if ('error' in base) {
    return base;
  }

  return { value: base.value };
}

export function parseAffiliatePayoutPayload(formData: FormData):
  | { value: AdminCreateAffiliatePayoutRequest; commissionIds: number[] }
  | { error: AdminActionState } {
  const affiliateProfileId = readPositiveInteger(readRequiredString(formData, 'affiliateProfileId'));
  const commissionIds = splitCommissionIds(readRequiredString(formData, 'commissionIds'));
  const notes = readOptionalString(formData, 'notes');

  if (!affiliateProfileId) {
    return {
      error: {
        status: 'error',
        message: 'Informe um ID numerico de perfil afiliado para registrar o payout.',
      },
    };
  }

  if (commissionIds.length === 0) {
    return {
      error: {
        status: 'error',
        message: 'Informe ao menos um ID numerico de comissao aprovada.',
      },
    };
  }

  return {
    value: {
      affiliateProfileId,
      commissionIds,
      ...(notes ? { notes } : {}),
    },
    commissionIds,
  };
}

export function parseAffiliatePayoutStatusPayload(formData: FormData):
  | { payoutId: string; value: AdminUpdateAffiliatePayoutStatusRequest }
  | { error: AdminActionState } {
  const payoutId = readRequiredString(formData, 'payoutId');
  const status = readAffiliatePayoutStatus(formData);
  const notes = readOptionalString(formData, 'notes');
  const statusReason = readOptionalString(formData, 'statusReason');

  if (!payoutId) {
    return {
      error: {
        status: 'error',
        message: 'Informe um payout valido para atualizar.',
      },
    };
  }

  if (!status) {
    return {
      error: {
        status: 'error',
        message: 'Escolha um status valido para o payout.',
      },
    };
  }

  return {
    payoutId,
    value: {
      status,
      ...(notes ? { notes } : {}),
      ...(statusReason ? { statusReason } : {}),
    },
  };
}

export function parseCatalogAffiliateSettingsUpdatePayload(formData: FormData):
  | { value: AdminCatalogAffiliateSettingsUpdateRequest }
  | { error: AdminActionState } {
  const affiliateEnabled = readBooleanString(formData, 'affiliateEnabled');
  const affiliateCommissionPercent = normalizePercentInput(readOptionalString(formData, 'affiliateCommissionPercent'));

  if (affiliateEnabled === undefined) {
    return {
      error: {
        status: 'error',
        message: 'Informe se o servico deve ficar afiliavel ou nao.',
      },
    };
  }

  if (affiliateEnabled) {
    if (!affiliateCommissionPercent) {
      return {
        error: {
          status: 'error',
          message: 'Informe um percentual maior que zero para ativar a afiliacao.',
        },
      };
    }

    return {
      value: {
        isAffiliateEnabled: true,
        affiliateCommissionPercent,
      },
    };
  }

  return {
    value: {
      isAffiliateEnabled: false,
    },
  };
}

export function mapAdminActionError(error: unknown, fallback: string): AdminActionState {
  if (error instanceof ApiClientError) {
    return {
      status: 'error',
      message: error.message || fallback,
    };
  }

  return {
    status: 'error',
    message: fallback,
  };
}

function parseCatalogFields(
  formData: FormData,
  requireMandatory: boolean,
): { value: AdminCatalogServiceUpdateRequest } | { error: AdminActionState } {
  const name = readOptionalString(formData, 'name');
  const publicPrice = readOptionalString(formData, 'publicPrice');
  const socialNetwork = readOptionalString(formData, 'socialNetwork');
  const category = readOptionalString(formData, 'category');
  const type = readOptionalString(formData, 'type');
  const supplierName = readOptionalString(formData, 'supplierName');
  const description = readOptionalString(formData, 'description');
  const clearDescription = readRequiredString(formData, 'clearDescription') === 'true';
  const clearMetadata = readRequiredString(formData, 'clearMetadata') === 'true';
  const status = readCatalogStatus(formData);
  const sortOrder = readOptionalInt(formData, 'sortOrder');
  const minQuantity = readOptionalInt(formData, 'minQuantity');
  const maxQuantity = readOptionalInt(formData, 'maxQuantity');
  const supplierServiceId = readOptionalInt(formData, 'supplierServiceId');
  const metadataInput = readRequiredString(formData, 'metadata');

  if (
    requireMandatory &&
    (!name || !publicPrice || !socialNetwork || !category || !type || minQuantity === undefined || maxQuantity === undefined || supplierServiceId === undefined)
  ) {
    return {
      error: {
        status: 'error',
        message: 'Nome, preco, rede, categoria, tipo, faixa e supplier service id sao obrigatorios na criacao.',
      },
    };
  }

  if ((minQuantity !== undefined && minQuantity < 1) || (maxQuantity !== undefined && maxQuantity < 1)) {
    return {
      error: {
        status: 'error',
        message: 'As quantidades minima e maxima devem ser inteiros positivos.',
      },
    };
  }

  if (minQuantity !== undefined && maxQuantity !== undefined && maxQuantity < minQuantity) {
    return {
      error: {
        status: 'error',
        message: 'A quantidade maxima nao pode ser menor que a minima.',
      },
    };
  }

  if (supplierServiceId !== undefined && supplierServiceId < 1) {
    return {
      error: {
        status: 'error',
        message: 'Informe um supplier service id valido.',
      },
    };
  }

  const metadata = parseOptionalJson(metadataInput);

  if (metadata.error) {
    return {
      error: {
        status: 'error',
        message: 'Metadata precisa ser um JSON valido quando preenchido.',
      },
    };
  }

  const value: AdminCatalogServiceUpdateRequest = {
    ...(name ? { name } : {}),
    ...(publicPrice ? { publicPrice } : {}),
    ...(status ? { status } : {}),
    ...(sortOrder !== undefined ? { sortOrder } : {}),
    ...(socialNetwork ? { socialNetwork } : {}),
    ...(category ? { category } : {}),
    ...(type ? { type } : {}),
    ...(minQuantity !== undefined ? { minQuantity } : {}),
    ...(maxQuantity !== undefined ? { maxQuantity } : {}),
    ...(supplierName ? { supplierName } : {}),
    ...(supplierServiceId !== undefined ? { supplierServiceId } : {}),
    ...(clearDescription ? { description: null } : description ? { description } : {}),
    ...(clearMetadata ? { metadata: null } : metadata.value !== undefined ? { metadata: metadata.value } : {}),
  };

  return { value };
}

function parseOptionalJson(value: string): { value?: unknown; error?: true } {
  if (!value) {
    return {};
  }

  try {
    return { value: JSON.parse(value) };
  } catch {
    return { error: true };
  }
}

function normalizePercentInput(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const normalized = value.replace(',', '.').trim();

  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return undefined;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return normalized;
}

function readPositiveInteger(value: string) {
  if (!value) {
    return undefined;
  }

  if (!/^\d+$/.test(value.trim())) {
    return undefined;
  }

  const parsed = Number(value.trim());

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

function readAffiliatePayoutStatus(formData: FormData): AdminUpdateAffiliatePayoutStatusRequest['status'] | undefined {
  const value = readRequiredString(formData, 'status');

  if (value === 'processing' || value === 'paid' || value === 'failed' || value === 'cancelled') {
    return value;
  }

  return undefined;
}

function splitCommissionIds(value: string) {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(/[\n,;]+/)
        .map((item) => readPositiveInteger(item.trim()))
        .filter((item): item is number => item !== undefined),
    ),
  );
}
