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

export function mapRegisterError(error: unknown): AuthFormState {
  if (error instanceof ApiClientError && error.status === 400) {
    return {
      status: 'error',
      message: error.message || 'Revise nome, email, telefone e senha antes de enviar o cadastro.',
    };
  }

  return mapAuthError(error, 'Nao foi possivel concluir o cadastro agora. Tente novamente em instantes.');
}
