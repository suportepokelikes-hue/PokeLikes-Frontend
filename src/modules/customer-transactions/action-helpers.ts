import { ApiClientError } from '../../lib/api/http';
import type { CreateOrderRequest } from '../../lib/api/contracts';
import type { TransactionFormState } from './types';

export function readRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

export function readOptionalInt(formData: FormData, key: string) {
  const value = readRequiredString(formData, key);

  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isNaN(parsed) ? undefined : parsed;
}

export function readOptionalStringArray(formData: FormData, key: string) {
  const value = readRequiredString(formData, key);

  if (!value) {
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseCreatePixPayload(formData: FormData): { value: { amount: string } } | { error: TransactionFormState } {
  const amount = readRequiredString(formData, 'amount');

  if (!amount) {
    return {
      error: {
        status: 'error',
        message: 'Informe o valor para gerar a cobranca PIX.',
      },
    };
  }

  return {
    value: { amount },
  };
}

export function parseCreateOrderPayload(formData: FormData): { value: CreateOrderRequest } | { error: TransactionFormState } {
  const catalogServiceIdRaw = readRequiredString(formData, 'catalogServiceId');
  const catalogServiceId = Number.parseInt(catalogServiceIdRaw, 10);
  const link = readRequiredString(formData, 'link');
  const quantity = Number.parseInt(readRequiredString(formData, 'quantity'), 10);
  const runs = readOptionalInt(formData, 'runs');
  const interval = readOptionalInt(formData, 'interval');
  const comments = readOptionalStringArray(formData, 'comments');
  const answerNumberRaw = readRequiredString(formData, 'answerNumber');

  if (Number.isNaN(catalogServiceId)) {
    return {
      error: {
        status: 'error',
        message:
          'O contrato atual de criacao de pedido exige catalogServiceId numerico. Este servico nao pode ser convertido de forma segura.',
      },
    };
  }

  if (!link || Number.isNaN(quantity)) {
    return {
      error: {
        status: 'error',
        message: 'Informe link e quantidade validos para criar o pedido.',
      },
    };
  }

  return {
    value: {
      catalogServiceId,
      link,
      quantity,
      ...(runs !== undefined ? { runs } : {}),
      ...(interval !== undefined ? { interval } : {}),
      ...(comments.length > 0 ? { comments } : {}),
      ...(answerNumberRaw ? { answerNumber: answerNumberRaw } : {}),
    },
  };
}

export function mapTransactionFormError(error: unknown, fallbackMessage: string): TransactionFormState {
  if (error instanceof ApiClientError) {
    return {
      status: 'error',
      message: error.message || fallbackMessage,
    };
  }

  return {
    status: 'error',
    message: fallbackMessage,
  };
}
