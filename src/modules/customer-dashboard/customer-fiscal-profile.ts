import type { FiscalProfileResource, FiscalTaxIdType, UserSummary } from '@/lib/api/contracts';

type FiscalUser = Pick<UserSummary, 'taxId' | 'fiscalProfile'>;

export function getUserFiscalProfile(user: FiscalUser): FiscalProfileResource | null {
  if (user.fiscalProfile?.taxId) {
    return user.fiscalProfile;
  }

  if (!user.taxId) {
    return null;
  }

  const inferredType = inferTaxIdType(user.taxId);

  return {
    taxId: user.taxId,
    taxIdType: inferredType ?? 'cpf',
  };
}

export function getUserTaxId(user: FiscalUser) {
  return getUserFiscalProfile(user)?.taxId ?? null;
}

export function hasUserFiscalIdentity(user: FiscalUser) {
  return Boolean(getUserTaxId(user));
}

export function getUserTaxIdType(user: FiscalUser) {
  return getUserFiscalProfile(user)?.taxIdType ?? null;
}

export function getFiscalIdentityLabel(user: FiscalUser) {
  const taxIdType = getUserTaxIdType(user);

  if (taxIdType === 'cpf') {
    return 'CPF';
  }

  if (taxIdType === 'cnpj') {
    return 'CNPJ';
  }

  return 'CPF/CNPJ';
}

export function formatTaxIdForDisplay(value?: string | null) {
  if (!value) {
    return 'Nao informado';
  }

  const digits = value.replace(/\D/g, '');

  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  if (digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  return value;
}

export function isValidTaxIdInput(value: string) {
  const digits = value.replace(/\D/g, '');

  return digits.length === 11 || digits.length === 14;
}

function inferTaxIdType(value: string): FiscalTaxIdType | null {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 11) {
    return 'cpf';
  }

  if (digits.length === 14) {
    return 'cnpj';
  }

  return null;
}
