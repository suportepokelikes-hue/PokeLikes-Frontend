import { ApiClientError } from '../../lib/api/http';
import type { AuthFormState } from './types';

export function readTrimmedString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

export function mapAuthError(error: unknown, fallbackMessage: string): AuthFormState {
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

export function mapLoginError(error: unknown): AuthFormState {
  if (error instanceof ApiClientError && error.status === 401) {
    return {
      status: 'error',
      message: 'Email ou senha invalidos. Revise as credenciais e tente novamente.',
    };
  }

  return mapAuthError(error, 'Nao foi possivel autenticar agora. Tente novamente em instantes.');
}

export function mapGoogleAuthError(error: unknown): AuthFormState {
  if (error instanceof ApiClientError && error.status === 400 && hasReferralCodeHint(error)) {
    return {
      status: 'error',
      message: 'Codigo de indicacao invalido. Revise o codigo ou continue sem ele.',
    };
  }

  if (error instanceof ApiClientError && (error.status === 400 || error.status === 401)) {
    return {
      status: 'error',
      message: 'Nao foi possivel validar sua conta Google. Tente novamente ou entre com email e senha.',
    };
  }

  return mapAuthError(error, 'O login com Google nao esta disponivel agora. Tente novamente em instantes.');
}

export function mapRegisterError(error: unknown): AuthFormState {
  if (error instanceof ApiClientError && error.status === 400 && hasReferralCodeHint(error)) {
    return {
      status: 'error',
      message: 'Codigo de indicacao invalido. Revise o codigo ou continue o cadastro sem ele.',
    };
  }

  if (error instanceof ApiClientError && error.status === 400) {
    return {
      status: 'error',
      message: error.message || 'Revise nome, email, telefone e senha antes de enviar o cadastro.',
    };
  }

  return mapAuthError(error, 'Nao foi possivel concluir o cadastro agora. Tente novamente em instantes.');
}

export function mapEmailVerificationRequestError(error: unknown) {
  if (error instanceof ApiClientError && error.status === 503) {
    return {
      status: 'error' as const,
      message: 'A verificacao por email nao esta disponivel agora. Tente novamente mais tarde.',
    };
  }

  return {
    status: 'error' as const,
    message:
      error instanceof ApiClientError && error.message
        ? error.message
        : 'Nao foi possivel solicitar a verificacao de email agora.',
  };
}

function hasReferralCodeHint(error: ApiClientError) {
  const haystack = [error.code, error.message, safeStringify(error.details)].join(' ').toLowerCase();
  return haystack.includes('referral');
}

function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}
