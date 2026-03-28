'use server';

import { redirect } from 'next/navigation';

import { ApiClientError } from '@/lib/api/http';
import { login, logout, registerCustomer } from '@/lib/api/auth';
import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath, getPostAuthRedirectPath, normalizeReturnTo } from '@/lib/auth/navigation';
import { clearServerSessionCookies, writeServerSessionCookies } from '@/lib/auth/server-cookies';
import type { AuthFormState } from '@/modules/auth/types';

export async function loginAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = readRequiredString(formData, 'email');
  const password = readRequiredString(formData, 'password');
  const returnTo = normalizeReturnTo(readRequiredString(formData, 'returnTo'));

  if (!email || !password) {
    return {
      status: 'error',
      message: 'Preencha email e senha para entrar.',
    };
  }

  let role: 'customer' | 'admin';

  try {
    const session = await login({ email, password });
    await writeServerSessionCookies(session);
    role = session.user.role;
  } catch (error) {
    return mapLoginError(error);
  }

  redirect(getPostAuthRedirectPath(role, returnTo));
}

export async function registerAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name = readRequiredString(formData, 'name');
  const email = readRequiredString(formData, 'email');
  const phone = readRequiredString(formData, 'phone');
  const password = readRequiredString(formData, 'password');
  const returnTo = normalizeReturnTo(readRequiredString(formData, 'returnTo'));

  if (!name || !email || !phone || !password) {
    return {
      status: 'error',
      message: 'Preencha nome, email, telefone e senha para criar a conta.',
    };
  }

  let role: 'customer' | 'admin';

  try {
    const session = await registerCustomer({ name, email, phone, password });
    await writeServerSessionCookies(session);
    role = session.user.role;
  } catch (error) {
    return mapRegisterError(error);
  }

  redirect(getPostAuthRedirectPath(role, returnTo));
}

export async function logoutAction() {
  const session = await getServerSession();

  try {
    if (session.status === 'authenticated') {
      await logout({ refreshToken: session.refreshToken });
    }
  } catch {
    // The frontend should still clear local session even if backend revocation fails.
  }

  await clearServerSessionCookies();
  redirect(getLoginPath({ reason: 'logged_out' }));
}

function readRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

function mapAuthError(error: unknown, fallbackMessage: string): AuthFormState {
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

function mapLoginError(error: unknown): AuthFormState {
  if (error instanceof ApiClientError && error.status === 401) {
    return {
      status: 'error',
      message: 'Email ou senha invalidos. Revise as credenciais e tente novamente.',
    };
  }

  return mapAuthError(error, 'Nao foi possivel autenticar agora. Tente novamente em instantes.');
}

function mapRegisterError(error: unknown): AuthFormState {
  if (error instanceof ApiClientError && error.status === 400) {
    return {
      status: 'error',
      message: error.message || 'Revise nome, email, telefone e senha antes de enviar o cadastro.',
    };
  }

  return mapAuthError(error, 'Nao foi possivel concluir o cadastro agora. Tente novamente em instantes.');
}
