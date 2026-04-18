export type CustomerProfileEditState =
  | {
      status: 'idle';
      message?: undefined;
    }
  | {
      status: 'blocked' | 'error';
      message: string;
    };

export type CustomerProfileEditDraft = {
  name: string;
  phone?: string;
};

export const initialCustomerProfileEditState: CustomerProfileEditState = {
  status: 'idle',
};

export const customerProfileEditContract = {
  endpoint: 'PATCH /me',
  isAvailable: false,
  reason: 'O contrato operacional validado ainda nao descreve o request body aceito para atualizar o proprio perfil.',
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

export function createCustomerProfileEditBlockedState(_: CustomerProfileEditDraft): CustomerProfileEditState {
  return {
    status: 'blocked',
    message:
      'Seu painel de edicao ja esta pronto, mas o salvamento ainda depende da liberacao segura dessa atualizacao no backend. Enquanto isso, seu email, nome e telefone seguem como consulta.',
  };
}

function readTrimmedString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}
