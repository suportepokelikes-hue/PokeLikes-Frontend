import type { UpdateCurrentUserProfileRequest } from '../../lib/api/contracts';
import { ApiClientError } from '../../lib/api/http';

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
  editableFields: ['name', 'phone'],
  readonlyFields: ['email'],
} as const;

export function parseCustomerProfileEditDraft(
  formData: FormData,
): { value: CustomerProfileEditDraft } | { error: CustomerProfileEditState } {
  const name = readTrimmedString(formData, 'name');
  const phone = readTrimmedString(formData, 'phone');

  if (!name) {
    return {
      error: {
        status: 'error',
        message: 'Informe o nome que deve aparecer na sua conta.',
      },
    };
  }

  return {
    value: {
      name,
      ...(phone ? { phone } : {}),
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
