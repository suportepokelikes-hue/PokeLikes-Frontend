'use server';

import { redirect } from 'next/navigation';

import { login, logout, registerCustomer } from '@/lib/api/auth';
import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath, getPostAuthRedirectPath, normalizeReturnTo } from '@/lib/auth/navigation';
import { clearServerSessionCookies, writeServerSessionCookies } from '@/lib/auth/server-cookies';
import { mapLoginError, mapRegisterError, readTrimmedString } from '@/modules/auth/action-helpers';
import type { AuthFormState } from '@/modules/auth/types';

export async function loginAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = readTrimmedString(formData, 'email');
  const password = readTrimmedString(formData, 'password');
  const returnTo = normalizeReturnTo(readTrimmedString(formData, 'returnTo'));

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
  const name = readTrimmedString(formData, 'name');
  const email = readTrimmedString(formData, 'email');
  const phone = readTrimmedString(formData, 'phone');
  const password = readTrimmedString(formData, 'password');
  const returnTo = normalizeReturnTo(readTrimmedString(formData, 'returnTo'));

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
