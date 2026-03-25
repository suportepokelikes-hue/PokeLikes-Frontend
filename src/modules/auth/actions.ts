'use server';

import { redirect } from 'next/navigation';

import { ApiClientError } from '@/lib/api/http';
import { login, logout, registerCustomer } from '@/lib/api/auth';
import { getServerSession } from '@/lib/auth/cookies';
import { clearServerSessionCookies, writeServerSessionCookies } from '@/lib/auth/server-cookies';
import type { AuthFormState } from '@/modules/auth/types';

export async function loginAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = readRequiredString(formData, 'email');
  const password = readRequiredString(formData, 'password');

  if (!email || !password) {
    return {
      status: 'error',
      message: 'Preencha email e senha para entrar.',
    };
  }

  try {
    const session = await login({ email, password });
    await writeServerSessionCookies(session);
    redirect(session.user.role === 'admin' ? '/admin' : '/app');
  } catch (error) {
    return mapAuthError(error, 'Nao foi possivel autenticar com as credenciais informadas.');
  }
}

export async function registerAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name = readRequiredString(formData, 'name');
  const email = readRequiredString(formData, 'email');
  const phone = readRequiredString(formData, 'phone');
  const password = readRequiredString(formData, 'password');

  if (!name || !email || !phone || !password) {
    return {
      status: 'error',
      message: 'Preencha nome, email, telefone e senha para criar a conta.',
    };
  }

  try {
    const session = await registerCustomer({ name, email, phone, password });
    await writeServerSessionCookies(session);
    redirect(session.user.role === 'admin' ? '/admin' : '/app');
  } catch (error) {
    return mapAuthError(error, 'Nao foi possivel concluir o cadastro agora.');
  }
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
  redirect('/');
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
