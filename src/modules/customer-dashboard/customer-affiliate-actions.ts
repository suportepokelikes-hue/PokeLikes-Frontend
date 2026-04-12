'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { applyToAffiliateProgram } from '@/lib/api/customer';
import { ApiClientError } from '@/lib/api/http';
import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath } from '@/lib/auth/navigation';
import type { AffiliateApplyFormState } from './affiliate-form-state';

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
