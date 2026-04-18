import type { UpdateCurrentUserProfileRequest } from '../../lib/api/contracts';
import { ApiClientError } from '../../lib/api/http';
import { isValidTaxIdInput } from './customer-fiscal-profile';

export type CustomerProfileEditState =
  | {
      status: 'idle';
      message?: undefined;
    }
  | {
      status: 'error';
      message: string;
    };

export type CustomerProfileEditDraft = UpdateCurrentUserProfileRequest & {
  name: string;
};

export const initialCustomerProfileEditState: CustomerProfileEditState = {
  status: 'idle',
};

export const customerProfileEditContract = {
  endpoint: 'PATCH /me',
  isAvailable: true,
  editableFields: ['name', 'phone', 'taxId'],
  readonlyFields: ['email'],
} as const;

export function parseCustomerProfileEditDraft(
  formData: FormData,
): { value: CustomerProfileEditDraft } | { error: CustomerProfileEditState } {
  const name = readTrimmedString(formData, 'name');
  const phone = readTrimmedString(formData, 'phone');
  const taxId = readTrimmedString(formData, 'taxId');

  if (!name) {
    return {
      error: {
        status: 'error',
        message: 'Informe o nome que deve aparecer na sua conta.',
      },
    };
  }

  if (taxId && !isValidTaxIdInput(taxId)) {
    return {
      error: {
        status: 'error',
        message: 'Informe um CPF ou CNPJ valido para liberar a geracao de PIX.',
      },
    };
  }

  return {
    value: {
      name,
      ...(phone ? { phone } : {}),
      ...(taxId ? { taxId } : {}),
    },
  };
}

function readTrimmedString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export function mapCustomerProfileEditError(error: unknown): CustomerProfileEditState {
  if (error instanceof ApiClientError) {
    return {
      status: 'error',
      message: error.message || 'Nao foi possivel atualizar seus dados agora.',
    };
  }

  return {
    status: 'error',
    message: 'Nao foi possivel atualizar seus dados agora.',
  };
}
