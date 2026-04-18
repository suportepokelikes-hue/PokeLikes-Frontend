'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { updateCustomerProfile } from '@/lib/api/customer';
import { getServerSession } from '@/lib/auth/cookies';
import { getLoginPath } from '@/lib/auth/navigation';
import { writeServerUserCookie } from '@/lib/auth/server-cookies';
import {
  mapCustomerProfileEditError,
  parseCustomerProfileEditDraft,
  type CustomerProfileEditState,
} from './customer-profile-edit';

export async function updateCustomerProfileAction(
  _: CustomerProfileEditState,
  formData: FormData,
): Promise<CustomerProfileEditState> {
  const session = await getServerSession();

  if (session.status !== 'authenticated' || session.user.role !== 'customer') {
    redirect(getLoginPath({ reason: 'required', returnTo: '/app/profile?edit=1' }));
  }

  const parsed = parseCustomerProfileEditDraft(formData);

  if ('error' in parsed) {
    return parsed.error;
  }

  try {
    const updatedProfile = await updateCustomerProfile({ accessToken: session.accessToken }, parsed.value);
    await writeServerUserCookie(updatedProfile);
  } catch (error) {
    return mapCustomerProfileEditError(error);
  }

  revalidatePath('/app');
  revalidatePath('/app/profile');
  redirect('/app/profile?updated=1');
}
