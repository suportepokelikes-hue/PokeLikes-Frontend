'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { login, logout, registerCustomer, requestEmailVerification } from '@/lib/api/auth';
import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath, getPostAuthRedirectPath, normalizeReferralCode, normalizeReturnTo } from '@/lib/auth/navigation';
import { clearServerSessionCookies, writeServerSessionCookies, writeServerUserCookie } from '@/lib/auth/server-cookies';
import {
  mapEmailVerificationRequestError,
  mapLoginError,
  mapRegisterError,
  readTrimmedString,
} from '@/modules/auth/action-helpers';
import type { AuthFormState, EmailVerificationRequestState } from '@/modules/auth/types';

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
  const referralCode = normalizeReferralCode(readTrimmedString(formData, 'referralCode'));
  const returnTo = normalizeReturnTo(readTrimmedString(formData, 'returnTo'));

  if (!name || !email || !phone || !password) {
    return {
      status: 'error',
      message: 'Preencha nome, email, telefone e senha para criar a conta.',
    };
  }

  let role: 'customer' | 'admin';

  try {
    const session = await registerCustomer({
      name,
      email,
      phone,
      password,
      ...(referralCode ? { referralCode } : {}),
    });
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

export async function requestEmailVerificationAction(
  _: EmailVerificationRequestState,
  _formData: FormData,
): Promise<EmailVerificationRequestState> {
  const session = await getServerSession();

  if (session.status !== 'authenticated') {
    redirect(getLoginPath({ reason: 'required', returnTo: '/app/profile' }));
  }

  try {
    const response = await requestEmailVerification(session.accessToken);

    if (response.status === 'already_verified') {
      await writeServerUserCookie({
        ...session.user,
        emailVerified: true,
      });
      revalidatePath('/app');
      revalidatePath('/app/profile');

      return {
        status: 'success',
        message: 'Seu email ja esta verificado.',
        delivery: response.delivery,
        expiresAt: response.expiresAt,
      };
    }

    return {
      status: 'success',
      message:
        response.delivery === 'preview'
          ? 'Token de verificacao gerado para desenvolvimento.'
          : 'Enviamos um email com o link de verificacao.',
      delivery: response.delivery,
      expiresAt: response.expiresAt,
      ...(process.env.NODE_ENV !== 'production' && response.previewToken
        ? {
            previewToken: response.previewToken,
            previewHref: `/verify-email?token=${encodeURIComponent(response.previewToken)}`,
          }
        : {}),
    };
  } catch (error) {
    return mapEmailVerificationRequestError(error);
  }
}
