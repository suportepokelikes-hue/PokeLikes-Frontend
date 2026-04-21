'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { applyToAffiliateProgram, updateCustomerAffiliatePix } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath } from '@/lib/auth/navigation';
import type { AffiliateApplyFormState } from './affiliate-form-state';

export type AffiliatePixFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

export async function applyToAffiliateProgramAction(
  _: AffiliateApplyFormState,
  _formData: FormData,
): Promise<AffiliateApplyFormState> {
  const session = await getServerSession();

  if (session.status !== 'authenticated' || session.user.role !== 'customer') {
    redirect(getLoginPath({ reason: 'required', returnTo: '/app/affiliate' }));
  }

  try {
    await applyToAffiliateProgram({ accessToken: session.accessToken });
  } catch (error) {
    return {
      status: 'error',
      message:
        error instanceof ApiClientError
          ? error.message
          : 'Nao foi possivel solicitar sua entrada no programa de afiliados agora.',
    };
  }

  revalidatePath('/app/affiliate');
  redirect('/app/affiliate');
}

export async function updateAffiliatePixAction(
  _: AffiliatePixFormState,
  formData: FormData,
): Promise<AffiliatePixFormState> {
  const session = await getServerSession();

  if (session.status !== 'authenticated' || session.user.role !== 'customer') {
    redirect(getLoginPath({ reason: 'required', returnTo: '/app/affiliate' }));
  }

  const pixKeyType = readFormString(formData, 'pixKeyType');
  const pixKey = readFormString(formData, 'pixKey');

  if (!pixKeyType || !pixKey) {
    return {
      status: 'error',
      message: 'Informe o tipo e a chave PIX para receber payouts.',
    };
  }

  try {
    await updateCustomerAffiliatePix(
      { accessToken: session.accessToken },
      {
        pixKeyType,
        pixKey,
      },
    );
  } catch (error) {
    return {
      status: 'error',
      message:
        error instanceof ApiClientError
          ? error.message
          : 'Nao foi possivel salvar sua chave PIX agora.',
    };
  }

  revalidatePath('/app/affiliate');

  return {
    status: 'success',
    message: 'Chave PIX salva com sucesso.',
  };
}

function readFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}
